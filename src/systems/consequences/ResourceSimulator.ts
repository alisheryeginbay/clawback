import { useGameStore } from '@/store/gameStore';

export class ResourceSimulator {
  tick(): void {
    // Natural resource recovery is handled by the store's tickResources()
    useGameStore.getState().tickResources();

    // Check for resource overload
    const state = useGameStore.getState();

    if (state.resources.cpu >= 95) {
      state.addNotification({
        type: 'warning',
        title: 'High CPU Usage',
        message: 'System running slow. Close some processes.',
      });
    }

    if (state.resources.memory >= 90) {
      state.addNotification({
        type: 'warning',
        title: 'Low Memory',
        message: 'Memory nearly full. Close some files.',
      });
    }

    if (state.resources.disk >= 95) {
      state.addNotification({
        type: 'error',
        title: 'Disk Full',
        message: 'No disk space remaining!',
      });
    }
  }
}
