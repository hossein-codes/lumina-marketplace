import { notFound } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { Price } from '@/components/ui/Price';
import { Rating } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/products/${slug}`, { cache: 'no-store' });
  if (!res.ok) return notFound();
  const product = await res.json();
  if (!product.data) return notFound();
  const p = product.data;

  return (
    <main className="min-h-screen bg-[var(--surface-page)]">
      <div className="container-page py-8 md:py-12">
        <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
          <Link href="/" className="hover:text-brand-600">خانه</Link>
          <ArrowRight className="w-3 h-3 rotate-180" />
          <Link href="/shop" className="hover:text-brand-600">فروشگاه</Link>
          <ArrowRight className="w-3 h-3 rotate-180" />
          <span className="text-[var(--text-primary)]">{p.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <div className="rounded-3xl overflow-hidden bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-md">
              <img src={p.thumbnail} alt={p.title} className="w-full aspect-[4/3] object-cover" />
            </div>
            <div className="flex gap-2 mt-4">
              {p.images?.map((img: string, i: number) => (
                <img key={i} src={img} alt="" className="w-20 h-20 rounded-xl object-cover border border-[var(--border-subtle)] hover:border-brand-300 transition-colors" />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] leading-tight">{p.title}</h1>
              <div className="flex items-center gap-3 mt-3">
                <Link href={`/shop?brand=${p.brand?.slug}`} className="text-sm text-brand-600 hover:text-brand-700 font-medium">{p.brand?.name}</Link>
                <span className="text-[var(--text-muted)]">|</span>
                <span className="text-xs text-[var(--text-muted)]">SKU: {p.sku}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Rating value={p.rating} />
                <span className="text-sm text-[var(--text-muted)]">({p.reviewCount} نظر)</span>
              </div>
            </div>

            <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-sm sticky top-24">
              <Price price={p.price} discountPercentage={p.discountPercentage} />
              <div className="flex items-center gap-2 mt-3 text-sm">
                <span className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-success-500' : p.stock > 0 ? 'bg-warning-500' : 'bg-danger-500'}`}></span>
                <span className="text-[var(--text-secondary)]">{p.stock > 10 ? 'موجود در انبار' : p.stock > 0 ? `فقط ${p.stock} عدد باقی مانده` : 'ناموجود'}</span>
              </div>

              <div className="flex gap-3 mt-6">
                <button className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-glow hover:-translate-y-0.5">افزودن به سبد</button>
                <button className="px-4 py-3 border border-[var(--border-default)] rounded-xl hover:bg-[var(--surface-muted)] transition-colors">علاقه‌مندی</button>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-[var(--border-subtle)]">
                <div className="flex flex-col items-center gap-1 text-center">
                  <Truck className="w-5 h-5 text-brand-500" />
                  <span className="text-[10px] text-[var(--text-muted)]">ارسال سریع</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <ShieldCheck className="w-5 h-5 text-brand-500" />
                  <span className="text-[10px] text-[var(--text-muted)]">ضمانت اصالت</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <RotateCcw className="w-5 h-5 text-brand-500" />
                  <span className="text-[10px] text-[var(--text-muted)]">بازگشت ۷ روزه</span>
                </div>
              </div>
            </div>

            <div className="prose max-w-none text-[var(--text-secondary)] leading-relaxed">
              <h3 className="font-bold text-[var(--text-primary)] mb-2">توضیحات محصول</h3>
              <p>{p.description}</p>
            </div>

            <div>
              <h3 className="font-bold text-[var(--text-primary)] mb-3">برچسب‌ها</h3>
              <div className="flex flex-wrap gap-2">
                {p.tags?.map((tag: string) => (
                  <Badge key={tag} variant="neutral">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
