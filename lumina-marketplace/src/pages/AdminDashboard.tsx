import React, { useState } from 'react';
import {
  ShieldAlert,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Tag,
  Briefcase,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { MOCK_PRODUCTS, CATEGORIES, MOCK_ORDERS, DISCOUNT_COUPONS } from '../data/mockDatabase';
import { formatPrice } from '../utils/format';
import { Button, Badge } from '../components/ui/DesignComponents';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'stats' | 'products' | 'orders' | 'users' | 'coupons'
  >('stats');

  const [productsList, setProductsList] = useState(MOCK_PRODUCTS);

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('آیا از حذف این کالا از پایگاه داده اطمینان دارید؟')) {
      setProductsList(productsList.filter((p) => p.id !== id));
    }
  };

  const fakeUsers = [
    { id: 'u-1', name: 'امیرحسین راد', email: 'amir.rad@shopino.ir', role: 'ادمین ارشد', status: 'فعال' },
    { id: 'u-2', name: 'سارا احمدی', email: 'sara@gmail.com', role: 'خریدار', status: 'فعال' },
    { id: 'u-3', name: 'بازرگانی موبایل شاپینو', email: 'seller1@shopino.ir', role: 'فروشنده', status: 'تایید شده' },
    { id: 'u-4', name: 'گالری عطر لیلیوم', email: 'lilium@shopino.ir', role: 'فروشنده', status: 'تایید شده' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Admin Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-gray-900 to-indigo-950 rounded-3xl p-6 md:p-8 text-white shadow-2xl border border-purple-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/30 border border-purple-500 flex items-center justify-center">
            <ShieldAlert size={28} className="text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black">داشبورد مدیریت کل (Enterprise Admin)</h1>
              <Badge variant="accent">SECRET / ROOT</Badge>
            </div>
            <p className="text-xs text-white/70 mt-1">
              نظارت بر کلیه تراکنش‌ها، کاربران، فروشندگان مارکت‌پلیس و کالاها
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
            سیستم پایدار | وضعیت: NORMAL
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 gap-2 overflow-x-auto">
        {[
          { id: 'stats', label: '📊 آمار زنده و درآمد کل' },
          { id: 'products', label: `📦 مدیریت کالاها (${productsList.length})` },
          { id: 'orders', label: `🛒 سفارشات سراسری (${MOCK_ORDERS.length})` },
          { id: 'users', label: `👥 کاربران و فروشندگان (${fakeUsers.length})` },
          { id: 'coupons', label: '🏷️ کدهای تخفیف و کمپین‌ها' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-5 py-3 rounded-t-2xl font-bold text-xs whitespace-nowrap transition border-b-2 -mb-px ${
              activeTab === t.id
                ? 'border-purple-600 text-purple-600 bg-white dark:bg-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: LIVE ENTERPRISE STATS */}
      {activeTab === 'stats' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-bold">فروش کل (امروز)</span>
                <DollarSign size={20} className="text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-white font-mono">
                {formatPrice(485000000)}
              </p>
              <p className="text-[11px] text-emerald-600 font-bold">+ ۲۴٪ نسبت به دیروز</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-bold">کل کاربران ثبت‌نامی</span>
                <Users size={20} className="text-purple-600" />
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">۱۲۴,۸۹۰ نفر</p>
              <p className="text-[11px] text-purple-600 font-bold">+ ۴۵۰ کاربر جدید در هفته اخیر</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-bold">سفارش‌های فعال در شبکه</span>
                <Package size={20} className="text-blue-500" />
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">۱,۲۸۰ سفارش</p>
              <p className="text-[11px] text-gray-500">۹۸٪ ارسال بدون تاخیر</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-bold">فروشندگان تایید شده</span>
                <Briefcase size={20} className="text-amber-500" />
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">۳۴۰ فروشگاه</p>
              <p className="text-[11px] text-emerald-600 font-bold">تمام حساب‌ها تایید هویت شده</p>
            </div>
          </div>

          {/* Quick Categories Overview table */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              وضعیت دسته‌بندی‌های ۱۰ گانه مارکت‌پلیس
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {CATEGORIES.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-center space-y-1"
                >
                  <p className="font-bold text-xs text-gray-800 dark:text-gray-200">{c.name}</p>
                  <p className="text-[11px] text-gray-400">{c.subCategories.length} زیردسته</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {productsList.map((p) => (
                <div
                  key={p.id}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-12 h-12 rounded-xl object-contain bg-gray-50 p-1 border"
                    />
                    <div>
                      <p className="font-bold text-xs text-gray-900 dark:text-white line-clamp-1">
                        {p.title}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        برند: {p.brand} | امتیاز: ★ {p.rating} | موجودی: {p.stock}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="font-mono font-bold text-purple-600">
                      {formatPrice(p.price)}
                    </span>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="text-red-500 hover:underline font-bold"
                    >
                      حذف از سایت
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {MOCK_ORDERS.map((ord) => (
            <div
              key={ord.id}
              className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-base text-gray-900 dark:text-white">
                    {ord.id}
                  </span>
                  <Badge variant="primary">{ord.statusLabel}</Badge>
                </div>
                <span className="font-mono font-bold text-sm text-purple-600">
                  {formatPrice(ord.totalAmount)}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                گیرنده: {ord.shippingAddress.fullName} | شهر: {ord.shippingAddress.city} | تلفن:{' '}
                {ord.shippingAddress.phone}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: USERS */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {fakeUsers.map((u) => (
              <div key={u.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{u.name}</p>
                  <p className="text-gray-400 mt-0.5">{u.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{u.role}</Badge>
                  <span className="text-emerald-500 font-bold">{u.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: COUPONS */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(DISCOUNT_COUPONS).map(([code, info]) => (
            <div
              key={code}
              className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-base text-purple-600">{code}</span>
                <Badge variant="accent">{info.percent}٪ تخفیف</Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">{info.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
