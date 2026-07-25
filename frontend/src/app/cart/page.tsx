'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cartStore';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { applyDiscount, formatPrice } from '@/lib/utils/format';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const update = useCartStore((s) => s.update);
  const remove = useCartStore((s) => s.remove);
  const subtotal = useCartStore((s) => s.subtotal());

  if (items.length === 0) {
    return (
      <div className="container-page py-6">
        <EmptyState
          icon={<ShoppingBag size={32} />}
          title="سبد خرید شما خالی است"
          description="می‌توانید از فروشگاه، محصولات مورد نظر خود را انتخاب کنید."
          action={
            <Link href="/shop">
              <Button>مشاهده فروشگاه</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-page py-6">
      <h1 className="text-lg md:text-2xl font-black mb-4">سبد خرید</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-3">
          {items.map((item) => {
            const p = item.product;
            const price = Number(p.price);
            const disc = Number(p.discountPercentage ?? 0);
            const final = applyDiscount(price, disc);
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-3 flex gap-3"
              >
                <Link
                  href={`/product/${p.slug}`}
                  className="relative w-24 h-24 rounded-xl overflow-hidden bg-[var(--surface-muted)] shrink-0"
                >
                  <Image src={p.thumbnail} alt={p.title} fill sizes="96px" className="object-cover" />
                </Link>
                <div className="flex-1 min-w-0 flex flex-col">
                  <Link
                    href={`/product/${p.slug}`}
                    className="text-sm font-medium line-clamp-2 leading-5 hover:text-[var(--color-brand-600)]"
                  >
                    {p.title}
                  </Link>
                  <div className="mt-auto flex items-center justify-between gap-2">
                    <div className="flex items-center rounded-lg border border-[var(--border-default)]">
                      <button
                        onClick={() => update(p.id, item.quantity - 1)}
                        className="w-8 h-8 grid place-items-center"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-num">{item.quantity}</span>
                      <button
                        onClick={() => update(p.id, item.quantity + 1)}
                        className="w-8 h-8 grid place-items-center"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => remove(p.id)}
                      className="text-[var(--color-danger-500)] p-2 rounded-md hover:bg-rose-50"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="text-sm font-bold font-num text-[var(--text-primary)]">
                      {formatPrice(final * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <aside className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 h-fit lg:sticky lg:top-24 space-y-3">
          <h3 className="font-bold">خلاصه سفارش</h3>
          <Row label="جمع کل" value={formatPrice(subtotal)} />
          <Row label="هزینه ارسال" value="در مرحله بعد" />
          <Row label="مالیات (۹٪)" value={formatPrice(Math.round(subtotal * 0.09))} />
          <hr className="border-[var(--border-subtle)]" />
          <div className="flex items-center justify-between text-base font-black">
            <span>مبلغ قابل پرداخت</span>
            <span className="font-num">{formatPrice(Math.round(subtotal * 1.09))}</span>
          </div>
          <Link href="/checkout">
            <Button fullWidth size="lg">
              ادامه فرآیند خرید
            </Button>
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className="font-num text-[var(--text-primary)]">{value}</span>
    </div>
  );
}
