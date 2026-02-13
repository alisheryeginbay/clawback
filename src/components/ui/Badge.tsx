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
        'inline-flex items-center px-1.5 py-0.5 text-xs font-mono rounded-sm',
        {
          'bg-claw-surface-alt text-claw-muted border border-claw-border': variant === 'default',
          'bg-claw-green/10 text-claw-green border border-claw-green/30': variant === 'green',
          'bg-claw-red/10 text-claw-red border border-claw-red/30': variant === 'red',
          'bg-claw-orange/10 text-claw-orange border border-claw-orange/30': variant === 'orange',
          'bg-claw-blue/10 text-claw-blue border border-claw-blue/30': variant === 'blue',
          'bg-claw-purple/10 text-claw-purple border border-claw-purple/30': variant === 'purple',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
