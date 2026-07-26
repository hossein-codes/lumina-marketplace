"use client";
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';

export function ProductGrid({ products, loading }: { products?: any[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="p-4 flex flex-col gap-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products?.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
