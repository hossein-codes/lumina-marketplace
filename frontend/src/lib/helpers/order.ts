import type { OrderStatus } from '@/lib/types';

export function statusLabel(status: OrderStatus): string {
  switch (status) {
    case 'PENDING': return 'در انتظار پرداخت';
    case 'CONFIRMED': return 'تایید شده';
    case 'PROCESSING': return 'در حال آماده‌سازی';
    case 'SHIPPED': return 'ارسال شده';
    case 'DELIVERED': return 'تحویل داده شده';
    case 'CANCELLED': return 'لغو شده';
    case 'REFUNDED': return 'مسترد شده';
    default: return status;
  }
}

export function statusVariant(status: OrderStatus): 'brand' | 'success' | 'warning' | 'info' | 'danger' | 'neutral' {
  switch (status) {
    case 'PENDING': return 'warning';
    case 'CONFIRMED':
    case 'PROCESSING': return 'info';
    case 'SHIPPED': return 'brand';
    case 'DELIVERED': return 'success';
    case 'CANCELLED':
    case 'REFUNDED': return 'danger';
    default: return 'neutral';
  }
}

export const orderProgressSteps: { key: OrderStatus; label: string }[] = [
  { key: 'PENDING', label: 'ثبت سفارش' },
  { key: 'CONFIRMED', label: 'تأیید پرداخت' },
  { key: 'PROCESSING', label: 'آماده‌سازی' },
  { key: 'SHIPPED', label: 'ارسال' },
  { key: 'DELIVERED', label: 'تحویل' },
];

export function stepIndex(status: OrderStatus): number {
  const i = orderProgressSteps.findIndex((s) => s.key === status);
  return i === -1 ? 0 : i;
}
