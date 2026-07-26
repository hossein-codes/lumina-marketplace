import { Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function Rating({ value, max = 5, showValue = true }: { value?: number | null; max?: number; showValue?: boolean }) {
  const val = value || 0;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5" dir="ltr">
        {Array.from({ length: max }).map((_, i) => (
          <Star
            key={i}
            className={cn('w-4 h-4', i < Math.round(val) ? 'text-amber-400 fill-amber-400' : 'text-ink-200')}
          />
        ))}
      </div>
      {showValue && val > 0 && <span className="text-xs text-[var(--text-muted)] font-num">{val.toFixed(1)}</span>}
    </div>
  );
}
