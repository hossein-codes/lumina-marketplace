'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Heart, LogIn, Menu, Search, ShoppingCart, User } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { useCartStore } from '@/lib/stores/cartStore';
import { useWishlistStore } from '@/lib/stores/wishlistStore';
import { CategoryMegaMenu } from './CategoryMegaMenu';
import { cn } from '@/lib/utils/cn';

export function Header() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const user = useAuthStore((s) => s.user);
  const itemCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/shop?search=${encodeURIComponent(term)}` : '/shop');
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 bg-[var(--surface-card)] transition-shadow',
        scrolled ? 'shadow-[var(--shadow-sm)]' : 'shadow-none border-b border-[var(--border-subtle)]'
      )}
    >
      {/* Top row */}
      <div className="container-page flex h-16 items-center gap-3 md:gap-6">
        <button
          className="md:hidden p-2 -ml-2"
          aria-label="menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <Menu size={22} />
        </button>

        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-lg bg-[var(--color-brand-500)] text-white grid place-items-center font-black">
            L
          </span>
          <span className="text-lg font-black text-[var(--text-primary)]">لومینا</span>
        </Link>

        <form onSubmit={submitSearch} className="flex-1 max-w-xl hidden md:block">
          <div className="flex items-center rounded-xl bg-[var(--surface-muted)] border border-transparent focus-within:border-[var(--color-brand-500)] transition-colors">
            <Search size={18} className="mx-3 text-[var(--text-muted)]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="جست‌وجو در هزاران کالا..."
              className="flex-1 h-11 bg-transparent outline-none text-sm placeholder:text-[var(--text-muted)]"
            />
            <button
              type="submit"
              className="px-4 h-11 text-sm font-medium text-[var(--color-brand-600)]"
            >
              جست‌وجو
            </button>
          </div>
        </form>

        <div className="flex items-center gap-1 md:gap-2 mr-auto">
          {user ? (
            <Link
              href="/profile"
              className="hidden md:inline-flex items-center gap-2 h-10 px-3 rounded-lg hover:bg-[var(--surface-muted)] text-sm"
            >
              <User size={18} />
              <span className="hidden lg:inline">{user.firstName}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden md:inline-flex items-center gap-2 h-10 px-3 rounded-lg hover:bg-[var(--surface-muted)] text-sm"
            >
              <LogIn size={18} />
              ورود / ثبت‌نام
            </Link>
          )}

          <Link
            href="/wishlist"
            className="relative p-2 rounded-lg hover:bg-[var(--surface-muted)]"
            aria-label="علاقه‌مندی‌ها"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 text-[10px] bg-[var(--color-brand-500)] text-white rounded-full min-w-4 h-4 grid place-items-center px-1 font-num">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            className="relative p-2 rounded-lg hover:bg-[var(--surface-muted)]"
            aria-label="سبد خرید"
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 text-[10px] bg-[var(--color-brand-500)] text-white rounded-full min-w-4 h-4 grid place-items-center px-1 font-num">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Category bar (desktop) */}
      <div className="hidden md:block border-t border-[var(--border-subtle)]">
        <div className="container-page">
          <CategoryMegaMenu />
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden container-page pb-3">
        <form onSubmit={submitSearch}>
          <div className="flex items-center rounded-xl bg-[var(--surface-muted)]">
            <Search size={18} className="mx-3 text-[var(--text-muted)]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="جست‌وجو..."
              className="flex-1 h-10 bg-transparent outline-none text-sm"
            />
          </div>
        </form>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border-subtle)] container-page py-3 space-y-1">
          <Link href="/" className="block py-2 text-sm" onClick={() => setMenuOpen(false)}>
            خانه
          </Link>
          <Link href="/shop" className="block py-2 text-sm" onClick={() => setMenuOpen(false)}>
            فروشگاه
          </Link>
          <Link href="/orders" className="block py-2 text-sm" onClick={() => setMenuOpen(false)}>
            سفارش‌ها
          </Link>
          <Link href="/profile" className="block py-2 text-sm" onClick={() => setMenuOpen(false)}>
            حساب کاربری
          </Link>
        </div>
      )}
    </header>
  );
}
