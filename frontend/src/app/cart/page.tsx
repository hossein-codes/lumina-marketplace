import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartPage() {
  return (
    <main className="min-h-screen">
      <div className="container-page py-8 md:py-12">
        <h1 className="text-3xl font-black text-[var(--text-primary)] mb-8">سبد خرید</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EmptyState title="سبد خرید شما خالی است" description="محصولات مورد علاقه خود را به سبد اضافه کنید و از خرید لذت ببرید." icon="cart" />
          </div>
          <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-2xl p-6 h-fit shadow-sm">
            <h3 className="font-bold text-lg text-[var(--text-primary)] mb-4">خلاصه سفارش</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-[var(--text-muted)]"><span>زیرمجموعه</span><span>۰ تومان</span></div>
              <div className="flex justify-between text-[var(--text-muted)]"><span>مالیات (۹٪)</span><span>۰ تومان</span></div>
              <div className="border-t border-[var(--border-subtle)] pt-3 flex justify-between font-bold text-base text-[var(--text-primary)]"><span>مجموع</span><span>۰ تومان</span></div>
            </div>
            <Link href="/checkout" className="block mt-6"><Button className="w-full" size="lg">ادامه فرآیند خرید</Button></Link>
          </div>
        </div>
      </div>
    </main>
  );
}
