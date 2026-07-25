import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Plus,
  TrendingUp,
  Package,
  DollarSign,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { MOCK_PRODUCTS, CATEGORIES } from '../data/mockDatabase';
import { formatPrice } from '../utils/format';
import { Button, Input, Modal, Badge } from '../components/ui/DesignComponents';

export const SellerDashboard: React.FC = () => {
  const { user, registerSeller } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'register'>('overview');

  // New product form modal
  const [isNewProdModalOpen, setNewProdModalOpen] = useState(false);
  const [prodForm, setProdForm] = useState({
    title: '',
    brand: '',
    category: 'digital',
    price: 15000000,
    stock: 10,
    description: ''
  });

  // Register seller form
  const [shopNameInput, setShopNameInput] = useState('');
  const [nationalIdInput, setNationalIdInput] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  const isSeller = user?.role === 'seller' || user?.role === 'admin';

  const handleRegisterSeller = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopNameInput || !nationalIdInput) return;
    registerSeller(shopNameInput, nationalIdInput);
    setRegSuccess(true);
    setTimeout(() => {
      setActiveTab('overview');
    }, 1500);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.title || !prodForm.brand) return;
    alert(`کالای «${prodForm.title}» با موفقیت در فروشگاه شما ثبت شد و در لیست کالاها قرار گرفت.`);
    setNewProdModalOpen(false);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">برای ورود به پنل فروشندگان ابتدا وارد شوید</h2>
        <Link to="/login"><Button>ورود به حساب</Button></Link>
      </div>
    );
  }

  // If user is not yet registered as a seller, show Registration Landing
  if (!isSeller) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        {/* Landing Hero */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-gray-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl space-y-4 text-center">
          <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold">
            💼 سیستم همکاری در فروش شاپینو (Seller Center)
          </span>
          <h1 className="text-3xl md:text-5xl font-black">
            فروشنده کالا در بزرگترین بازار آنلاین ایران شوید
          </h1>
          <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            محصولات خود را بدون هزینه اولیه در معرض دید میلیون‌ها خریدار قرار دهید. تسویه‌حساب خودکار، پشتیبانی تخصصی و آمار فروش پیشرفته در اختیار شماست.
          </p>
        </div>

        {/* Registration Form Box */}
        <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              فرم ثبت‌نام فروشنده جدید
            </h2>
            <p className="text-xs text-gray-500">
              اطلاعات فروشگاه خود را وارد کنید تا حساب شما بلافاصله فعال شود
            </p>
          </div>

          {regSuccess ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-center space-y-2 text-emerald-800 dark:text-emerald-300">
              <CheckCircle size={40} className="mx-auto text-emerald-600" />
              <p className="font-black text-lg">تبریک! حساب فروشندگی شما فعال شد.</p>
              <p className="text-xs">در حال انتقال به داشبورد فروشندگان...</p>
            </div>
          ) : (
            <form onSubmit={handleRegisterSeller} className="space-y-4">
              <Input
                label="نام فروشگاه / برند شما"
                value={shopNameInput}
                onChange={(e) => setShopNameInput(e.target.value)}
                placeholder="مثال: بازرگانی دیجیتال راد"
                required
              />
              <Input
                label="کد ملی / شناسه ملی حقوقی"
                value={nationalIdInput}
                onChange={(e) => setNationalIdInput(e.target.value)}
                placeholder="0071234567"
                required
              />
              <div className="p-3.5 bg-purple-50 dark:bg-purple-950/40 rounded-2xl text-xs text-purple-900 dark:text-purple-300 space-y-1">
                <p className="font-bold">✨ مزایای عضویت:</p>
                <p>• کارمزد رقابتی و پایین نسبت به سایر پلتفرم‌ها</p>
                <p>• تسویه‌حساب روزانه خودکار با شبا</p>
                <p>• امکان تعریف قیمت و تخفیف دلخواه برای کالاها</p>
              </div>
              <Button type="submit" className="w-full py-4 text-sm mt-2">
                فعال‌سازی فوری پنل فروشنده
              </Button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // SELLER PORTAL DASHBOARD (When registered as Seller or Admin)
  const sellerInfo = user.sellerInfo || {
    shopName: 'فروشگاه شاپینو',
    nationalId: '1234567890',
    bankAccount: 'IR000000000000001234567890',
    verified: true,
    rating: 4.9,
    salesCount: 1420
  };

  const sellerProducts = MOCK_PRODUCTS.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-gray-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
            <Briefcase size={28} className="text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black">{sellerInfo.shopName}</h1>
              <Badge variant="success">✓ فروشنده تایید شده</Badge>
            </div>
            <p className="text-xs text-white/70 mt-1">
              امتیاز فروشگاه: <span className="font-bold text-amber-300">★ {sellerInfo.rating}</span> | تعداد فروش موفق: {sellerInfo.salesCount}+ کالا
            </p>
          </div>
        </div>

        <Button
          onClick={() => setNewProdModalOpen(true)}
          variant="accent"
          icon={<Plus size={16} />}
        >
          افزودن محصول جدید به مارکت‌پلیس
        </Button>
      </div>

      {/* Tabs bar */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 gap-2">
        {[
          { id: 'overview', label: '📊 آمار و درآمد کل' },
          { id: 'products', label: `📦 مدیریت کالاهای من (${sellerProducts.length})` },
          { id: 'orders', label: '🛒 سفارش‌های در انتظار ارسال (۲)' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-5 py-3 rounded-t-2xl font-bold text-xs transition border-b-2 -mb-px ${
              activeTab === t.id
                ? 'border-purple-600 text-purple-600 bg-white dark:bg-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & STATS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-bold">درآمد کل این ماه</span>
                <DollarSign size={20} className="text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-white font-mono">
                {formatPrice(348500000)}
              </p>
              <p className="text-[11px] text-emerald-600 font-bold">
                + ۱۸.۴٪ رشد نسبت به ماه گذشته
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-bold">تعداد کالاهای فعال</span>
                <Package size={20} className="text-purple-600" />
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                {sellerProducts.length} محصول
              </p>
              <p className="text-[11px] text-gray-500">تمامی محصولات تایید شده و فعال هستند</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-bold">سفارشات نیازمند ارسال</span>
                <TrendingUp size={20} className="text-blue-500" />
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                ۲ سفارش
              </p>
              <p className="text-[11px] text-blue-600 font-bold">امروز تا ساعت ۱۷:۰۰ ارسال شود</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-bold">امتیاز رضایت خریداران</span>
                <Star size={20} className="text-amber-500" />
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                {sellerInfo.rating} / ۵.۰
              </p>
              <p className="text-[11px] text-gray-500">از مجموع ۲۴۰ نظر خریدار</p>
            </div>
          </div>

          {/* Quick tips & seller support */}
          <div className="bg-purple-50 dark:bg-purple-950/40 rounded-3xl p-6 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 space-y-2">
            <p className="font-black text-sm">💡 نکات طلایی افزایش فروش در شاپینو:</p>
            <p>
              ۱. قیمت رقابتی و شرکت در کمپین‌های "شگفت‌انگیز" می‌تواند فروش روزانه شما را تا ۵ برابر افزایش دهد.
            </p>
            <p>
              ۲. ارسال سریع سفارشات (در کمتر از ۲۴ ساعت) باعث دریافت نشان "ارسال فوری" روی محصولات شما می‌شود.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGER */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              لیست کالاها و موجودی انبار شما
            </h3>
            <Button
              size="sm"
              onClick={() => setNewProdModalOpen(true)}
              icon={<Plus size={15} />}
            >
              افزودن محصول جدید
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {sellerProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-14 h-14 rounded-xl object-contain bg-gray-50 p-1 border"
                    />
                    <div>
                      <Link
                        to={`/product/${p.id}`}
                        className="font-bold text-xs text-gray-900 dark:text-white hover:text-purple-600 line-clamp-1"
                      >
                        {p.title}
                      </Link>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        برند: {p.brand} | دسته: {p.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end text-xs">
                    <div>
                      <p className="text-gray-400 text-[11px]">موجودی انبار</p>
                      <p className="font-bold text-gray-900 dark:text-white">{p.stock} عدد</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[11px]">قیمت فروش</p>
                      <p className="font-mono font-bold text-purple-600">{formatPrice(p.price)}</p>
                    </div>
                    <Badge variant="success">فعال</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS TO SHIP */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
            سفارش‌های در انتظار بسته‌بندی و ارسال
          </h3>
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-amber-900 dark:text-amber-300">
                  سفارش #SHP-984210 — امیرحسین راد
                </p>
                <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">
                  ۱ عدد آیفون ۱۶ پرو مکس (تیتانیوم صحرایی)
                </p>
              </div>
              <Button size="sm" variant="primary">
                تایید و چاپ برچسب ارسال
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      <Modal
        isOpen={isNewProdModalOpen}
        onClose={() => setNewProdModalOpen(false)}
        title="افزودن محصول جدید به مارکت‌پلیس"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <Input
            label="عنوان فارسی محصول"
            value={prodForm.title}
            onChange={(e) => setProdForm({ ...prodForm, title: e.target.value })}
            placeholder="مثال: ساعت هوشمند سامسونگ مدل Galaxy Watch 6..."
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="برند کالا"
              value={prodForm.brand}
              onChange={(e) => setProdForm({ ...prodForm, brand: e.target.value })}
              placeholder="مثال: سامسونگ (Samsung)"
              required
            />
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                دسته‌بندی
              </label>
              <select
                value={prodForm.category}
                onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="قیمت فروش (تومان)"
              type="number"
              value={prodForm.price}
              onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
              required
            />
            <Input
              label="موجودی انبار (عدد)"
              type="number"
              value={prodForm.stock}
              onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              توضیحات و مشخصات کالا
            </label>
            <textarea
              value={prodForm.description}
              onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 text-xs outline-none"
              rows={3}
              placeholder="توضیحات کامل درباره قابلیت‌ها، ضمانت و متعلقات کالا..."
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setNewProdModalOpen(false)}
            >
              انصراف
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              ثبت محصول در مارکت‌پلیس
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SellerDashboard;
