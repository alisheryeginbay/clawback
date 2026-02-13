import { useGameStore } from '@/store/gameStore';
import { checkObjective } from './validators';
import { EventBus } from '@/engine/EventBus';
import { generateNpcMessage } from '@/services/ai';
import type { GameRequest } from '@/types';

export class RequestManager {
  // Add a new request to the queue and notify
  addRequest(request: GameRequest): void {
    const state = useGameStore.getState();

    state.addRequest(request);

    // Send initial message from NPC (async AI generation)
    const npcId = request.npcId;
    const tick = state.clock.tickCount;
    state.setNpcTyping(npcId, true);

    const aiPromise = generateNpcMessage({
      npcId,
      messageType: 'initial',
      request,
    });
    const typingDelay = new Promise<void>((resolve) =>
      setTimeout(resolve, 800 + Math.random() * 600)
    );

    Promise.all([aiPromise, typingDelay]).then(([dialogue]) => {
      const s = useGameStore.getState();
      s.setNpcTyping(npcId, false);
      s.addMessage(npcId, dialogue, false, tick);
    });

    // Set NPC to waiting
    state.setNpcMood(request.npcId, 'waiting');

    // Notification
    state.addNotification({
      type: 'info',
      title: 'New Request',
      message: `${request.title} from ${request.npcId}`,
    });

    EventBus.emit('request_added', { requestId: request.id });
  }

  // Check all active requests for completion or expiry
  tick(): void {
    const state = useGameStore.getState();
    const tick = state.clock.tickCount;

    for (const request of state.requests) {
      if (request.status === 'incoming') {
        // Auto-activate after a brief delay
        if (tick - request.arrivalTick > 2) {
          state.setRequestStatus(request.id, 'active');
        }
        continue;
      }

      if (request.status !== 'active' && request.status !== 'in_progress') continue;

      // Check expiry
      const elapsed = tick - request.arrivalTick;
      if (elapsed >= request.deadlineTicks) {
        this.expireRequest(request);
        continue;
      }

      // Check objectives
      let anyCompleted = false;
      for (const objective of request.objectives) {
        if (objective.completed) continue;
        if (checkObjective(objective)) {
          state.completeObjective(request.id, objective.id);
          anyCompleted = true;
        }
      }

      if (anyCompleted) {
        state.setRequestStatus(request.id, 'in_progress');
      }

      // Check if all objectives complete
      const updatedRequest = state.requests.find((r) => r.id === request.id);
      if (updatedRequest && updatedRequest.objectives.every((o) => o.completed)) {
        this.completeRequest(updatedRequest, elapsed);
      }
    }
  }

  private completeRequest(request: GameRequest, elapsedTicks: number): void {
    const state = useGameStore.getState();

    state.setRequestStatus(request.id, 'completed');

    // Calculate score
    const speedRatio = elapsedTicks / request.deadlineTicks;
    const speedMultiplier = speedRatio < 0.3 ? 2.0 : speedRatio < 0.6 ? 1.5 : 1.0;
    const streakBonus = 1 + (state.score.streak * 0.1);
    const tierMultiplier = request.tier;
    const points = Math.round(request.basePoints * speedMultiplier * Math.min(streakBonus, 2) * tierMultiplier);

    // If it's a security trap that was handled correctly
    const isSecurityTrapSuccess = request.isSecurityTrap;

    state.addScore(points);
    state.incrementStreak();
    state.recordRequestComplete();
    state.changeReputation(request.npcId, isSecurityTrapSuccess ? 5 : 15);

    // NPC happiness
    state.setNpcMood(request.npcId, 'happy');

    // Completion message (async AI generation)
    {
      const npcId = request.npcId;
      const tick = state.clock.tickCount;
      state.setNpcTyping(npcId, true);

      const aiPromise = generateNpcMessage({
        npcId,
        messageType: 'completion',
        request,
      });
      const typingDelay = new Promise<void>((resolve) =>
        setTimeout(resolve, 800 + Math.random() * 600)
      );

      Promise.all([aiPromise, typingDelay]).then(([dialogue]) => {
        const s = useGameStore.getState();
        s.setNpcTyping(npcId, false);
        s.addMessage(npcId, dialogue, false, tick);
      });
    }

    // Notification
    state.addNotification({
      type: 'success',
      title: 'Request Completed!',
      message: `+${points} points${isSecurityTrapSuccess ? ' (Security bonus!)' : ''}`,
    });

    EventBus.emit('request_completed', {
      requestId: request.id,
      points,
      isSecurityTrap: isSecurityTrapSuccess,
    });
  }

  private expireRequest(request: GameRequest): void {
    const state = useGameStore.getState();

    state.setRequestStatus(request.id, 'expired');
    state.resetStreak();
    state.recordRequestExpired();
    state.changeReputation(request.npcId, -15);
    state.addScore(-50);

    // NPC gets angry
    state.setNpcMood(request.npcId, 'angry');

    // Failure message (async AI generation)
    {
      const npcId = request.npcId;
      const tick = state.clock.tickCount;
      state.setNpcTyping(npcId, true);

      const aiPromise = generateNpcMessage({
        npcId,
        messageType: 'failure',
        request,
      });
      const typingDelay = new Promise<void>((resolve) =>
        setTimeout(resolve, 800 + Math.random() * 600)
      );

      Promise.all([aiPromise, typingDelay]).then(([dialogue]) => {
        const s = useGameStore.getState();
        s.setNpcTyping(npcId, false);
        s.addMessage(npcId, dialogue, false, tick);
      });
    }

    state.addNotification({
      type: 'warning',
      title: 'Request Expired',
      message: `${request.title} - deadline missed`,
    });

    EventBus.emit('request_expired', { requestId: request.id });
  }
}
