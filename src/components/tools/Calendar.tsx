'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { NPC_PERSONAS } from '@/systems/npc/personas';
import { cn } from '@/lib/utils';
import { formatTime, formatDay } from '@/lib/utils';
import { Plus, Clock, X } from 'lucide-react';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

export function Calendar() {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', startHour: 9, endHour: 10 });

  const calendarEvents = useGameStore((s) => s.calendarEvents);
  const clock = useGameStore((s) => s.clock);
  const addCalendarEvent = useGameStore((s) => s.addCalendarEvent);
  const removeCalendarEvent = useGameStore((s) => s.removeCalendarEvent);

  const dayEvents = calendarEvents
    .filter((e) => e.day === selectedDay)
    .sort((a, b) => a.startHour * 60 + a.startMinute - (b.startHour * 60 + b.startMinute));

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) return;
    addCalendarEvent({
      title: newEvent.title,
      description: newEvent.description,
      day: selectedDay,
      startHour: newEvent.startHour,
      startMinute: 0,
      endHour: newEvent.endHour,
      endMinute: 0,
    });
    setNewEvent({ title: '', description: '', startHour: 9, endHour: 10 });
    setShowAdd(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Day selector */}
      <div className="flex items-center border-b border-claw-border bg-claw-surface">
        {[1, 2, 3, 4, 5].map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={cn(
              'flex-1 py-2 text-center text-xs transition-colors',
              selectedDay === day
                ? 'text-claw-green bg-claw-green/5 border-b border-claw-green'
                : 'text-claw-muted hover:text-claw-text hover:bg-claw-surface-alt',
              clock.day === day && 'font-bold'
            )}
          >
            <div className="text-[10px]">{formatDay(day).slice(0, 3)}</div>
            <div className={cn(clock.day === day && 'text-claw-green')}>Day {day}</div>
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="px-3 py-1.5 flex items-center border-b border-claw-border">
        <span className="text-xs text-claw-text">{formatDay(selectedDay)}</span>
        <span className="text-[10px] text-claw-muted ml-2">{dayEvents.length} events</span>
        <div className="flex-1" />
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1 px-2 py-0.5 text-[10px] text-claw-green hover:bg-claw-green/10 transition-colors"
        >
          <Plus size={10} /> Add Event
        </button>
      </div>

      {/* Add event form */}
      {showAdd && (
        <div className="p-3 border-b border-claw-border bg-claw-surface space-y-2">
          <input
            type="text"
            placeholder="Event title..."
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="w-full bg-claw-bg border border-claw-border px-2 py-1 text-xs text-claw-text font-mono focus:outline-none focus:border-claw-green/50"
          />
          <div className="flex gap-2 items-center">
            <select
              value={newEvent.startHour}
              onChange={(e) => setNewEvent({ ...newEvent, startHour: +e.target.value })}
              className="bg-claw-bg border border-claw-border px-2 py-1 text-xs text-claw-text font-mono focus:outline-none"
            >
              {HOURS.map((h) => (
                <option key={h} value={h}>{formatTime(h, 0)}</option>
              ))}
            </select>
            <span className="text-xs text-claw-muted">to</span>
            <select
              value={newEvent.endHour}
              onChange={(e) => setNewEvent({ ...newEvent, endHour: +e.target.value })}
              className="bg-claw-bg border border-claw-border px-2 py-1 text-xs text-claw-text font-mono focus:outline-none"
            >
              {HOURS.map((h) => (
                <option key={h} value={h}>{formatTime(h, 0)}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddEvent}
              className="px-2 py-1 text-[10px] bg-claw-green/10 border border-claw-green/30 text-claw-green hover:bg-claw-green/20 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-2 py-1 text-[10px] text-claw-muted hover:text-claw-text"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto">
        {HOURS.map((hour) => {
          const hourEvents = dayEvents.filter(
            (e) => e.startHour <= hour && e.endHour > hour
          );
          const isCurrentHour = clock.day === selectedDay && clock.hour === hour;

          return (
            <div
              key={hour}
              className={cn(
                'flex border-b border-claw-border/30 min-h-[48px]',
                isCurrentHour && 'bg-claw-green/5'
              )}
            >
              <div className={cn(
                'w-16 flex-shrink-0 text-[10px] py-1.5 px-2 text-right border-r border-claw-border/30',
                isCurrentHour ? 'text-claw-green' : 'text-claw-dim'
              )}>
                {formatTime(hour, 0)}
              </div>
              <div className="flex-1 py-1 px-2 space-y-1">
                {hourEvents.map((event) => {
                  const isStart = event.startHour === hour;
                  if (!isStart) return null;
                  const persona = event.npcId ? NPC_PERSONAS[event.npcId] : null;
                  return (
                    <div
                      key={event.id}
                      className="flex items-start gap-1.5 px-2 py-1 rounded-sm text-xs group"
                      style={{
                        backgroundColor: `${event.color || '#1e2530'}20`,
                        borderLeft: `2px solid ${event.color || '#1e2530'}`,
                      }}
                    >
                      <div className="flex-1">
                        <div className="text-claw-text text-xs">{event.title}</div>
                        <div className="text-[10px] text-claw-muted flex items-center gap-1">
                          <Clock size={8} />
                          {formatTime(event.startHour, event.startMinute)} - {formatTime(event.endHour, event.endMinute)}
                          {persona && (
                            <span className="ml-1">{persona.avatar} {persona.name}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeCalendarEvent(event.id)}
                        className="opacity-0 group-hover:opacity-100 text-claw-muted hover:text-claw-red transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
