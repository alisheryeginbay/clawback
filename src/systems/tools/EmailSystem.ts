import { useGameStore } from '@/store/gameStore';
import { EventBus } from '@/engine/EventBus';

export class EmailSystem {
  sendEmail(to: string, subject: string, body: string): void {
    const state = useGameStore.getState();

    state.addEmail({
      from: 'ai@clawback.dev',
      to,
      subject,
      body,
      timestamp: state.clock.tickCount,
      isRead: true,
      isStarred: false,
    });

    // Check for security issues
    const isExternal = !to.includes('@company.com') && !to.includes('@clawback.dev');
    const hasSensitiveData = body.toLowerCase().includes('password') ||
      body.toLowerCase().includes('api_key') ||
      body.toLowerCase().includes('secret');

    if (isExternal && hasSensitiveData) {
      EventBus.emit('security_violation', {
        type: 'credential_forward',
        detail: `Sensitive data sent to external: ${to}`,
      });
    }

    EventBus.emit('email_sent', { to, subject });
  }

  getUnreadCount(): number {
    return useGameStore.getState().emails.filter((e) => !e.isRead).length;
  }
}
