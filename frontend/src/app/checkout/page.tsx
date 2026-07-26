"use client";
import { useState } from 'react';
import { CheckCircle, Truck, CreditCard, ReceiptText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const steps = [
  { key: 1, label: 'آدرس', icon: Truck },
  { key: 2, label: 'پرداخت', icon: CreditCard },
  { key: 3, label: 'تأیید', icon: ReceiptText },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(1);

  return (
    <main className="min-h-screen">
      <div className="container-page py-8 md:py-12">
        <h1 className="text-3xl font-black text-[var(--text-primary)] mb-8">فرآیند خرید</h1>
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${step >= s.key ? 'bg-brand-500 text-white' : 'bg-[var(--surface-muted)] text-[var(--text-muted)]'}`}>
                <s.icon className="w-4 h-4" /> {s.label}
              </div>
              {i < steps.length - 1 && <ArrowLeft className="w-4 h-4 text-[var(--text-muted)] rotate-180" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-sm">
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">انتخاب آدرس</h2>
                <div className="p-4 border border-[var(--border-subtle)] rounded-xl hover:border-brand-300 transition-colors cursor-pointer">
                  <div className="font-medium text-[var(--text-primary)]">خانه</div>
                  <div className="text-sm text-[var(--text-muted)] mt-1">تهران، خیابان ولیعصر، پلاک ۱</div>
                </div>
                <Button className="mt-4" onClick={() => setStep(2)}>ادامه</Button>
              </div>
            )}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">روش پرداخت</h2>
                <div className="grid grid-cols-2 gap-3">
                  {['CARD', 'BANK_TRANSFER', 'WALLET', 'CASH_ON_DELIVERY'].map((method) => (
                    <button key={method} className="p-4 border border-[var(--border-subtle)] rounded-xl hover:border-brand-300 text-sm font-medium text-[var(--text-primary)] transition-colors">{method}</button>
                  ))}
                </div>
                <Button className="mt-4" onClick={() => setStep(3)}>ادامه</Button>
              </div>
            )}
            {step === 3 && (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-success-500 mx-auto mb-4" />
                <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2">سفارش ثبت شد!</h2>
                <p className="text-[var(--text-muted)] mb-6">سفارش شما با موفقیت ثبت شده و در حال پردازش است.</p>
                <Link href="/orders"><Button>مشاهده سفارش‌ها</Button></Link>
              </div>
            )}
          </div>
          <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-2xl p-6 h-fit shadow-sm">
            <h3 className="font-bold text-lg text-[var(--text-primary)] mb-4">خلاصه سفارش</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-[var(--text-muted)]"><span>زیرمجموعه</span><span>۰ تومان</span></div>
              <div className="flex justify-between text-[var(--text-muted)]"><span>مالیات (۹٪)</span><span>۰ تومان</span></div>
              <div className="border-t border-[var(--border-subtle)] pt-3 flex justify-between font-bold text-base text-[var(--text-primary)]"><span>مجموع</span><span>۰ تومان</span></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
