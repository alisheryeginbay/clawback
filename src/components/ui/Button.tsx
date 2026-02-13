'use client';

import { cn } from '@/lib/utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-mono transition-all duration-150',
          'focus:outline-none focus:ring-1 focus:ring-claw-green/50',
          'disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-claw-surface border border-claw-border hover:border-claw-green/50 hover:bg-claw-surface-alt text-claw-text':
              variant === 'default',
            'bg-transparent hover:bg-claw-surface-alt text-claw-muted hover:text-claw-text':
              variant === 'ghost',
            'bg-claw-red/10 border border-claw-red/30 hover:bg-claw-red/20 text-claw-red':
              variant === 'danger',
            'bg-claw-green/10 border border-claw-green/30 hover:bg-claw-green/20 text-claw-green':
              variant === 'success',
          },
          {
            'px-2 py-1 text-xs': size === 'sm',
            'px-3 py-1.5 text-sm': size === 'md',
            'px-4 py-2 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
