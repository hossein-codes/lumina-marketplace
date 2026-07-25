'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import { orderService } from '@/lib/api/services';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate, formatPrice } from '@/lib/utils/format';
import { orderProgressSteps, statusLabel, statusVariant, stepIndex } from '@/lib/helpers/order';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getById(id),
  });

  if (isLoading) {
    return (
      <div className="container-page py-6 space-y-4">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }
  const order = data?.data;
  if (!order) {
    return (
      <div className="container-page py-10 text-center">
        <p>سفارش یافت نشد.</p>
        <Link href="/orders" className="text-[var(--color-brand-600)] font-bold">
          بازگشت
        </Link>
      </div>
    );
  }

  const activeStep = stepIndex(order.status);

  return (
    <div className="container-page py-6 space-y-5">
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-black">سفارش {order.orderNumber}</h1>
            <p className="text-xs text-[var(--text-muted)] mt-1">{formatDate(order.createdAt)}</p>
          </div>
          <Badge variant={statusVariant(order.status)}>{statusLabel(order.status)}</Badge>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="grid grid-cols-5 gap-2 items-center">
            {orderProgressSteps.map((s, i) => (
              <div key={s.key} className="flex flex-col items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full grid place-items-center text-xs font-bold ${
                    i <= activeStep
                      ? 'bg-[var(--color-brand-500)] text-white'
                      : 'bg-[var(--surface-muted)] text-[var(--text-muted)]'
                  }`}
                >
                  {i <= activeStep ? <CheckCircle2 size={14} /> : i + 1}
                </div>
                <span className="text-[11px] text-center">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {order.trackingCode && (
          <div className="mt-4 rounded-xl bg-[var(--surface-muted)] px-4 py-3 text-sm">
            کد رهگیری: <span className="font-bold font-num">{order.trackingCode}</span>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5">
        <h2 className="font-bold mb-4">اقلام سفارش</h2>
        <div className="space-y-3">
          {order.items.map((it) => (
            <div key={it.id} className="flex items-center gap-3">
              {it.product && (
                <Link
                  href={`/product/${it.product.slug}`}
                  className="relative w-16 h-16 rounded-lg overflow-hidden bg-[var(--surface-muted)] shrink-0"
                >
                  <Image src={it.product.thumbnail} alt="" fill sizes="64px" className="object-cover" />
                </Link>
              )}
              <div className="flex-1 text-sm">
                <div className="line-clamp-1">{it.product?.title}</div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">
                  <span className="font-num">{it.quantity}</span> × {formatPrice(Number(it.unitPrice))}
                </div>
              </div>
              <div className="font-bold font-num text-sm">{formatPrice(Number(it.totalPrice))}</div>
            </div>
          ))}
        </div>

        <hr className="my-4 border-[var(--border-subtle)]" />
        <div className="space-y-2 text-sm">
          <Row label="جمع کالاها" value={formatPrice(Number(order.subtotal))} />
          <Row label="مالیات" value={formatPrice(Number(order.taxAmount))} />
          <Row label="هزینه ارسال" value={formatPrice(Number(order.shippingCost))} />
          <div className="flex items-center justify-between font-black text-base pt-2">
            <span>مبلغ کل</span>
            <span className="font-num text-[var(--color-brand-600)]">
              {formatPrice(Number(order.totalAmount))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className="font-num">{value}</span>
    </div>
  );
}
