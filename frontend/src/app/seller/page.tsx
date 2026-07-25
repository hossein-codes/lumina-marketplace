'use client';

import { useQuery } from '@tanstack/react-query';
import { Boxes, Package, ShoppingBag } from 'lucide-react';
import { productService } from '@/lib/api/services';
import { formatNumber } from '@/lib/utils/format';

export default function SellerDashboardPage() {
  const { data } = useQuery({
    queryKey: ['seller-products'],
    queryFn: async () => (await productService.list({ limit: 100 })).data ?? [],
  });

  const total = data?.length ?? 0;
  const inStock = data?.filter((p) => p.stock > 0).length ?? 0;
  const outOfStock = total - inStock;

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-black">داشبورد فروشنده</h1>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="کل محصولات" value={formatNumber(total)} Icon={Boxes} />
        <Stat label="موجود" value={formatNumber(inStock)} Icon={Package} />
        <Stat label="ناموجود" value={formatNumber(outOfStock)} Icon={ShoppingBag} />
      </div>
      <p className="text-sm text-[var(--text-muted)]">
        در نسخه بعدی، سفارش‌های اختصاصی فروشنده و آمار درآمد اضافه خواهد شد.
      </p>
    </div>
  );
}

function Stat({ label, value, Icon }: { label: string; value: string; Icon: React.ComponentType<{ size?: number }> }) {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 flex items-center justify-between">
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
