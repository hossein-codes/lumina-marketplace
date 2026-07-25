import { applyDiscount, formatNumber, formatPrice } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

export function Price({
  value,
  discountPercentage,
  size = 'md',
  className,
}: {
  value: number | string;
  discountPercentage?: number | string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const price = Number(value) || 0;
  const disc = Number(discountPercentage) || 0;
  const final = applyDiscount(price, disc);
  const sizes = {
    sm: { main: 'text-sm', old: 'text-[11px]', pct: 'text-[10px]' },
    md: { main: 'text-base', old: 'text-xs', pct: 'text-[11px]' },
    lg: { main: 'text-xl', old: 'text-sm', pct: 'text-xs' },
  } as const;
  const s = sizes[size];
  return (
    <div className={cn('flex flex-col items-end gap-0.5', className)}>
      {disc > 0 && (
        <div className="flex items-center gap-2">
          <span className={cn('bg-[var(--color-brand-500)] text-white font-bold rounded-full px-1.5 py-0.5 font-num', s.pct)}>
            ٪{formatNumber(disc)}
          </span>
          <span className={cn('text-[var(--text-muted)] line-through font-num', s.old)}>
            {formatNumber(price)}
          </span>
        </div>
      )}
      <span className={cn('font-extrabold font-num text-[var(--text-primary)]', s.main)}>
        {formatPrice(final)}
      </span>
    </div>
  );
}
