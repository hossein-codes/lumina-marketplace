import Link from 'next/link';
import { ArrowRight, CheckCircle, Truck, PackageCheck, TruckIcon, CheckCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { statusLabel, statusVariant, orderProgressSteps } from '@/lib/helpers/order';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/orders/${id}`, { cache: 'no-store' });
  if (!res.ok) return <div className="container-page py-12">سفارش یافت نشد</div>;
  const order = await res.json();
  if (!order.data) return <div className="container-page py-12">سفارش یافت نشد</div>;
  const o = order.data;

  const steps = orderProgressSteps(o.status);

  return (
    <main className="min-h-screen">
      <div className="container-page py-8 md:py-12">
        <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
          <Link href="/" className="hover:text-brand-600">خانه</Link>
          <ArrowRight className="w-3 h-3 rotate-180" />
          <Link href="/orders" className="hover:text-brand-600">سفارش‌ها</Link>
          <ArrowRight className="w-3 h-3 rotate-180" />
          <span className="text-[var(--text-primary)]">سفارش #{o.id.slice(0, 8)}</span>
        </nav>

        <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-[var(--text-primary)]">سفارش #{o.id.slice(0, 8)}</h1>
              <p className="text-sm text-[var(--text-muted)] mt-1">{new Date(o.createdAt).toLocaleDateString('fa-IR')}</p>
            </div>
            <Badge variant={statusVariant(o.status) as any}>{statusLabel(o.status)}</Badge>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
            {steps.map((step) => (
              <div key={step.key} className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${step.completed ? 'bg-brand-500 text-white' : 'bg-[var(--surface-muted)] text-[var(--text-muted)]'}`}>
                <CheckCircle className="w-3.5 h-3.5" /> {step.label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-[var(--text-primary)] mb-3">جزئیات سفارش</h3>
              <div className="space-y-2 text-sm">
                {o.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-[var(--surface-muted)] rounded-xl">
                    <img src={item.thumbnail} alt={item.title} className="w-14 h-14 rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="font-medium text-[var(--text-primary)]">{item.title}</div>
                      <div className="text-xs text-[var(--text-muted)]">{item.quantity} × {item.price} تومان</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-[var(--text-primary)] mb-3">خلاصه مالی</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[var(--text-muted)]"><span>زیرمجموعه</span><span>{o.subtotal} تومان</span></div>
                <div className="flex justify-between text-[var(--text-muted)]"><span>مالیات</span><span>{o.tax} تومان</span></div>
                <div className="border-t border-[var(--border-subtle)] pt-2 flex justify-between font-bold text-base text-[var(--text-primary)]"><span>مجموع</span><span>{o.total} تومان</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
