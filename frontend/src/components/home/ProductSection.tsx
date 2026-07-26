import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProductGrid } from '@/components/product/ProductGrid';

export function ProductSection({ title, link, products }: { title: string; link: string; products?: any[] }) {
  return (
    <section className="py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-[var(--text-primary)]">{title}</h2>
        <Link href={link} className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors">مشاهده همه <ArrowLeft className="w-4 h-4" /></Link>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
