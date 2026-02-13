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
    <div className={cn('flex border-b border-[#ACA899] bg-[var(--color-xp-face)]', className)}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={cn(
            'px-3 py-1.5 text-xs transition-all relative border-b-2',
            activeId === item.id
              ? 'text-[#000000] bg-white border-[#0054E3]'
              : 'text-[#808080] hover:text-[#000000] bg-transparent border-transparent hover:border-[#ACA899]'
          )}
        >
          <span className="flex items-center gap-1.5">
            {item.label}
            {item.badge != null && item.badge > 0 && (
              <span className="bg-[#0054E3] text-white text-[10px] px-1 rounded-full min-w-[16px] text-center">
                {item.badge}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
