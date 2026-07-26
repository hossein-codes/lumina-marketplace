import Link from 'next/link';
import { Search, ShoppingCart, Heart, User, Menu, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Header() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/shop?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--surface-card)]/90 backdrop-blur-md border-b border-[var(--border-subtle)]">
      <div className="container-page h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl font-black text-brand-500 tracking-tighter">LUMINA</span>
          <span className="hidden sm:block text-xs text-[var(--text-muted)] font-medium">فروشگاه حرفه‌ای</span>
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در محصولات..."
            className="w-full bg-[var(--surface-muted)] border-none rounded-xl py-2.5 pr-4 pl-10 text-sm focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        </form>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/wishlist" className="p-2 hover:bg-[var(--surface-muted)] rounded-full relative transition-colors" aria-label="علاقه‌مندی‌ها">
            <Heart className="w-5 h-5 text-ink-600" />
          </Link>
          <Link href="/cart" className="p-2 hover:bg-[var(--surface-muted)] rounded-full relative transition-colors" aria-label="سبد خرید">
            <ShoppingCart className="w-5 h-5 text-ink-600" />
          </Link>
          <Link href="/profile" className="p-2 hover:bg-[var(--surface-muted)] rounded-full transition-colors" aria-label="حساب کاربری">
            <User className="w-5 h-5 text-ink-600" />
          </Link>
          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 hover:bg-[var(--surface-muted)] rounded-full" aria-label="منو">
            <Menu className="w-5 h-5 text-ink-600" />
          </button>
        </div>
      </div>

      {mobileMenu && (
        <div className="md:hidden border-t border-[var(--border-subtle)] bg-[var(--surface-card)] px-4 py-3 flex flex-col gap-2">
          <Link href="/shop" className="py-2 text-sm font-medium text-[var(--text-primary)] hover:text-brand-600">فروشگاه</Link>
          <Link href="/orders" className="py-2 text-sm font-medium text-[var(--text-primary)] hover:text-brand-600">سفارش‌ها</Link>
          <Link href="/profile" className="py-2 text-sm font-medium text-[var(--text-primary)] hover:text-brand-600">حساب کاربری</Link>
        </div>
      )}
    </header>
  );
}
