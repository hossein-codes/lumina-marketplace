'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Grid, Heart, Home, ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cartStore';
import { cn } from '@/lib/utils/cn';

const items = [
  { href: '/', label: 'خانه', Icon: Home },
  { href: '/shop', label: 'دسته‌ها', Icon: Grid },
  { href: '/cart', label: 'سبد', Icon: ShoppingCart, badge: true },
  { href: '/wishlist', label: 'علاقه‌مندی', Icon: Heart },
  { href: '/profile', label: 'حساب', Icon: User },
];

export function MobileTabBar() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount());
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--surface-card)] border-t border-[var(--border-subtle)] pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-5 h-16">
        {items.map(({ href, label, Icon, badge }) => {
          const active =
            href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'h-full flex flex-col items-center justify-center gap-1 text-[11px] transition-colors relative',
                  active ? 'text-[var(--color-brand-500)]' : 'text-[var(--text-muted)]'
                )}
              >
                <Icon size={22} />
                <span>{label}</span>
                {badge && itemCount > 0 && (
                  <span className="absolute top-1.5 right-6 text-[10px] bg-[var(--color-brand-500)] text-white rounded-full min-w-4 h-4 grid place-items-center px-1 font-num">
                    {itemCount}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
