"use client";
import { Hero } from '@/components/home/Hero';
import { CategoryStrip } from '@/components/home/CategoryStrip';
import { ProductSection } from '@/components/home/ProductSection';
import { useQuery } from '@tanstack/react-query';

async function fetchProducts(query: string) {
  const res = await fetch(query);
  if (!res.ok) throw new Error('خطا در دریافت');
  return res.json();
}

export default function HomePage() {
  const { data: flashData } = useQuery({ queryKey: ['products', 'flash'], queryFn: () => fetchProducts('/api/products?isFlashSale=true&limit=4') });
  const { data: newData } = useQuery({ queryKey: ['products', 'new'], queryFn: () => fetchProducts('/api/products?isNew=true&limit=4') });
  const { data: popularData } = useQuery({ queryKey: ['products', 'popular'], queryFn: () => fetchProducts('/api/products?sort=rating&limit=4') });

  return (
    <main className="min-h-screen">
      <div className="container-page pt-6 pb-8 md:pt-10 md:pb-12">
        <Hero />
        <CategoryStrip />
        <ProductSection title="فروش ویژه لحظه‌ای" link="/shop?flash=true" products={flashData?.data?.items || []} />
        <ProductSection title="جدیدترین‌ها" link="/shop?new=true" products={newData?.data?.items || []} />
        <ProductSection title="پرفروش‌ترین‌ها" link="/shop?sort=rating" products={popularData?.data?.items || []} />
      </div>
    </main>
  );
}
