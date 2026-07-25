'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, MapPin, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { addressService, orderService, paymentService } from '@/lib/api/services';
import { useAuthStore } from '@/lib/stores/authStore';
import { useCartStore } from '@/lib/stores/cartStore';
import type { PaymentMethod } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { applyDiscount, formatPrice } from '@/lib/utils/format';

const steps = ['نشانی', 'پرداخت', 'تایید'] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const subtotal = useCartStore((s) => s.subtotal());
  const qc = useQueryClient();

  const [step, setStep] = useState(0);
  const [addressId, setAddressId] = useState<string | undefined>();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH_ON_DELIVERY');
  const [newAddress, setNewAddress] = useState({
    label: 'خانه',
    street: '',
    city: '',
    province: '',
    zipCode: '',
    country: 'IR',
    isDefault: false,
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    if (!user) router.replace(`/login?redirect=/checkout`);
  }, [user, router]);

  useEffect(() => {
    if (items.length === 0 && step < 2) router.replace('/cart');
  }, [items.length, router, step]);

  const addressesQ = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => (await addressService.list()).data ?? [],
    enabled: !!user,
  });

  useEffect(() => {
    const defaultAddress = addressesQ.data?.find((a) => a.isDefault) ?? addressesQ.data?.[0];
    if (!addressId && defaultAddress) setAddressId(defaultAddress.id);
  }, [addressesQ.data, addressId]);

  const createAddress = useMutation({
    mutationFn: () => addressService.create(newAddress),
    onSuccess: async (res) => {
      toast.success('نشانی افزوده شد');
      await qc.invalidateQueries({ queryKey: ['addresses'] });
      setAddressId(res.data!.id);
      setShowAddressForm(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const tax = Math.round(subtotal * 0.09);
  const total = subtotal + tax;

  const createOrder = useMutation({
    mutationFn: () =>
      orderService.create({
        items: items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
          unitPrice: applyDiscount(Number(it.product.price), Number(it.product.discountPercentage ?? 0)),
        })),
        shippingAddressId: addressId,
        billingAddressId: addressId,
        paymentMethod,
      }),
    onSuccess: async (res) => {
      const order = res.data!;
      // Payment record (optional; useful for BANK_TRANSFER / CARD flows)
      try {
        await paymentService.create({
          orderId: order.id,
          amount: Number(order.totalAmount),
          method: paymentMethod,
        });
      } catch {
        /* non-fatal */
      }
      await clearCart();
      setStep(2);
      toast.success('سفارش شما ثبت شد');
      router.replace(`/orders/${order.id}?new=1`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const canGoNext = useMemo(() => {
    if (step === 0) return !!addressId;
    if (step === 1) return !!paymentMethod;
    return true;
  }, [step, addressId, paymentMethod]);

  if (!user) return null;

  return (
    <div className="container-page py-6">
      <div className="mb-6 flex items-center gap-4 justify-center">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full grid place-items-center text-xs font-bold font-num ${
                i <= step
                  ? 'bg-[var(--color-brand-500)] text-white'
                  : 'bg-[var(--surface-muted)] text-[var(--text-muted)]'
              }`}
            >
              {i + 1}
            </div>
            <span className={`text-sm ${i === step ? 'font-bold' : 'text-[var(--text-muted)]'}`}>
              {s}
            </span>
            {i < steps.length - 1 && <span className="mx-2 text-[var(--text-muted)]">—</span>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5">
          {step === 0 && (
            <>
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <MapPin size={18} /> نشانی ارسال
              </h2>

              <div className="space-y-2 mb-4">
                {(addressesQ.data ?? []).map((a) => (
                  <label
                    key={a.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer ${
                      addressId === a.id
                        ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-50)]'
                        : 'border-[var(--border-subtle)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={addressId === a.id}
                      onChange={() => setAddressId(a.id)}
                      className="mt-1 accent-[var(--color-brand-500)]"
                    />
                    <div className="text-sm">
                      <div className="font-bold flex items-center gap-2">
                        {a.label || 'نشانی'}
                        {a.isDefault && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5">
                            پیش‌فرض
                          </span>
                        )}
                      </div>
                      <div className="text-[var(--text-muted)] mt-0.5">
                        {a.province}، {a.city}، {a.street} — کد پستی: {a.zipCode}
                      </div>
                    </div>
                  </label>
                ))}

                {(addressesQ.data ?? []).length === 0 && !showAddressForm && (
                  <div className="text-sm text-[var(--text-muted)]">
                    هنوز نشانی ثبت نکرده‌اید.
                  </div>
                )}
              </div>

              {!showAddressForm ? (
                <Button
                  variant="outline"
                  leftIcon={<Plus size={16} />}
                  onClick={() => setShowAddressForm(true)}
                >
                  افزودن نشانی جدید
                </Button>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    label="عنوان (اختیاری)"
                    value={newAddress.label}
                    onChange={(e) => setNewAddress((a) => ({ ...a, label: e.target.value }))}
                  />
                  <Input
                    label="استان"
                    value={newAddress.province}
                    onChange={(e) => setNewAddress((a) => ({ ...a, province: e.target.value }))}
                  />
                  <Input
                    label="شهر"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress((a) => ({ ...a, city: e.target.value }))}
                  />
                  <Input
                    label="کد پستی"
                    value={newAddress.zipCode}
                    onChange={(e) => setNewAddress((a) => ({ ...a, zipCode: e.target.value }))}
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="نشانی کامل"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress((a) => ({ ...a, street: e.target.value }))}
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-2">
                    <Button
                      onClick={() => createAddress.mutate()}
                      loading={createAddress.isPending}
                      disabled={!newAddress.street || !newAddress.city || !newAddress.province || !newAddress.zipCode}
                    >
                      ذخیره نشانی
                    </Button>
                    <Button variant="ghost" onClick={() => setShowAddressForm(false)}>
                      انصراف
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="font-bold mb-4">روش پرداخت</h2>
              <div className="space-y-2">
                {[
                  { id: 'CARD', label: 'کارت به کارت / درگاه بانکی' },
                  { id: 'BANK_TRANSFER', label: 'انتقال بانکی' },
                  { id: 'WALLET', label: 'کیف پول لومینا' },
                  { id: 'CASH_ON_DELIVERY', label: 'پرداخت در محل' },
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${
                      paymentMethod === m.id
                        ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-50)]'
                        : 'border-[var(--border-subtle)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="method"
                      checked={paymentMethod === m.id}
                      onChange={() => setPaymentMethod(m.id as PaymentMethod)}
                      className="accent-[var(--color-brand-500)]"
                    />
                    <span className="text-sm">{m.label}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <div className="text-center py-10">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 grid place-items-center mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-xl font-bold">سفارش شما با موفقیت ثبت شد</h2>
              <p className="text-sm text-[var(--text-muted)] mt-2">
                جزئیات سفارش برای شما ارسال خواهد شد.
              </p>
              <Link href="/orders" className="inline-block mt-6">
                <Button>مشاهده سفارش‌ها</Button>
              </Link>
            </div>
          )}

          {step < 2 && (
            <div className="flex justify-between mt-6">
              <Button
                variant="ghost"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                مرحله قبل
              </Button>
              {step < 1 ? (
                <Button onClick={() => setStep(1)} disabled={!canGoNext}>
                  ادامه
                </Button>
              ) : (
                <Button
                  onClick={() => createOrder.mutate()}
                  loading={createOrder.isPending}
                  disabled={!canGoNext || items.length === 0}
                >
                  ثبت نهایی سفارش
                </Button>
              )}
            </div>
          )}
        </div>

        <aside className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 h-fit space-y-3 lg:sticky lg:top-24">
          <h3 className="font-bold">خلاصه سفارش</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {items.map((it) => (
              <div key={it.id} className="flex items-center justify-between text-xs">
                <span className="line-clamp-1">
                  {it.product.title} × <span className="font-num">{it.quantity}</span>
                </span>
                <span className="font-num">
                  {formatPrice(
                    applyDiscount(Number(it.product.price), Number(it.product.discountPercentage ?? 0)) *
                      it.quantity
                  )}
                </span>
              </div>
            ))}
          </div>
          <hr className="border-[var(--border-subtle)]" />
          <Row label="جمع کالاها" value={formatPrice(subtotal)} />
          <Row label="مالیات (۹٪)" value={formatPrice(tax)} />
          <Row label="ارسال" value="رایگان" />
          <hr className="border-[var(--border-subtle)]" />
          <div className="flex items-center justify-between font-black text-base">
            <span>مبلغ قابل پرداخت</span>
            <span className="font-num text-[var(--color-brand-600)]">{formatPrice(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className="font-num">{value}</span>
    </div>
  );
}
