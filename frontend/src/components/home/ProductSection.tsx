'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { productService, type ProductListParams } from '@/lib/api/services';
import { ProductGrid } from '@/components/product/ProductGrid';

export function ProductSection({
  title,
  href,
  params,
}: {
  title: string;
  href: string;
  params: ProductListParams;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ['products-section', params],
    queryFn: async () => (await productService.list(params)).data ?? [],
    staleTime: 60_000,
  });

  return (
    <section className="container-page mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-black">{title}</h2>
        <Link href={href} className="text-sm text-[var(--color-brand-600)] font-medium">
          مشاهده همه
        </Link>
      </div>
      <ProductGrid products={data?.slice(0, 10)} loading={isLoading} />
    </section>
  );
}
