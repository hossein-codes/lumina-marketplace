import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowLeft, ShieldCheck, Heart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatPrice } from '../../utils/format';

export const MiniCartDrawer: React.FC = () => {
  const {
    items,
    isDrawerOpen,
    setDrawerOpen,
    updateQuantity,
    removeItem,
    saveForLater,
    subTotal,
    discountAmount,
    shippingFee,
    finalTotal
  } = useCartStore();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleCheckout = () => {
    setDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={() => setDrawerOpen(false)}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-gray-900 h-full flex flex-col shadow-2xl border-l border-gray-200 dark:border-gray-800 animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-purple-600 dark:text-purple-400" />
            <h3 className="font-black text-lg text-gray-900 dark:text-white">سبد خرید شما</h3>
            <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold px-2 py-0.5 rounded-full">
              {items.length} کالا
            </span>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress bar */}
        <div className="px-6 py-2.5 bg-purple-50 dark:bg-purple-950/40 border-b border-purple-100 dark:border-purple-900/40 text-xs text-purple-800 dark:text-purple-300 flex items-center justify-between">
          <span className="font-semibold">
            {subTotal() > 5000000
              ? '🎉 تبریک! ارسال سفارش شما کاملاً رایگان شد.'
              : `خرید ۵,۰۰۰,۰۰۰ تومان دیگر برای ارسال رایگان`}
          </span>
          <ShieldCheck size={16} />
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length > 0 ? (
            items.map((item) => {
              const price = item.selectedSeller?.price || item.product.price;
              const discPercent =
                item.selectedSeller?.discountPercentage || item.product.discountPercentage || 0;
              const discPrice = Math.round(price * (1 - discPercent / 100));

              return (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-900 transition"
                >
                  <Link
                    to={`/product/${item.product.id}`}
                    onClick={() => setDrawerOpen(false)}
                    className="w-20 h-20 flex-shrink-0 bg-white rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 p-1.5"
                  >
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.title}
                      className="w-full h-full object-contain"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.product.id}`}
                      onClick={() => setDrawerOpen(false)}
                      className="font-bold text-sm text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 line-clamp-2"
                    >
                      {item.product.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {item.selectedColor && (
                        <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">
                          رنگ: {item.selectedColor}
                        </span>
                      )}
                      {item.selectedSize && (
                        <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">
                          سایز: {item.selectedSize}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-purple-600"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-purple-600"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black text-gray-900 dark:text-white">
                          {formatPrice(discPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <button
                        onClick={() => saveForLater(item.id)}
                        className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                      >
                        <Heart size={13} /> ذخیره برای بعد
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:underline flex items-center gap-1"
                      >
                        <Trash2 size={13} /> حذف
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <p className="font-bold text-gray-700 dark:text-gray-300">سبد خرید شما خالی است</p>
              <p className="text-xs text-gray-400 mt-1">
                محصولات مورد علاقه خود را اضافه کنید تا در اینجا نمایش داده شود.
              </p>
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout CTA */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 space-y-3">
            <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span>جمع کالاها ({items.length} مورد)</span>
                <span>{formatPrice(subTotal())}</span>
              </div>
              {discountAmount() > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>سود شما از خرید</span>
                  <span>- {formatPrice(discountAmount())}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>هزینه ارسال</span>
                <span>
                  {shippingFee() === 0 ? (
                    <span className="text-emerald-600 font-bold">رایگان</span>
                  ) : (
                    formatPrice(shippingFee())
                  )}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-3">
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">مبلغ قابل پرداخت:</span>
              <span className="text-lg font-black text-purple-600 dark:text-purple-400">
                {formatPrice(finalTotal())}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  navigate('/cart');
                }}
                className="flex-1 py-3.5 border-2 border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400 font-bold rounded-2xl text-sm hover:bg-purple-50 dark:hover:bg-purple-900/30 transition text-center"
              >
                مشاهده سبد خرید
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl text-sm shadow-lg shadow-purple-500/25 transition flex items-center justify-center gap-1.5"
              >
                ادامه به تسویه‌حساب <ArrowLeft size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
