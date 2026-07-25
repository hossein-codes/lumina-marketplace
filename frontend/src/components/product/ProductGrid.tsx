import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';

export function ProductGrid({
  products,
  loading,
  emptyMessage = 'کالایی یافت نشد',
}: {
  products?: Product[];
  loading?: boolean;
  emptyMessage?: string;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-[var(--border-subtle)]">
            <Skeleton className="aspect-square rounded-none" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-2/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 text-[var(--text-muted)] text-sm">{emptyMessage}</div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
