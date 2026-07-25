'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Package } from 'lucide-react';
import { orderService } from '@/lib/api/services';
import { useAuthStore } from '@/lib/stores/authStore';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate, formatPrice } from '@/lib/utils/format';
import { statusLabel, statusVariant } from '@/lib/helpers/order';

export default function OrdersPage() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => (await orderService.myOrders()).data ?? [],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="container-page py-6">
        <EmptyState
          icon={<Package size={32} />}
          title="برای مشاهده سفارش‌ها ابتدا وارد شوید"
          action={
            <Link href="/login?redirect=/orders">
              <Button>ورود</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-page py-6">
      <h1 className="text-lg md:text-2xl font-black mb-4">سفارش‌های من</h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : (data ?? []).length === 0 ? (
        <EmptyState
          icon={<Package size={32} />}
          title="هنوز سفارشی ثبت نکرده‌اید"
          action={
            <Link href="/shop">
              <Button>شروع خرید</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {data!.map((o) => (
            <Link
              key={o.id}
              href={`/orders/${o.id}`}
              className="block rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 hover:border-[var(--color-brand-300)] transition-colors"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="font-bold text-sm">سفارش {o.orderNumber}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">
                    {formatDate(o.createdAt)} • <span className="font-num">{o.items.length}</span> کالا
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusVariant(o.status)}>{statusLabel(o.status)}</Badge>
                  <span className="font-bold font-num">{formatPrice(Number(o.totalAmount))}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
