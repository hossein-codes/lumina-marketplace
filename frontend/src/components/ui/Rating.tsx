import { Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function Rating({
  value,
  size = 14,
  showValue = true,
  className,
}: {
  value: number | string;
  size?: number;
  showValue?: boolean;
  className?: string;
}) {
  const v = Number(value) || 0;
  return (
    <span className={cn('inline-flex items-center gap-1 text-[var(--color-warning-500)]', className)}>
      <Star size={size} fill="currentColor" strokeWidth={0} />
      {showValue && (
        <span className="text-xs font-medium font-num text-[var(--text-primary)]">{v.toFixed(1)}</span>
      )}
    </span>
  );
}
