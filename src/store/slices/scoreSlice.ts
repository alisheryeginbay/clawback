import { type StateCreator } from 'zustand';
import type { ScoreState } from '@/types';

export interface ScoreSlice {
  score: ScoreState;
  addScore: (points: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  adjustSecurity: (delta: number) => void;
  recordRequestComplete: () => void;
  recordRequestFailed: () => void;
  recordRequestExpired: () => void;
  resetScore: () => void;
}

export const createScoreSlice: StateCreator<ScoreSlice> = (set) => ({
  score: {
    total: 0,
    streak: 0,
    maxStreak: 0,
    securityScore: 100,
    requestsCompleted: 0,
    requestsFailed: 0,
    requestsExpired: 0,
  },

  addScore: (points) =>
    set((state) => ({
      score: { ...state.score, total: state.score.total + points },
    })),

  incrementStreak: () =>
    set((state) => {
      const newStreak = state.score.streak + 1;
      return {
        score: {
          ...state.score,
          streak: newStreak,
          maxStreak: Math.max(state.score.maxStreak, newStreak),
        },
      };
    }),

  resetStreak: () =>
    set((state) => ({ score: { ...state.score, streak: 0 } })),

  adjustSecurity: (delta) =>
    set((state) => ({
      score: {
        ...state.score,
        securityScore: Math.max(0, Math.min(100, state.score.securityScore + delta)),
      },
    })),

  recordRequestComplete: () =>
    set((state) => ({
      score: { ...state.score, requestsCompleted: state.score.requestsCompleted + 1 },
    })),

  recordRequestFailed: () =>
    set((state) => ({
      score: { ...state.score, requestsFailed: state.score.requestsFailed + 1 },
    })),

  recordRequestExpired: () =>
    set((state) => ({
      score: { ...state.score, requestsExpired: state.score.requestsExpired + 1 },
    })),

  resetScore: () =>
    set({
      score: {
        total: 0,
        streak: 0,
        maxStreak: 0,
        securityScore: 100,
        requestsCompleted: 0,
        requestsFailed: 0,
        requestsExpired: 0,
      },
    }),
});
