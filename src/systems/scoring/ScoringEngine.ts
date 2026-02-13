import { useGameStore } from '@/store/gameStore';
import type { GameRequest, RequestTier } from '@/types';

export class ScoringEngine {
  calculateRequestScore(request: GameRequest, elapsedTicks: number): number {
    const state = useGameStore.getState();

    const speedRatio = elapsedTicks / request.deadlineTicks;
    const speedMultiplier = this.getSpeedMultiplier(speedRatio);
    const streakBonus = 1 + (state.score.streak * 0.1);
    const tierMultiplier = this.getTierMultiplier(request.tier);

    return Math.round(request.basePoints * speedMultiplier * Math.min(streakBonus, 2.0) * tierMultiplier);
  }

  private getSpeedMultiplier(speedRatio: number): number {
    if (speedRatio < 0.25) return 2.0;   // Very fast
    if (speedRatio < 0.5) return 1.5;    // Fast
    if (speedRatio < 0.75) return 1.2;   // On time
    if (speedRatio < 1.0) return 1.0;    // Cutting it close
    return 0.5;                           // Late
  }

  private getTierMultiplier(tier: RequestTier): number {
    switch (tier) {
      case 1: return 1;
      case 2: return 2;
      case 3: return 3;
      case 4: return 5;
    }
  }

  getEndGameSummary() {
    const state = useGameStore.getState();
    const { score, clock } = state;

    return {
      totalScore: score.total,
      requestsCompleted: score.requestsCompleted,
      requestsFailed: score.requestsFailed,
      requestsExpired: score.requestsExpired,
      maxStreak: score.maxStreak,
      securityScore: score.securityScore,
      daysPlayed: clock.day,
      totalTicks: clock.tickCount,
      grade: this.calculateGrade(score.total, score.securityScore),
    };
  }

  private calculateGrade(totalScore: number, securityScore: number): string {
    const combined = totalScore + (securityScore * 10);
    if (combined >= 5000) return 'S';
    if (combined >= 3000) return 'A';
    if (combined >= 2000) return 'B';
    if (combined >= 1000) return 'C';
    if (combined >= 500) return 'D';
    return 'F';
  }
}
