import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Truck, Undo2 } from 'lucide-react';

export function Hero() {
  return (
    <section className="container-page mt-4 md:mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-l from-[var(--color-brand-500)] to-[var(--color-brand-700)] text-white p-6 md:p-10 min-h-[280px] md:min-h-[360px] flex flex-col justify-between">
          <div>
            <span className="inline-block text-xs font-medium bg-white/15 backdrop-blur px-3 py-1 rounded-full">
              فروش ویژه لومینا
            </span>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight mt-4 max-w-xl">
              تخفیف تا <span className="font-num">۴۰٪</span> روی هزاران محصول اصل
            </h1>
            <p className="mt-3 text-sm md:text-base opacity-90 max-w-md">
              با ضمانت اصالت و ارسال سریع در سراسر ایران. همین حالا فرصت خرید را از دست ندهید.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white text-[var(--color-brand-600)] font-bold text-sm hover:bg-white/90"
            >
              شروع خرید
              <ArrowLeft size={16} />
            </Link>
            <Link
              href="/shop?flash=1"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-black/20 backdrop-blur text-white font-medium text-sm hover:bg-black/30"
            >
              فروش لحظه‌ای
            </Link>
          </div>
          <div className="pointer-events-none absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          <PromoCard
            title="ارسال سریع"
            subtitle="در سراسر ایران، فقط ۲۴ تا ۷۲ ساعت"
            Icon={Truck}
          />
          <PromoCard title="ضمانت اصالت" subtitle="بازگشت پول در صورت تقلبی بودن" Icon={ShieldCheck} />
          <PromoCard title="۷ روز مهلت بازگشت" subtitle="بدون قید و شرط" Icon={Undo2} />
        </div>
      </div>
    </section>
  );
}

function PromoCard({
  title,
  subtitle,
  Icon,
}: {
  title: string;
  subtitle: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="rounded-2xl bg-[var(--surface-card)] border border-[var(--border-subtle)] p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-50)] text-[var(--color-brand-600)] grid place-items-center shrink-0">
        <Icon size={20} />
      </div>
      <div>
        <div className="text-sm font-bold">{title}</div>
        <div className="text-xs text-[var(--text-muted)]">{subtitle}</div>
      </div>
    </div>
  );
}
