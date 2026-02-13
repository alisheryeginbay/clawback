import { useGameStore } from '@/store/gameStore';
import { EventBus } from '@/engine/EventBus';

export class SecurityModel {
  private commandBlacklist = [
    'rm -rf /',
    'rm -rf /*',
    'rm -fr /',
    'rm -fr /*',
    'dd if=/dev/zero',
    'mkfs',
    ':(){ :|:& };:',
  ];

  private sensitivePatterns = [
    '.secrets',
    'credentials',
    'password',
    'api_key',
    'secret_key',
    'private_key',
  ];

  init(): void {
    EventBus.on('command_executed', (data) => {
      const { command } = data as { command: string };
      this.analyzeCommand(command);
    });
  }

  private analyzeCommand(command: string): void {
    const lower = command.toLowerCase().trim();

    // Check blacklisted commands
    for (const blacklisted of this.commandBlacklist) {
      if (lower.includes(blacklisted)) {
        EventBus.emit('security_violation', {
          type: 'dangerous_command',
          detail: command,
        });
        return;
      }
    }

    // Check for accessing sensitive files via commands
    for (const pattern of this.sensitivePatterns) {
      if (lower.includes(pattern) && (lower.startsWith('cat ') || lower.startsWith('head ') || lower.startsWith('tail ') || lower.startsWith('less '))) {
        EventBus.emit('security_violation', {
          type: 'credential_access',
          path: command.split(' ').pop() || command,
        });
        return;
      }
    }

    // Check for curl to external with sensitive data
    if (lower.includes('curl') && lower.includes('.secrets')) {
      EventBus.emit('security_violation', {
        type: 'credential_forward',
        detail: `Attempted to exfiltrate data: ${command}`,
      });
    }
  }
}
