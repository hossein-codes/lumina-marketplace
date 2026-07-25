import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type Variant = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

const styles: Record<Variant, string> = {
  neutral: 'bg-[var(--color-ink-100)] text-[var(--color-ink-700)]',
  brand: 'bg-[var(--color-brand-50)] text-[var(--color-brand-700)]',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-rose-50 text-rose-700',
  info: 'bg-sky-50 text-sky-700',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({ variant = 'neutral', className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
        styles[variant],
        className
      )}
      {...rest}
    />
  );
}
