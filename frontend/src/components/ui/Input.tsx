'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, leftIcon, rightIcon, className, id, ...rest }, ref) => {
    const uid = id || rest.name;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={uid}
            className="block mb-1.5 text-sm font-medium text-[var(--text-primary)]"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            'relative flex items-center rounded-lg border transition-colors',
            'bg-[var(--surface-card)]',
            error
              ? 'border-[var(--color-danger-500)]'
              : 'border-[var(--border-default)] focus-within:border-[var(--color-brand-500)]'
          )}
        >
          {leftIcon && <span className="pr-3 pl-1 text-[var(--text-muted)]">{leftIcon}</span>}
          <input
            id={uid}
            ref={ref}
            className={cn(
              'w-full bg-transparent px-3 py-2.5 text-sm text-[var(--text-primary)]',
              'placeholder:text-[var(--text-muted)] outline-none',
              leftIcon && 'pr-0',
              className
            )}
            {...rest}
          />
          {rightIcon && <span className="pl-3 pr-1 text-[var(--text-muted)]">{rightIcon}</span>}
        </div>
        {(hint || error) && (
          <p
            className={cn(
              'mt-1 text-xs',
              error ? 'text-[var(--color-danger-500)]' : 'text-[var(--text-muted)]'
            )}
          >
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
