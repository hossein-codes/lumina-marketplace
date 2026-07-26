import Link from 'next/link';
import { Home, Store, ShoppingCart, Heart, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: 'خانه', icon: Home },
  { href: '/shop', label: 'فروشگاه', icon: Store },
  { href: '/cart', label: 'سبد', icon: ShoppingCart },
  { href: '/wishlist', label: 'علاقه‌مندی', icon: Heart },
  { href: '/profile', label: 'من', icon: User },
];

export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--surface-card)]/95 backdrop-blur-lg border-t border-[var(--border-subtle)]">
      <div className="flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const active = pathname === tab.href || (tab.href !== '/' && pathname?.startsWith(tab.href));
          return (
            <Link key={tab.href} href={tab.href} className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${active ? 'text-brand-600' : 'text-ink-400 hover:text-ink-600'}`}>
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
