import { formatPrice, applyDiscount } from '@/lib/utils/format';

export function Price({ price, discountPercentage }: { price: number | string; discountPercentage?: number | null }) {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  const hasDiscount = discountPercentage && discountPercentage > 0;
  const final = hasDiscount ? applyDiscount(numPrice, discountPercentage) : numPrice;
  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className="text-xl font-bold text-brand-600 font-num">{formatPrice(final)}</span>
      {hasDiscount && (
        <>
          <span className="text-sm text-[var(--text-muted)] line-through font-num">{formatPrice(numPrice)}</span>
          <span className="text-xs font-bold text-success-600 bg-success-50 px-1.5 py-0.5 rounded">{discountPercentage}% تخفیف</span>
        </>
      )}
    </div>
  );
}
