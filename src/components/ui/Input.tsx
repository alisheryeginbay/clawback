'use client';

import { cn } from '@/lib/utils';
import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'terminal';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full font-mono transition-colors duration-150',
          'focus:outline-none',
          'placeholder:text-claw-muted/50',
          {
            'bg-claw-surface border border-claw-border px-3 py-1.5 text-sm text-claw-text focus:border-claw-green/50':
              variant === 'default',
            'bg-transparent text-claw-green text-sm caret-claw-green border-none':
              variant === 'terminal',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
