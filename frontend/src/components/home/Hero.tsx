import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-brand-800 text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
      <div className="relative container-page py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> فروش ویژه لحظه‌ای
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 tracking-tight">بهترین برندها، بهترین قیمت‌ها</h1>
          <p className="text-white/90 text-base md:text-lg mb-8 leading-relaxed">با لومینا مارکت، خریدی مطمئن و سریع را تجربه کنید. ارسال فوری، ضمانت اصالت و پشتیبانی ۲۴ ساعته.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-white text-brand-600 hover:bg-white/90 px-6 py-3 rounded-xl font-bold text-base shadow-xl transition-all hover:shadow-2xl hover:-translate-y-0.5">
            شروع خرید <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
