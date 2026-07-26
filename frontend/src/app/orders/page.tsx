import Link from 'next/link';
import { Package, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { statusLabel, statusVariant } from '@/lib/helpers/order';

export default function OrdersPage() {
  return (
    <main className="min-h-screen">
      <div className="container-page py-8 md:py-12">
        <h1 className="text-3xl font-black text-[var(--text-primary)] mb-8">سفارش‌های من</h1>
        <EmptyState title="هنوز سفارشی ثبت نکرده‌اید" description="پس از ثبت سفارش، می‌توانید وضعیت آن را از اینجا پیگیری کنید." icon="orders" />
      </div>
    </main>
  );
}
