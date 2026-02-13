import { useGameStore } from '@/store/gameStore';
import type { CalendarEvent } from '@/types';

export class CalendarSystem {
  addEvent(event: Omit<CalendarEvent, 'id'>): void {
    useGameStore.getState().addCalendarEvent(event);
  }

  getEventsForDay(day: number): CalendarEvent[] {
    return useGameStore.getState().calendarEvents.filter((e) => e.day === day);
  }

  hasConflict(day: number, startHour: number, endHour: number): boolean {
    const dayEvents = this.getEventsForDay(day);
    return dayEvents.some(
      (e) => startHour < e.endHour && endHour > e.startHour
    );
  }
}
