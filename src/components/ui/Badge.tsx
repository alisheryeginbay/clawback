'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'default' | 'green' | 'red' | 'orange' | 'blue' | 'purple';
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 text-xs rounded-sm border',
        {
          'bg-[var(--color-xp-face)] text-[#000000] border-[#ACA899]': variant === 'default',
          'bg-[#399639]/10 text-[#399639] border-[#399639]/30': variant === 'green',
          'bg-claw-red/10 text-claw-red border-claw-red/30': variant === 'red',
          'bg-claw-orange/10 text-claw-orange border-claw-orange/30': variant === 'orange',
          'bg-[#0054E3]/10 text-[#0054E3] border-[#0054E3]/30': variant === 'blue',
          'bg-[#7B68EE]/10 text-[#7B68EE] border-[#7B68EE]/30': variant === 'purple',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
