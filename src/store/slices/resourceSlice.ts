import { type StateCreator } from 'zustand';
import type { ResourceState } from '@/types';
import { clamp } from '@/lib/utils';

export interface ResourceSlice {
  resources: ResourceState;
  adjustResource: (key: keyof ResourceState, delta: number) => void;
  setResource: (key: keyof ResourceState, value: number) => void;
  tickResources: () => void;
  resetResources: () => void;
}

const INITIAL_RESOURCES: ResourceState = {
  cpu: 5,
  memory: 15,
  disk: 20,
  diskTotal: 500,
  diskUsed: 100,
  network: 0,
};

export const createResourceSlice: StateCreator<ResourceSlice> = (set) => ({
  resources: { ...INITIAL_RESOURCES },

  adjustResource: (key, delta) =>
    set((state) => ({
      resources: {
        ...state.resources,
        [key]: clamp(state.resources[key] + delta, 0, 100),
      },
    })),

  setResource: (key, value) =>
    set((state) => ({
      resources: {
        ...state.resources,
        [key]: key === 'diskTotal' || key === 'diskUsed' ? value : clamp(value, 0, 100),
      },
    })),

  // Natural recovery/decay each tick
  tickResources: () =>
    set((state) => {
      const { cpu, memory, network } = state.resources;
      return {
        resources: {
          ...state.resources,
          cpu: clamp(cpu - 2, 0, 100),           // CPU recovers 2% per tick
          memory: clamp(memory - 0.5, 0, 100),   // Memory slowly recovers
          network: clamp(network - 3, 0, 100),   // Network recovers faster
        },
      };
    }),

  resetResources: () =>
    set({ resources: { ...INITIAL_RESOURCES } }),
});
