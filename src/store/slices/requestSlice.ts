import { type StateCreator } from 'zustand';
import type { GameRequest, RequestStatus } from '@/types';

export interface RequestSlice {
  requests: GameRequest[];
  activeRequestId: string | null;
  addRequest: (request: GameRequest) => void;
  setRequestStatus: (requestId: string, status: RequestStatus) => void;
  setActiveRequest: (requestId: string | null) => void;
  completeObjective: (requestId: string, objectiveId: string) => void;
  resetRequests: () => void;
}

export const createRequestSlice: StateCreator<RequestSlice> = (set) => ({
  requests: [],
  activeRequestId: null,

  addRequest: (request) =>
    set((state) => ({ requests: [...state.requests, request] })),

  setRequestStatus: (requestId, status) =>
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === requestId ? { ...r, status } : r
      ),
    })),

  setActiveRequest: (requestId) =>
    set({ activeRequestId: requestId }),

  completeObjective: (requestId, objectiveId) =>
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              objectives: r.objectives.map((o) =>
                o.id === objectiveId ? { ...o, completed: true } : o
              ),
            }
          : r
      ),
    })),

  resetRequests: () =>
    set({ requests: [], activeRequestId: null }),
});
