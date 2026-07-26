import { OrderStatus } from '@prisma/client';

export function statusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    PENDING: 'در انتظار تأیید',
    CONFIRMED: 'تأیید شده',
    PROCESSING: 'در حال پردازش',
    SHIPPED: 'ارسال شده',
    DELIVERED: 'تحویل داده شده',
    CANCELLED: 'لغو شده',
    REFUNDED: 'بازگشت داده شده',
  };
  return labels[status] || status;
}

export function statusVariant(status: OrderStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'DELIVERED':
      return 'success';
    case 'SHIPPED':
      return 'info';
    case 'PROCESSING':
      return 'warning';
    case 'CANCELLED':
    case 'REFUNDED':
      return 'danger';
    default:
      return 'default';
  }
}

export function orderProgressSteps(status: OrderStatus) {
  const steps = [
    { key: 'PENDING', label: 'در انتظار تأیید', completed: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(status) },
    { key: 'CONFIRMED', label: 'تأیید شده', completed: ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(status) },
    { key: 'PROCESSING', label: 'در حال پردازش', completed: ['SHIPPED', 'DELIVERED'].includes(status) },
    { key: 'SHIPPED', label: 'ارسال شده', completed: ['DELIVERED'].includes(status) },
    { key: 'DELIVERED', label: 'تحویل داده شده', completed: status === 'DELIVERED' },
  ];
  return steps;
}
