"use client";
import Link from 'next/link';
import { User, MapPin, ShieldCheck, LogOut, Store } from 'lucide-react';

export default function ProfilePage() {
  return (
    <main className="min-h-screen">
      <div className="container-page py-8 md:py-12">
        <h1 className="text-3xl font-black text-[var(--text-primary)] mb-8">حساب کاربری</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-2xl p-4 h-fit shadow-sm lg:col-span-1">
            <nav className="flex flex-col gap-1">
              <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-brand-50 text-brand-700 font-medium text-sm"><User className="w-4 h-4" /> اطلاعات شخصی</Link>
              <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--surface-muted)] text-[var(--text-secondary)] text-sm transition-colors"><MapPin className="w-4 h-4" /> نشانی‌ها</Link>
              <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--surface-muted)] text-[var(--text-secondary)] text-sm transition-colors"><ShieldCheck className="w-4 h-4" /> امنیت</Link>
              <Link href="/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--surface-muted)] text-[var(--text-secondary)] text-sm transition-colors">سفارش‌ها</Link>
              <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--surface-muted)] text-[var(--text-secondary)] text-sm transition-colors"><Store className="w-4 h-4" /> پنل ادمین</Link>
              <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-danger-50 text-danger-600 text-sm transition-colors text-right"><LogOut className="w-4 h-4" /> خروج</button>
            </nav>
          </aside>
          <div className="lg:col-span-3 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">اطلاعات شخصی</h2>
            <form className="flex flex-col gap-4 max-w-md">
              <input type="text" placeholder="نام" className="w-full bg-[var(--surface-muted)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors" />
              <input type="text" placeholder="نام خانوادگی" className="w-full bg-[var(--surface-muted)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors" />
              <input type="email" placeholder="ایمیل" className="w-full bg-[var(--surface-muted)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors" />
              <button type="submit" className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-2.5 rounded-xl transition-colors">ذخیره تغییرات</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
