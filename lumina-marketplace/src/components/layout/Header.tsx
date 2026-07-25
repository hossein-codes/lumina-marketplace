import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  Search,
  Heart,
  ShoppingBag,
  User,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Wallet,
  Package,
  Settings,
  ShieldAlert,
  Briefcase,
  Bell
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useThemeStore } from '../../store/themeStore';
import { useSearchStore } from '../../store/searchStore';
import { useNotificationStore } from '../../store/notificationStore';
import { MegaMenu } from './MegaMenu';
import { SearchOverlay } from './SearchOverlay';
import { MiniCartDrawer } from './MiniCartDrawer';
import { formatPrice } from '../../utils/format';

const Header: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuthStore();
  const cartCount = useCartStore((s) => s.count());
  const setDrawerOpen = useCartStore((s) => s.setDrawerOpen);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { mode, toggleTheme } = useThemeStore();
  const { setOverlayOpen } = useSearchStore();
  const { unreadCount } = useNotificationStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
        {/* Layer 1: Top Notification Banner */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white text-xs py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-black font-black px-2 py-0.5 rounded-full text-[10px] animate-pulse">
                ویژه
              </span>
              <span>🚚 ارسال رایگان سفارش‌های بالای ۵,۰۰۰,۰۰۰ تومان سراسر کشور | ضمانت ۷ روز بازگشت کالا</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-white/90">
              <span> پشتیبانی ۲۴ ساعته: ۰۲۱-۹۱۰۰۱۲۳۴</span>
              <span>|</span>
              <Link to="/blog" className="hover:underline">وبلاگ و راهنمای خرید</Link>
            </div>
          </div>
        </div>

        {/* Layer 2: Main Header Bar */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Right: Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform">
              <Store size={22} className="text-white" />
            </div>
            <div>
              <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                شاپینو
              </span>
              <span className="block text-[10px] text-purple-600 dark:text-purple-400 font-bold -mt-1">
                MARKETPLACE
              </span>
            </div>
          </Link>

          {/* Center: Full Search Box (Click triggers Search Overlay) */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div
              onClick={() => setOverlayOpen(true)}
              className="w-full flex items-center justify-between bg-gray-100 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700/80 rounded-2xl px-4 py-2.5 cursor-pointer transition-all duration-200 group"
            >
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <Search size={19} className="text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm">جستجو در محصولات، برندها و دسته‌بندی‌ها...</span>
              </div>
              <span className="text-[11px] bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-2 py-0.5 rounded-lg border border-gray-200 dark:border-gray-600 font-mono">
                Ctrl+K
              </span>
            </div>
          </div>

          {/* Left: Actions (Theme, Wishlist, Cart, Account) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title="تغییر تم روشنایی"
              className="p-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
            >
              {mode === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
            </button>

            {/* Notification Icon */}
            <div className="relative">
              <button
                onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                className="p-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition relative"
              >
                <Bell size={20} />
                {unreadCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {unreadCount()}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {notifMenuOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-4 z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="font-bold text-sm text-gray-900 dark:text-white">اعلان‌های اخیر</span>
                    <button
                      onClick={() => setNotifMenuOpen(false)}
                      className="text-xs text-purple-600 hover:underline"
                    >
                      بستن
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-xs text-purple-900 dark:text-purple-200">
                      <p className="font-bold">🎉 کد تخفیف DIGI50 فعال است</p>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">تا ۵۰٪ تخفیف اولین سفارش شما در شاپینو</p>
                    </div>
                    <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300">
                      <p className="font-bold">📦 ارسال سریع سفارش‌ها</p>
                      <p className="text-gray-500 mt-1">امکان ارسال ۲ ساعته برای خریدهای تهران فراهم شد.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition relative"
              title="علاقه‌مندی‌ها"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart with Mini Cart Drawer Trigger */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 transition"
            >
              <div className="relative">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-purple-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold text-xs">سبد خرید</span>
            </button>

            {/* User Account Button & Dropdown */}
            {isLoggedIn() ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-400 transition"
                >
                  <img
                    src={user?.avatar}
                    alt={user?.fullName}
                    className="w-7 h-7 rounded-full object-cover border border-purple-200"
                  />
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 hidden md:block max-w-[100px] truncate">
                    {user?.fullName}
                  </span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {/* Account Mega Dropdown */}
                {userMenuOpen && (
                  <div
                    className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 p-2 z-50 animate-scaleUp"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="p-3 border-b border-gray-100 dark:border-gray-800 mb-1">
                      <p className="font-bold text-sm text-gray-900 dark:text-white">{user?.fullName}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                      <div className="mt-2 flex items-center justify-between bg-purple-50 dark:bg-purple-950/40 rounded-xl px-3 py-1.5 text-xs text-purple-700 dark:text-purple-300">
                        <span className="flex items-center gap-1 font-bold">
                          <Wallet size={14} /> موجودی کیف پول:
                        </span>
                        <span className="font-black">{formatPrice(user?.walletBalance || 0)}</span>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <Link
                        to="/account"
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold transition"
                      >
                        <User size={16} className="text-purple-600" /> حساب کاربری و سفارش‌ها
                      </Link>
                      <Link
                        to="/wishlist"
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold transition"
                      >
                        <Heart size={16} className="text-purple-600" /> لیست علاقه‌مندی‌ها
                      </Link>
                      <Link
                        to="/seller"
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold transition"
                      >
                        <Briefcase size={16} className="text-purple-600" /> پنل فروشندگان شاپینو
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-xs font-bold transition"
                        >
                          <ShieldAlert size={16} className="text-purple-600" /> پنل مدیریت کل (Admin)
                        </Link>
                      )}
                      <Link
                        to="/account?tab=settings"
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold transition"
                      >
                        <Settings size={16} className="text-purple-600" /> تنظیمات و امنیت
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold transition"
                      >
                        <LogOut size={16} /> خروج از حساب کاربری
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-2xl shadow-md transition"
              >
                <User size={16} />
                <span>ورود / ثبت‌نام</span>
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Layer 3: Navigation Menu (Sticky) with Mega Menu & Quick Links */}
        <nav
          className={`w-full bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-all duration-300 ${
            isScrolled ? 'sticky top-0 z-40 shadow-md backdrop-blur-md bg-white/95 dark:bg-gray-900/95' : ''
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            {/* Mega Menu Trigger */}
            <MegaMenu />

            {/* Quick Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
              {[
                { to: '/', label: 'صفحه اصلی' },
                { to: '/shop?cat=digital', label: 'کالای دیجیتال' },
                { to: '/shop?cat=fashion', label: 'مد و پوشاک' },
                { to: '/shop?cat=beauty', label: 'زیبایی و سلامت' },
                { to: '/shop?cat=home', label: 'خانه و آشپزخانه' },
                { to: '/shop?cat=tools', label: 'ابزار و تجهیزات' },
                { to: '/shop?cat=books', label: 'کتاب و هنر' },
                { to: '/blog', label: 'وبلاگ و راهنما' }
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-800 transition whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Left Special Links */}
            <div className="hidden sm:flex items-center gap-3 text-xs font-bold text-gray-600 dark:text-gray-300">
              <Link
                to="/seller"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition flex items-center gap-1"
              >
                <Briefcase size={14} className="text-purple-600" />
                فروشنده شوید!
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile Slide-down Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 space-y-3">
            <div
              onClick={() => {
                setOverlayOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 text-gray-500"
            >
              <Search size={18} className="text-purple-600" />
              <span className="text-sm">جستجوی محصول یا برند...</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200"
              >
                🏠 صفحه اصلی
              </Link>
              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200"
              >
                🛍️ فروشگاه کامل
              </Link>
              <Link
                to="/shop?cat=digital"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200"
              >
                📱 کالای دیجیتال
              </Link>
              <Link
                to="/shop?cat=fashion"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200"
              >
                👕 مد و پوشاک
              </Link>
              <Link
                to="/seller"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300"
              >
                💼 پنل فروشندگان
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300"
              >
                🛡️ پنل مدیریت
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Render Instant Search Overlay & Mini Cart Drawer */}
      <SearchOverlay />
      <MiniCartDrawer />
    </>
  );
};

export default Header;
export { Header };
