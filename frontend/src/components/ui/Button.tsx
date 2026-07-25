'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[var(--color-brand-500)] text-white hover:bg-[var(--color-brand-600)] active:bg-[var(--color-brand-700)] shadow-[var(--shadow-sm)]',
  secondary:
    'bg-[var(--surface-muted)] text-[var(--text-primary)] hover:bg-[var(--color-ink-200)]',
  outline:
    'border border-[var(--border-strong)] bg-[var(--surface-card)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)]',
  ghost: 'text-[var(--text-primary)] hover:bg-[var(--surface-muted)]',
  danger: 'bg-[var(--color-danger-500)] text-white hover:bg-[var(--color-danger-600)]',
  success: 'bg-[var(--color-success-500)] text-white hover:bg-[var(--color-success-600)]',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
  md: 'h-10 px-4 text-sm rounded-lg gap-2',
  lg: 'h-12 px-5 text-base rounded-xl gap-2',
  icon: 'h-10 w-10 rounded-lg justify-center',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading,
      leftIcon,
      rightIcon,
      fullWidth,
      className,
      children,
      disabled,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors select-none',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        {...rest}
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);
Button.displayName = 'Button';
