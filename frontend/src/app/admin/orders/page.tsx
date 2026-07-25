'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminService } from '@/lib/api/services';
import type { OrderStatus } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate, formatPrice } from '@/lib/utils/format';
import { statusLabel, statusVariant } from '@/lib/helpers/order';

const statuses: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
];

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<OrderStatus | ''>('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', filter],
    queryFn: async () => (await adminService.listOrders({ status: filter || undefined, limit: 50 })).data ?? [],
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      adminService.updateOrderStatus(id, { status }),
    onSuccess: () => {
      toast.success('وضعیت به‌روزرسانی شد');
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-black">مدیریت سفارش‌ها</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as OrderStatus | '')}
          className="h-9 rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] px-3 text-sm"
        >
          <option value="">همه وضعیت‌ها</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{statusLabel(s)}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--surface-muted)] text-[var(--text-muted)] text-xs">
              <tr>
                <th className="text-right p-3">شماره</th>
                <th className="text-right p-3">مشتری</th>
                <th className="text-right p-3">تاریخ</th>
                <th className="text-right p-3">مبلغ</th>
                <th className="text-right p-3">وضعیت</th>
                <th className="text-right p-3">تغییر</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((o) => (
                <tr key={o.id} className="border-t border-[var(--border-subtle)]">
                  <td className="p-3 font-num text-xs">{o.orderNumber}</td>
                  <td className="p-3">
                    {o.user?.firstName} {o.user?.lastName}
                    <div className="text-xs text-[var(--text-muted)]">{o.user?.email}</div>
                  </td>
                  <td className="p-3 text-xs">{formatDate(o.createdAt)}</td>
                  <td className="p-3 font-num font-bold">{formatPrice(Number(o.totalAmount))}</td>
                  <td className="p-3"><Badge variant={statusVariant(o.status)}>{statusLabel(o.status)}</Badge></td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus.mutate({ id: o.id, status: e.target.value as OrderStatus })}
                      className="h-8 rounded-md border border-[var(--border-default)] bg-[var(--surface-card)] px-2 text-xs"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{statusLabel(s)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {(data ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-[var(--text-muted)]">سفارشی یافت نشد</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
