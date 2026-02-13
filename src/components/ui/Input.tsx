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
          'w-full transition-colors duration-150',
          'focus:outline-none',
          'placeholder:text-[#808080]/50',
          {
            'xp-input px-3 py-1.5 text-sm text-[#000000]':
              variant === 'default',
            'bg-transparent font-mono text-[#00FF00] text-sm caret-[#00FF00] border-none':
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
