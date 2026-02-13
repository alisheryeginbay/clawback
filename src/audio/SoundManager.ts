// SoundManager - Howler.js wrapper
// Sounds are optional and gracefully degrade if files are missing

import { EventBus } from '@/engine/EventBus';

type SoundEvent =
  | 'notification'
  | 'message_received'
  | 'message_sent'
  | 'request_new'
  | 'request_complete'
  | 'request_expired'
  | 'security_alert'
  | 'command_execute'
  | 'score_up'
  | 'score_down'
  | 'boot'
  | 'click';

class SoundManagerImpl {
  private enabled = true;
  private initialized = false;

  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    // Bind to game events
    EventBus.on('request_added', () => this.play('request_new'));
    EventBus.on('request_completed', () => this.play('request_complete'));
    EventBus.on('request_expired', () => this.play('request_expired'));
    EventBus.on('security_alert', () => this.play('security_alert'));
    EventBus.on('command_executed', () => this.play('command_execute'));
  }

  play(event: SoundEvent): void {
    if (!this.enabled) return;
    // Sounds would be loaded from /public/sounds/
    // For now, gracefully skip if Howler isn't loaded or files aren't present
    try {
      // Placeholder for Howler integration
      // const sound = new Howl({ src: [`/sounds/${event}.mp3`] });
      // sound.play();
    } catch {
      // Silently fail - sounds are optional
    }
  }

  toggle(): void {
    this.enabled = !this.enabled;
  }

  get isEnabled(): boolean {
    return this.enabled;
  }
}

export const SoundManager = new SoundManagerImpl();
