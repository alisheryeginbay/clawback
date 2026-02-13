import { type StateCreator } from 'zustand';
import type { ToolId, ToolState, TerminalEntry } from '@/types';
import { generateId } from '@/lib/utils';

export interface ToolSlice {
  tools: ToolState;
  setActiveTool: (tool: ToolId) => void;
  addTerminalEntry: (command: string, output: string, cwd: string, tick: number, isError?: boolean) => void;
  setTerminalCwd: (cwd: string) => void;
  openFile: (path: string) => void;
  closeFile: (path: string) => void;
  setActiveFile: (path: string | null) => void;
  clearTerminal: () => void;
  resetTools: () => void;
}

export const createToolSlice: StateCreator<ToolSlice> = (set) => ({
  tools: {
    activeTool: 'terminal',
    terminalHistory: [],
    terminalCwd: '/home/user',
    openFiles: [],
    activeFile: null,
  },

  setActiveTool: (tool) =>
    set((state) => ({ tools: { ...state.tools, activeTool: tool } })),

  addTerminalEntry: (command, output, cwd, tick, isError) =>
    set((state) => {
      const entry: TerminalEntry = {
        id: generateId(),
        command,
        output,
        cwd,
        timestamp: tick,
        isError,
      };
      return {
        tools: {
          ...state.tools,
          terminalHistory: [...state.tools.terminalHistory, entry],
        },
      };
    }),

  setTerminalCwd: (cwd) =>
    set((state) => ({ tools: { ...state.tools, terminalCwd: cwd } })),

  openFile: (path) =>
    set((state) => {
      if (state.tools.openFiles.includes(path)) {
        return { tools: { ...state.tools, activeFile: path } };
      }
      return {
        tools: {
          ...state.tools,
          openFiles: [...state.tools.openFiles, path],
          activeFile: path,
        },
      };
    }),

  closeFile: (path) =>
    set((state) => {
      const openFiles = state.tools.openFiles.filter((f) => f !== path);
      const activeFile =
        state.tools.activeFile === path
          ? openFiles[openFiles.length - 1] || null
          : state.tools.activeFile;
      return { tools: { ...state.tools, openFiles, activeFile } };
    }),

  setActiveFile: (path) =>
    set((state) => ({ tools: { ...state.tools, activeFile: path } })),

  clearTerminal: () =>
    set((state) => ({ tools: { ...state.tools, terminalHistory: [] } })),

  resetTools: () =>
    set({
      tools: {
        activeTool: 'terminal',
        terminalHistory: [],
        terminalCwd: '/home/user',
        openFiles: [],
        activeFile: null,
      },
    }),
});
