import type { VFSNode } from '@/types';
import { createInitialFilesystem, buildPaths } from '@/data/filesystem';
import { EventBus } from '@/engine/EventBus';

class VirtualFSImpl {
  private root: VFSNode;

  constructor() {
    this.root = buildPaths(createInitialFilesystem());
  }

  reset(): void {
    this.root = buildPaths(createInitialFilesystem());
  }

  private normalizePath(path: string, cwd: string): string {
    // Handle relative paths
    if (!path.startsWith('/')) {
      path = cwd.endsWith('/') ? cwd + path : cwd + '/' + path;
    }

    // Resolve . and ..
    const parts = path.split('/').filter(Boolean);
    const resolved: string[] = [];
    for (const part of parts) {
      if (part === '.') continue;
      if (part === '..') {
        resolved.pop();
      } else {
        resolved.push(part);
      }
    }
    return '/' + resolved.join('/');
  }

  getNode(path: string, cwd = '/'): VFSNode | null {
    const normalized = this.normalizePath(path, cwd);
    if (normalized === '/') return this.root;

    const parts = normalized.split('/').filter(Boolean);
    let current = this.root;

    for (const part of parts) {
      if (!current.children) return null;
      const child = current.children.find((c) => c.name === part);
      if (!child) return null;
      current = child;
    }

    // Check for trap files
    if (current.isTrap) {
      EventBus.emit('security_violation', {
        type: 'credential_access',
        path: current.path,
      });
    }

    return current;
  }

  listDir(path: string, cwd = '/', showHidden = false): VFSNode[] {
    const node = this.getNode(path, cwd);
    if (!node || node.type !== 'directory') return [];
    const children = node.children || [];
    if (showHidden) return children;
    return children.filter((c) => !c.isHidden);
  }

  readFile(path: string, cwd = '/'): string | null {
    const node = this.getNode(path, cwd);
    if (!node || node.type !== 'file') return null;
    return node.content ?? '';
  }

  writeFile(path: string, content: string, cwd = '/'): boolean {
    const normalized = this.normalizePath(path, cwd);
    const existing = this.getNode(normalized, '/');

    if (existing && existing.type === 'file') {
      existing.content = content;
      existing.size = content.length;
      existing.modifiedAt = Date.now();
      EventBus.emit('fs_change', { type: 'write', path: normalized });
      return true;
    }

    // Create new file
    const parentPath = normalized.substring(0, normalized.lastIndexOf('/')) || '/';
    const fileName = normalized.substring(normalized.lastIndexOf('/') + 1);
    const parent = this.getNode(parentPath, '/');

    if (!parent || parent.type !== 'directory') return false;

    const newFile: VFSNode = {
      name: fileName,
      type: 'file',
      path: normalized,
      content,
      permissions: 'rw-r--r--',
      size: content.length,
      modifiedAt: Date.now(),
    };

    parent.children = parent.children || [];
    parent.children.push(newFile);
    EventBus.emit('fs_change', { type: 'create', path: normalized });
    return true;
  }

  mkdir(path: string, cwd = '/'): boolean {
    const normalized = this.normalizePath(path, cwd);
    const existing = this.getNode(normalized, '/');
    if (existing) return false;

    const parentPath = normalized.substring(0, normalized.lastIndexOf('/')) || '/';
    const dirName = normalized.substring(normalized.lastIndexOf('/') + 1);
    const parent = this.getNode(parentPath, '/');

    if (!parent || parent.type !== 'directory') return false;

    const newDir: VFSNode = {
      name: dirName,
      type: 'directory',
      path: normalized,
      children: [],
      permissions: 'rwxr-xr-x',
      size: 4096,
      modifiedAt: Date.now(),
    };

    parent.children = parent.children || [];
    parent.children.push(newDir);
    EventBus.emit('fs_change', { type: 'mkdir', path: normalized });
    return true;
  }

  remove(path: string, cwd = '/', recursive = false): boolean {
    const normalized = this.normalizePath(path, cwd);
    if (normalized === '/') {
      EventBus.emit('security_violation', {
        type: 'dangerous_command',
        detail: 'Attempted to remove root filesystem',
      });
      return false;
    }

    const node = this.getNode(normalized, '/');
    if (!node) return false;

    if (node.type === 'directory' && node.children && node.children.length > 0 && !recursive) {
      return false; // directory not empty
    }

    // Check for dangerous rm patterns
    if (normalized === '/home' || normalized === '/home/user') {
      EventBus.emit('security_violation', {
        type: 'dangerous_command',
        detail: `Attempted to remove ${normalized}`,
      });
    }

    const parentPath = normalized.substring(0, normalized.lastIndexOf('/')) || '/';
    const parent = this.getNode(parentPath, '/');
    if (!parent || !parent.children) return false;

    parent.children = parent.children.filter((c) => c.path !== normalized);
    EventBus.emit('fs_change', { type: 'remove', path: normalized });
    return true;
  }

  copy(src: string, dest: string, cwd = '/'): boolean {
    const srcNode = this.getNode(src, cwd);
    if (!srcNode || srcNode.type !== 'file') return false;

    return this.writeFile(dest, srcNode.content || '', cwd);
  }

  move(src: string, dest: string, cwd = '/'): boolean {
    if (this.copy(src, dest, cwd)) {
      return this.remove(src, cwd);
    }
    return false;
  }

  exists(path: string, cwd = '/'): boolean {
    return this.getNode(path, cwd) !== null;
  }

  isDirectory(path: string, cwd = '/'): boolean {
    const node = this.getNode(path, cwd);
    return node?.type === 'directory' || false;
  }

  grep(pattern: string, path: string, cwd = '/'): { path: string; line: number; text: string }[] {
    const results: { path: string; line: number; text: string }[] = [];
    const node = this.getNode(path, cwd);
    if (!node) return results;

    const searchNode = (n: VFSNode) => {
      if (n.type === 'file' && n.content) {
        const lines = n.content.split('\n');
        lines.forEach((line, i) => {
          if (line.toLowerCase().includes(pattern.toLowerCase())) {
            results.push({ path: n.path, line: i + 1, text: line.trim() });
          }
        });
      }
      if (n.children) {
        n.children.forEach(searchNode);
      }
    };

    searchNode(node);
    return results;
  }

  // Calculate total disk usage
  getDiskUsage(): number {
    let total = 0;
    const countNode = (n: VFSNode) => {
      total += n.size;
      n.children?.forEach(countNode);
    };
    countNode(this.root);
    return total;
  }

  /** Collect all non-hidden file paths (for LLM prompt context) */
  getAllFilePaths(): string[] {
    const paths: string[] = [];
    const walk = (node: VFSNode) => {
      if (node.isHidden) return;
      if (node.type === 'file') {
        paths.push(node.path);
      }
      node.children?.forEach(walk);
    };
    walk(this.root);
    return paths;
  }

  resolve(path: string, cwd: string): string {
    return this.normalizePath(path, cwd);
  }
}

export const VirtualFS = new VirtualFSImpl();
