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

const ICON_COLORS: Record<NotificationType, string> = {
  info: 'text-[#0054E3]',
  success: 'text-[#399639]',
  warning: 'text-claw-orange',
  error: 'text-claw-red',
  security: 'text-claw-red',
};

export function NotificationTray() {
  const notifications = useGameStore((s) => s.notifications);
  const dismissNotification = useGameStore((s) => s.dismissNotification);
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());

  const visible = notifications.filter((n) => !n.dismissed).slice(-3);

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
    <div className="fixed bottom-14 right-4 z-50 flex flex-col gap-2 w-80">
      {visible.map((notification) => {
        const Icon = ICON_MAP[notification.type];
        const isExiting = exitingIds.has(notification.id);
        return (
          <div
            key={notification.id}
            className={cn(
              'xp-balloon',
              isExiting ? 'slide-out-right' : 'slide-in-right'
            )}
          >
            <div className="flex items-start gap-3">
              <Icon size={18} className={cn('mt-0.5 flex-shrink-0', ICON_COLORS[notification.type])} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[#000000]">
                  {notification.title}
                </div>
                <div className="text-xs text-[#000000]/70 mt-0.5">
                  {notification.message}
                </div>
              </div>
              <button
                onClick={() => triggerExit(notification.id)}
                className="text-[#808080] hover:text-[#000000] flex-shrink-0 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
