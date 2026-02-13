import { useGameStore } from '@/store/gameStore';
import { EventBus } from '@/engine/EventBus';
import type { ConsequenceTrigger } from '@/types';

interface ConsequenceRule {
  trigger: ConsequenceTrigger;
  handler: (data: Record<string, unknown>) => void;
}

export class ConsequenceEngine {
  private rules: ConsequenceRule[] = [];
  private unsubscribers: (() => void)[] = [];

  init(): void {
    this.setupRules();
    this.bindEvents();
  }

  destroy(): void {
    this.unsubscribers.forEach((unsub) => unsub());
    this.unsubscribers = [];
  }

  private setupRules(): void {
    this.rules = [
      {
        trigger: 'security_violation',
        handler: (data) => {
          const state = useGameStore.getState();
          const type = data.type as string;

          let securityPenalty = -10;
          let scorePenalty = -100;
          let message = 'Security violation detected';

          switch (type) {
            case 'credential_access':
              securityPenalty = -15;
              scorePenalty = -100;
              message = `Accessed sensitive file: ${data.path}`;
              break;
            case 'dangerous_command':
              securityPenalty = -25;
              scorePenalty = -200;
              message = `Dangerous command: ${data.detail}`;
              break;
            case 'credential_forward':
              securityPenalty = -40;
              scorePenalty = -500;
              message = `Credentials forwarded externally: ${data.detail}`;
              break;
          }

          state.adjustSecurity(securityPenalty);
          state.addScore(scorePenalty);

          state.addNotification({
            type: 'security',
            title: 'SECURITY ALERT',
            message,
            duration: 6000,
          });

          EventBus.emit('security_alert', { type, penalty: securityPenalty });

          // Check game over
          const updatedState = useGameStore.getState();
          if (updatedState.score.securityScore <= 0) {
            state.setPhase('gameover');
            state.addNotification({
              type: 'error',
              title: 'GAME OVER',
              message: 'Security score reached 0. System compromised!',
              duration: 10000,
            });
          }
        },
      },
    ];
  }

  private bindEvents(): void {
    // Listen to security violations
    this.unsubscribers.push(
      EventBus.on('security_violation', (data) => {
        const rule = this.rules.find((r) => r.trigger === 'security_violation');
        rule?.handler(data as Record<string, unknown>);
      })
    );

    // Listen to NPC leaving
    this.unsubscribers.push(
      EventBus.on('npc_left', (data) => {
        const state = useGameStore.getState();
        const { npcId } = data as { npcId: string; requestId: string };

        state.addNotification({
          type: 'warning',
          title: 'NPC Left',
          message: `${npcId} has given up and left`,
        });
      })
    );
  }
}
