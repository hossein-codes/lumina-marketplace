'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Boxes, LayoutDashboard, Package, Users } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';

const nav = [
  { href: '/admin', label: 'داشبورد', Icon: LayoutDashboard },
  { href: '/admin/orders', label: 'سفارش‌ها', Icon: Package },
  { href: '/admin/users', label: 'کاربران', Icon: Users },
  { href: '/admin/products', label: 'محصولات', Icon: Boxes },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (status === 'idle' || status === 'loading') return;
    if (!user) router.replace('/login?redirect=/admin');
    else if (user.role !== 'ADMIN') router.replace('/');
  }, [user, status, router]);

  if (!user || user.role !== 'ADMIN') {
    return <div className="container-page py-10 text-center text-sm text-[var(--text-muted)]">در حال بررسی دسترسی...</div>;
  }

  return (
    <div className="container-page py-6">
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5">
        <aside className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-3 h-fit md:sticky md:top-24">
          <div className="text-xs text-[var(--text-muted)] px-2 py-2 font-bold">پنل مدیریت</div>
          {nav.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
                  active
                    ? 'bg-[var(--color-brand-50)] text-[var(--color-brand-700)] font-bold'
                    : 'hover:bg-[var(--surface-muted)] text-[var(--text-secondary)]'
                }`}
              >
                <n.Icon size={16} /> {n.label}
              </Link>
            );
          })}
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}
