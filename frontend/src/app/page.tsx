import { Hero } from '@/components/home/Hero';
import { CategoryStrip } from '@/components/home/CategoryStrip';
import { ProductSection } from '@/components/home/ProductSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryStrip />
      <ProductSection title="فروش ویژه لحظه‌ای" href="/shop?flash=1" params={{ limit: 10, sort: 'createdAt' }} />
      <ProductSection title="جدیدترین‌ها" href="/shop?sort=new" params={{ limit: 10, sort: 'createdAt' }} />
      <ProductSection title="پرفروش‌ترین‌ها" href="/shop?sort=popular" params={{ limit: 10, sort: 'rating' }} />
    </>
  );
}
