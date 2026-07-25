import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  MapPin,
  Wallet,
  LogOut,
  Settings,
  Plus,
  ShieldAlert,
  Briefcase,
  Trash2,
  CheckCircle,
  Truck,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import { MOCK_ORDERS } from '../data/mockDatabase';
import { formatPrice } from '../utils/format';
import { Button, Input, Modal } from '../components/ui/DesignComponents';

export const Profile: React.FC = () => {
  const { user, isLoggedIn, logout, addAddress, removeAddress, rechargeWallet } = useAuthStore();
  const wishlistItems = useWishlistStore((s) => s.items);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'orders'; // orders, wishlist, addresses, wallet, settings

  // Address modal
  const [isAddrModalOpen, setAddrModalOpen] = useState(false);
  const [newAddr, setNewAddr] = useState({
    title: 'دفتر کار / منزل',
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    city: 'تهران',
    address: '',
    postalCode: '',
    isDefault: false
  });

  if (!isLoggedIn() || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-8xl">👤</div>
        <h2 className="text-xl font-bold">برای مشاهده داشبورد ابتدا وارد شوید</h2>
        <Link to="/login">
          <Button>ورود به حساب کاربری</Button>
        </Link>
      </div>
    );
  }

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.phone || !newAddr.address) return;
    addAddress(newAddr);
    setAddrModalOpen(false);
  };

  const navItems = [
    { id: 'orders', label: 'سفارش‌های من', icon: <Package size={18} />, badge: MOCK_ORDERS.length },
    { id: 'wishlist', label: 'علاقه‌مندی‌ها', icon: <Heart size={18} />, badge: wishlistItems.length },
    { id: 'addresses', label: 'آدرس‌های من', icon: <MapPin size={18} />, badge: user.addresses.length },
    { id: 'wallet', label: 'کیف پول و تراکنش‌ها', icon: <Wallet size={18} /> },
    { id: 'settings', label: 'تنظیمات حساب', icon: <Settings size={18} /> }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner Profile Summary */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 rounded-3xl p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.fullName}
              className="w-20 h-20 rounded-3xl border-4 border-white/20 object-cover shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black">{user.fullName}</h1>
                <span className="bg-white/20 backdrop-blur-md text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {user.role === 'admin'
                    ? '🛡️ ادمین ارشد'
                    : user.role === 'seller'
                    ? '💼 فروشنده کالا'
                    : '👤 کاربر ویژه'}
                </span>
              </div>
              <p className="text-xs text-white/70 mt-1">{user.email} — {user.phone}</p>
            </div>
          </div>

          {/* Wallet summary button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 text-right">
              <p className="text-[11px] text-white/70">موجودی کیف پول شاپینو:</p>
              <p className="text-lg font-black text-amber-300 font-mono">
                {formatPrice(user.walletBalance)}
              </p>
            </div>
            {user.role === 'admin' && (
              <Link to="/admin">
                <Button variant="accent" size="sm">
                  <ShieldAlert size={16} /> ورود به پنل مدیریت
                </Button>
              </Link>
            )}
            {user.role === 'seller' && (
              <Link to="/seller">
                <Button variant="accent" size="sm">
                  <Briefcase size={16} /> ورود به پنل فروشنده
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SIDEBAR NAV (4 columns) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm space-y-1">
            {navItems.map((item) => {
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSearchParams({ tab: item.id })}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-bold transition ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isSelected ? 'text-white' : 'text-purple-600'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
              >
                <LogOut size={18} />
                <span>خروج از حساب کاربری</span>
              </button>
            </div>
          </div>
        </div>

        {/* MAIN DASHBOARD CONTENT (8 columns) */}
        <div className="lg:col-span-8">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Package className="text-purple-600" /> تاریخچه سفارش‌های شما
                </h2>
                <span className="text-xs text-gray-500">{MOCK_ORDERS.length} سفارش ثبت شده</span>
              </div>

              <div className="space-y-6">
                {MOCK_ORDERS.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-4"
                  >
                    {/* Order header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-black text-base text-gray-900 dark:text-white">
                          {ord.id}
                        </span>
                        <span className="text-xs text-gray-400">{ord.date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                          }`}
                        >
                          {ord.statusLabel}
                        </span>
                        <span className="font-mono font-black text-sm text-purple-600">
                          {formatPrice(ord.totalAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Status Tracking Steps Timeline */}
                    <div className="py-2">
                      <p className="text-xs font-bold text-gray-500 mb-3">وضعیت پردازش سفارش:</p>
                      <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                        <div className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 p-2 rounded-xl font-bold">
                          ✓ ثبت سفارش
                        </div>
                        <div className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 p-2 rounded-xl font-bold">
                          ✓ آماده‌سازی انبار
                        </div>
                        <div
                          className={`p-2 rounded-xl font-bold ${
                            ord.status === 'shipped' || ord.status === 'delivered'
                              ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                          }`}
                        >
                          {ord.status === 'shipped' || ord.status === 'delivered' ? '✓ ارسال پیک' : 'ارسال پیک'}
                        </div>
                        <div
                          className={`p-2 rounded-xl font-bold ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                          }`}
                        >
                          {ord.status === 'delivered' ? '✓ تحویل شد' : 'تحویل به مشتری'}
                        </div>
                      </div>
                    </div>

                    {/* Order items list */}
                    <div className="space-y-3 pt-2">
                      {ord.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-2xl"
                        >
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-14 h-14 rounded-xl object-contain bg-white p-1"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs text-gray-900 dark:text-white truncate">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-1">
                              فروشنده: {item.sellerName} | {item.variant}
                            </p>
                          </div>
                          <span className="font-mono font-bold text-xs">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Heart className="text-red-500" /> کالاهای مورد علاقه شما ({wishlistItems.length})
              </h2>
              {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistItems.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-4 flex gap-4 items-center"
                    >
                      <img
                        src={prod.thumbnail}
                        alt={prod.title}
                        className="w-20 h-20 rounded-2xl object-contain bg-gray-50 p-2"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${prod.id}`}
                          className="font-bold text-xs text-gray-900 dark:text-white hover:text-purple-600 truncate block"
                        >
                          {prod.title}
                        </Link>
                        <p className="text-sm font-black text-purple-600 mt-2 font-mono">
                          {formatPrice(prod.price)}
                        </p>
                        <Link
                          to={`/product/${prod.id}`}
                          className="inline-block mt-2 text-xs font-bold text-purple-600 hover:underline"
                        >
                          مشاهده و خرید کالا ←
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center border border-gray-200 dark:border-gray-800">
                  <p className="text-sm text-gray-500">لیست علاقه‌مندی‌های شما خالی است.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin className="text-purple-600" /> آدرس‌های ثبت‌شده شما
                </h2>
                <Button
                  size="sm"
                  onClick={() => setAddrModalOpen(true)}
                  icon={<Plus size={15} />}
                >
                  افزودن آدرس جدید
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-5 space-y-3 shadow-sm relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {addr.title}
                      </span>
                      <button
                        onClick={() => removeAddress(addr.id)}
                        className="text-gray-400 hover:text-red-500 transition p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {addr.address}
                    </p>
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-400 flex justify-between">
                      <span>گیرنده: {addr.fullName}</span>
                      <span>موبایل: {addr.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: WALLET */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Wallet className="text-purple-600" /> کیف پول شاپینو
              </h2>

              <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-xs text-white/80">موجودی فعلی کیف پول شما:</p>
                  <p className="text-4xl font-black font-mono mt-2">
                    {formatPrice(user.walletBalance)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      rechargeWallet(5000000);
                      alert('مبلغ ۵,۰۰۰,۰۰۰ تومان به کیف پول شما اضافه شد!');
                    }}
                    className="px-5 py-3 bg-white text-gray-900 font-bold text-xs rounded-2xl shadow-lg hover:bg-gray-100 transition"
                  >
                    + شارژ ۵,۰۰۰,۰۰۰ تومان
                  </button>
                  <button
                    onClick={() => {
                      rechargeWallet(20000000);
                      alert('مبلغ ۲۰,۰۰۰,۰۰۰ تومان به کیف پول شما اضافه شد!');
                    }}
                    className="px-5 py-3 bg-white/20 backdrop-blur-md text-white font-bold text-xs rounded-2xl border border-white/30 hover:bg-white/30 transition"
                  >
                    + شارژ ۲۰ میلیون
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  تاریخچه تراکنش‌های کیف پول
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">+ واریز هدیه خوش‌آمدگویی</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-600">
                      {formatPrice(10000000)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="text-purple-600" /> تنظیمات حساب کاربری
              </h2>

              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="نام و نام خانوادگی" defaultValue={user.fullName} />
                  <Input label="شماره موبایل" defaultValue={user.phone} />
                  <Input label="آدرس ایمیل" defaultValue={user.email} />
                  <Input label="رمز عبور فعلی" type="password" placeholder="••••••••" />
                </div>
                <Button className="mt-2">ذخیره تغییرات حساب</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ADD ADDRESS MODAL */}
      <Modal
        isOpen={isAddrModalOpen}
        onClose={() => setAddrModalOpen(false)}
        title="افزودن آدرس جدید"
      >
        <form onSubmit={handleAddAddress} className="space-y-4">
          <Input
            label="عنوان آدرس"
            value={newAddr.title}
            onChange={(e) => setNewAddr({ ...newAddr, title: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="نام گیرنده"
              value={newAddr.fullName}
              onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
              required
            />
            <Input
              label="شماره تماس"
              value={newAddr.phone}
              onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
              required
            />
          </div>
          <Input
            label="آدرس دقیق و کامل پستی"
            value={newAddr.address}
            onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
            required
          />
          <Input
            label="کد پستی ۱۰ رقمی"
            value={newAddr.postalCode}
            onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
          />
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setAddrModalOpen(false)}
            >
              انصراف
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              ثبت آدرس
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
