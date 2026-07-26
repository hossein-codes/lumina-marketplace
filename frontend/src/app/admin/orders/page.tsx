import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AdminOrdersPage() {
  return (
    <main className="container-page py-8">
      <h1 className="text-2xl font-black text-[var(--text-primary)] mb-6">سفارش‌ها</h1>
      <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface-muted)] text-[var(--text-secondary)]">
            <tr>
              <th className="text-right px-4 py-3">شماره</th>
              <th className="text-right px-4 py-3">کاربر</th>
              <th className="text-right px-4 py-3">وضعیت</th>
              <th className="text-right px-4 py-3">مجموع</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            <tr><td className="px-4 py-3">#001</td><td className="px-4 py-3">کاربر نمونه</td><td className="px-4 py-3"><span className="bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full text-xs font-medium">در انتظار</span></td><td className="px-4 py-3">۴۵۰,۰۰۰</td></tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
