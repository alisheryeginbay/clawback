'use client';

import { useEffect, useState, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { cn } from '@/lib/utils';
import { X, AlertTriangle, CheckCircle, Info, AlertOctagon, ShieldAlert } from 'lucide-react';
import type { NotificationType } from '@/types';

const ICON_MAP: Record<NotificationType, typeof Info> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertOctagon,
  security: ShieldAlert,
};

const COLOR_MAP: Record<NotificationType, string> = {
  info: 'border-claw-blue text-claw-blue',
  success: 'border-claw-green text-claw-green',
  warning: 'border-claw-orange text-claw-orange',
  error: 'border-claw-red text-claw-red',
  security: 'border-claw-red text-claw-red',
};

export function NotificationTray() {
  const notifications = useGameStore((s) => s.notifications);
  const dismissNotification = useGameStore((s) => s.dismissNotification);
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());

  const visible = notifications.filter((n) => !n.dismissed).slice(-5);

  const triggerExit = useCallback((id: string) => {
    setExitingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      dismissNotification(id);
      setExitingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 300);
  }, [dismissNotification]);

  useEffect(() => {
    const timers = visible.map((n) => {
      if (exitingIds.has(n.id)) return null;
      const duration = n.duration || 4000;
      return setTimeout(() => triggerExit(n.id), duration);
    });
    return () => timers.forEach((t) => t && clearTimeout(t));
  }, [visible, triggerExit, exitingIds]);

  if (visible.length === 0) return null;

  return (
    <div className="fixed top-2 right-2 z-50 flex flex-col gap-2 w-80">
      {visible.map((notification) => {
        const Icon = ICON_MAP[notification.type];
        const isExiting = exitingIds.has(notification.id);
        return (
          <div
            key={notification.id}
            className={cn(
              'bg-claw-surface border-l-2 p-3 shadow-lg shadow-black/30',
              isExiting ? 'slide-out-right' : 'slide-in-right',
              COLOR_MAP[notification.type]
            )}
          >
            <div className="flex items-start gap-2">
              <Icon size={14} className="mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-claw-text">
                  {notification.title}
                </div>
                <div className="text-xs text-claw-muted mt-0.5">
                  {notification.message}
                </div>
              </div>
              <button
                onClick={() => triggerExit(notification.id)}
                className="text-claw-muted hover:text-claw-text flex-shrink-0"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
