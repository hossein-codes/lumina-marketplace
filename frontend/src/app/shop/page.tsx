"use client";
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useQuery } from '@tanstack/react-query';

function ShopContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || undefined;
  const brand = searchParams.get('brand') || undefined;
  const search = searchParams.get('search') || undefined;
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');

  const queryString = new URLSearchParams();
  if (category) queryString.set('category', category);
  if (brand) queryString.set('brand', brand);
  if (search) queryString.set('search', search);
  queryString.set('sort', sort);
  queryString.set('page', String(page));

  const { data, isLoading } = useQuery({
    queryKey: ['products', category, brand, search, sort, page],
    queryFn: async () => {
      const res = await fetch(`/api/products?${queryString.toString()}`);
      return res.json();
    },
  });

  return (
    <div className="container-page py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] mb-8">فروشگاه</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {category && <span className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-sm font-medium">دسته: {category}</span>}
        {brand && <span className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-sm font-medium">برند: {brand}</span>}
        {search && <span className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-sm font-medium">جستجو: {search}</span>}
      </div>
      <ProductGrid products={data?.data?.items || []} loading={isLoading} />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-page py-12 text-center">در حال بارگذاری...</div>}>
      <ShopContent />
    </Suspense>
  );
}
