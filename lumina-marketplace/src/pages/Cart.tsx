import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Heart,
  Tag,
  ArrowLeft,
  ShieldCheck,
  Check,
  AlertCircle
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { DISCOUNT_COUPONS } from '../data/mockDatabase';
import { formatPrice } from '../utils/format';
import { Button } from '../components/ui/DesignComponents';

export const Cart: React.FC = () => {
  const {
    items,
    savedForLater,
    couponCode,
    couponDiscountPercent,
    updateQuantity,
    removeItem,
    saveForLater,
    moveToCart,
    removeSaved,
    applyCoupon,
    removeCoupon,
    clearCart,
    subTotal,
    discountAmount,
    shippingFee,
    finalTotal
  } = useCartStore();

  const [inputCode, setInputCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const trimmed = inputCode.trim().toUpperCase();
    const found = DISCOUNT_COUPONS[trimmed];
    if (found) {
      applyCoupon(trimmed, found.percent);
      setCouponSuccess(`✅ کد تخفیف «${trimmed}» با موفقیت اعمال شد (${found.percent}٪ تخفیف)`);
    } else {
      setCouponError('❌ کد تخفیف وارد شده معتبر نمی‌باشد');
    }
  };

  if (items.length === 0 && savedForLater.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="text-8xl">🛒</div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          سبد خرید شما در حال حاضر خالی است
        </h2>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          می‌توانید با بازدید از فروشگاه یا دسته‌بندی‌های کالا، محصولات مورد علاقه خود را به سبد خرید اضافه کنید.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-500/25 transition"
        >
          <ShoppingBag size={18} /> بازدید از فروشگاه شاپینو
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="text-purple-600" /> سبد خرید
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {items.length} کالا در سبد خرید | ارسال سریع سراسر کشور
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
          >
            <Trash2 size={15} /> پاک کردن کل سبد خرید
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* RIGHT AREA: CART ITEMS (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          {items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item) => {
                const price = item.selectedSeller?.price || item.product.price;
                const discPercent =
                  item.selectedSeller?.discountPercentage || item.product.discountPercentage || 0;
                const discPrice = Math.round(price * (1 - discPercent / 100));

                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row gap-5"
                  >
                    <Link
                      to={`/product/${item.product.id}`}
                      className="w-full sm:w-28 h-32 sm:h-28 flex-shrink-0 bg-gray-50 dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 p-2"
                    >
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        className="w-full h-full object-contain"
                      />
                    </Link>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <Link
                            to={`/product/${item.product.id}`}
                            className="font-bold text-base text-gray-900 dark:text-white hover:text-purple-600 transition line-clamp-2"
                          >
                            {item.product.title}
                          </Link>
                          <span className="text-lg font-black text-gray-900 dark:text-white font-mono whitespace-nowrap">
                            {formatPrice(discPrice * item.quantity)}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-xl">
                            فروشنده: {item.selectedSeller?.sellerName || 'شاپینو'}
                          </span>
                          {item.selectedColor && (
                            <span className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-xl">
                              رنگ: {item.selectedColor}
                            </span>
                          )}
                          {item.selectedSize && (
                            <span className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-xl">
                              سایز: {item.selectedSize}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4 mt-4">
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl px-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center font-bold hover:text-purple-600"
                          >
                            <Minus size={15} />
                          </button>
                          <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center font-bold hover:text-purple-600"
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-bold">
                          <button
                            onClick={() => saveForLater(item.id)}
                            className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                          >
                            <Heart size={15} /> ذخیره در لیست خرید بعد
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:underline flex items-center gap-1"
                          >
                            <Trash2 size={15} /> حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center border border-gray-200 dark:border-gray-800">
              <p className="font-bold text-gray-500">سبد خرید فعلی شما خالی است.</p>
            </div>
          )}

          {/* SAVED FOR LATER SECTION */}
          {savedForLater.length > 0 && (
            <div className="space-y-4 pt-6">
              <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Heart className="text-red-500" /> ذخیره‌شده برای خرید‌های بعدی ({savedForLater.length} کالا)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedForLater.map((saved) => (
                  <div
                    key={saved.id}
                    className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-4 flex gap-4 items-center"
                  >
                    <img
                      src={saved.product.thumbnail}
                      alt={saved.product.title}
                      className="w-16 h-16 rounded-2xl object-contain bg-gray-50 p-1"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-gray-900 dark:text-white truncate">
                        {saved.product.title}
                      </p>
                      <p className="text-xs font-black text-purple-600 mt-1">
                        {formatPrice(saved.product.price)}
                      </p>
                      <div className="flex items-center gap-3 mt-3 text-xs">
                        <button
                          onClick={() => moveToCart(saved.id)}
                          className="font-bold text-purple-600 hover:underline flex items-center gap-1"
                        >
                          <ShoppingBag size={13} /> بازگرداندن به سبد
                        </button>
                        <button
                          onClick={() => removeSaved(saved.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* LEFT AREA: COUPON & ORDER SUMMARY (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon input */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-4">
            <h3 className="font-black text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <Tag size={18} className="text-purple-600" /> کد تخفیف شاپینو
            </h3>
            {couponCode ? (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs flex items-center justify-between text-emerald-800 dark:text-emerald-300">
                <span>✅ کد «{couponCode}» اعمال شد ({couponDiscountPercent}٪ تخفیف)</span>
                <button
                  onClick={removeCoupon}
                  className="font-bold text-red-500 hover:underline"
                >
                  حذف
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="کد تخفیف (مثال: DIGI50)"
                    className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2.5 text-xs outline-none uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold transition"
                  >
                    اعمال
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} /> {couponError}
                  </p>
                )}
                {couponSuccess && (
                  <p className="text-xs text-emerald-600 flex items-center gap-1">
                    <Check size={12} /> {couponSuccess}
                  </p>
                )}
                <p className="text-[11px] text-gray-400 pt-1">
                  کدهای نمونه فعال: <span className="font-mono">SHOPINO10</span> |{' '}
                  <span className="font-mono">SAVE20</span> | <span className="font-mono">VIP30</span> |{' '}
                  <span className="font-mono">DIGI50</span>
                </p>
              </form>
            )}
          </div>

          {/* Price summary & CTA */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-purple-200 dark:border-purple-900 p-6 shadow-xl space-y-4 sticky top-24">
            <h3 className="font-black text-base text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
              خلاصه صورتحساب شما
            </h3>
            <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span>قیمت کالاها ({items.length} مورد):</span>
                <span className="font-mono">{formatPrice(subTotal())}</span>
              </div>
              {discountAmount() > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>سود شما از خرید:</span>
                  <span className="font-mono">- {formatPrice(discountAmount())}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>هزینه ارسال:</span>
                <span>
                  {shippingFee() === 0 ? (
                    <span className="text-emerald-600 font-bold">رایگان</span>
                  ) : (
                    formatPrice(shippingFee())
                  )}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-between items-center">
              <span className="text-sm font-black text-gray-900 dark:text-white">
                مبلغ قابل پرداخت:
              </span>
              <span className="text-xl font-black text-purple-600 dark:text-purple-400 font-mono">
                {formatPrice(finalTotal())}
              </span>
            </div>

            <Button
              onClick={() => navigate('/checkout')}
              disabled={items.length === 0}
              className="w-full py-4 text-sm"
              icon={<ArrowLeft size={18} />}
            >
              ادامه به مرحله تسویه‌حساب
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>تضمین امنیت پرداخت با درگاه‌های معتبر بانکی</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
