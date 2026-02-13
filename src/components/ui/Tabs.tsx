'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface TabItem {
  id: string;
  label: ReactNode;
  badge?: number;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function Tabs({ items, activeId, onSelect, className }: TabsProps) {
  return (
    <div className={cn('flex border-b border-claw-border', className)}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={cn(
            'px-3 py-1.5 text-xs font-mono transition-colors relative',
            activeId === item.id
              ? 'text-claw-text bg-claw-surface border-b border-claw-green'
              : 'text-claw-muted hover:text-claw-text hover:bg-claw-surface-alt'
          )}
        >
          <span className="flex items-center gap-1.5">
            {item.label}
            {item.badge != null && item.badge > 0 && (
              <span className="bg-claw-red text-white text-[10px] px-1 rounded-full min-w-[16px] text-center">
                {item.badge}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
