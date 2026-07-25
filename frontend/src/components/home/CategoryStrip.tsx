'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/lib/api/services';
import { Skeleton } from '@/components/ui/Skeleton';

export function CategoryStrip() {
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await categoryService.list()).data ?? [],
    staleTime: 5 * 60_000,
  });

  return (
    <section className="container-page mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-black">دسته‌بندی‌ها</h2>
        <Link href="/shop" className="text-sm text-[var(--color-brand-600)] font-medium">
          مشاهده همه
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="w-14 h-3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {(data ?? []).slice(0, 8).map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className="group flex flex-col items-center gap-2 rounded-xl p-3 hover:bg-[var(--surface-card)] transition-colors"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[var(--surface-card)] border border-[var(--border-subtle)] overflow-hidden relative group-hover:border-[var(--color-brand-300)] transition-colors">
                {c.image ? (
                  <Image src={c.image} alt={c.name} fill className="object-cover" sizes="80px" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-[var(--text-muted)] text-lg font-bold">
                    {c.name?.[0]}
                  </div>
                )}
              </div>
              <span className="text-xs md:text-sm text-[var(--text-primary)] text-center line-clamp-1">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
