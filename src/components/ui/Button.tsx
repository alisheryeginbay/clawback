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
          'inline-flex items-center justify-center transition-all duration-200',
          'focus-visible:outline-1 focus-visible:outline-dotted focus-visible:outline-[#000000] focus-visible:outline-offset-[-4px]',
          'disabled:opacity-50 disabled:pointer-events-none',
          {
            'xp-button':
              variant === 'default',
            'bg-transparent hover:bg-[#316AC5]/10 text-[#000000] hover:text-[#000000] rounded-sm':
              variant === 'ghost',
            'xp-button !border-claw-red/50 hover:!border-claw-red text-claw-red':
              variant === 'danger',
            'xp-button !border-[#0054E3] text-[#003C74]':
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
