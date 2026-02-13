import { useGameStore } from '@/store/gameStore';

export class Clock {
  get tick(): number {
    return useGameStore.getState().clock.tickCount;
  }

  get hour(): number {
    return useGameStore.getState().clock.hour;
  }

  get minute(): number {
    return useGameStore.getState().clock.minute;
  }

  get day(): number {
    return useGameStore.getState().clock.day;
  }

  get timeString(): string {
    const { hour, minute } = useGameStore.getState().clock;
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  }

  advance(): void {
    useGameStore.getState().advanceClock();
  }

  isWorkHours(): boolean {
    const { hour } = useGameStore.getState().clock;
    return hour >= 9 && hour < 18;
  }

  isEndOfDay(): boolean {
    const { hour } = useGameStore.getState().clock;
    return hour >= 18;
  }
}
