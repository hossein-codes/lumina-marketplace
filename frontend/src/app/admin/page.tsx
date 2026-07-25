'use client';

import { useQuery } from '@tanstack/react-query';
import { Boxes, DollarSign, Package, TrendingUp, Users } from 'lucide-react';
import { adminService } from '@/lib/api/services';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatNumber, formatPrice } from '@/lib/utils/format';
import { statusLabel } from '@/lib/helpers/order';

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => (await adminService.stats()).data!,
  });

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="کاربران" value={formatNumber(data.users)} Icon={Users} />
        <StatCard label="محصولات" value={formatNumber(data.products)} Icon={Boxes} />
        <StatCard label="سفارش‌ها" value={formatNumber(data.orders)} Icon={Package} />
        <StatCard label="درآمد" value={formatPrice(data.revenue)} Icon={DollarSign} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5">
          <div className="flex items-center gap-2 font-bold mb-3">
            <TrendingUp size={18} /> وضعیت سفارش‌ها
          </div>
          <div className="space-y-2">
            {data.ordersByStatus.map((s) => (
              <div key={s.status} className="flex items-center justify-between text-sm">
                <span>{statusLabel(s.status)}</span>
                <span className="font-num font-bold">{formatNumber(s._count._all)}</span>
              </div>
            ))}
            {data.ordersByStatus.length === 0 && (
              <div className="text-sm text-[var(--text-muted)]">سفارشی ثبت نشده.</div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5">
          <div className="font-bold mb-3">پرفروش‌ترین محصولات</div>
          <div className="space-y-2">
            {data.topProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${p.thumbnail})` }} />
                <div className="flex-1 min-w-0">
                  <div className="line-clamp-1">{p.title}</div>
                  <div className="text-xs text-[var(--text-muted)] font-num">موجودی: {p.stock}</div>
                </div>
                <div className="font-bold font-num">{formatPrice(Number(p.price))}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, Icon }: { label: string; value: string; Icon: React.ComponentType<{ size?: number; className?: string }> }) {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 flex items-start justify-between">
      <div>
        <div className="text-xs text-[var(--text-muted)]">{label}</div>
        <div className="text-lg font-black font-num mt-1">{value}</div>
      </div>
      <div className="w-9 h-9 rounded-lg bg-[var(--color-brand-50)] text-[var(--color-brand-600)] grid place-items-center">
        <Icon size={18} />
      </div>
    </div>
  );
}
