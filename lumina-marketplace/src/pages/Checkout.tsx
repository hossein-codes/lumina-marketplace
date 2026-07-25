import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Check } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { orderService } from '../services/api';
import {
  MapPin,
  Truck,
  CreditCard,
  Check,
  ShieldCheck,
  Plus,
  Wallet,
  Building,
  ArrowRight,
  Printer,
  ShoppingBag
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore, UserAddress } from '../store/authStore';
import { formatPrice } from '../utils/format';
import { Button, Modal, Input } from '../components/ui/DesignComponents';

export const Checkout: React.FC = () => {
  const {
    items,
    subTotal,
    discountAmount,
    shippingFee,
    finalTotal,
    clearCart
  } = useCartStore();
  const { user, addAddress, deductWallet } = useAuthStore();
  const navigate = useNavigate();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user?.addresses?.[0]?.id || ''
  );
  const [shippingMethod, setShippingMethod] = useState<'express' | 'standard' | 'overnight'>(
    'express'
  );
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet' | 'cod'>('card');

  // New address modal state
  const [isAddrModalOpen, setAddrModalOpen] = useState(false);
  const [newAddr, setNewAddr] = useState({
    title: 'محل کار / منزل',
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    city: 'تهران',
    address: '',
    postalCode: '',
    isDefault: false
  });

  // Card details (simulated)
  const [cardNumber, setCardNumber] = useState('6037-9912-3456-7890');
  const [expiry, setExpiry] = useState('06/07');
  const [cvv, setCvv] = useState('123');

  // Order completed state
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderTrackingCode, setOrderTrackingCode] = useState('');

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.phone || !newAddr.address) return;
    addAddress(newAddr);
    setAddrModalOpen(false);
  };

  const handleCompleteOrder = async () => {
    try {
      if (paymentMethod === 'wallet') {
        const ok = deductWallet(finalTotal());
        if (!ok) {
          alert('موجود کیف پول شما کافی نیست. لطفاً روش دیگری انتخاب کنید یا کیف پول را شارژ کنید.');
          return;
        }
      }

      // Create order via real API
      const orderPayload = {
        items: cartItems.map((item: any) => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.product.price,
        })),
        shippingAddressId: selectedAddressId,
        billingAddressId: selectedAddressId,
        paymentMethod: paymentMethod === 'wallet' ? 'WALLET' : paymentMethod === 'cod' ? 'CASH_ON_DELIVERY' : 'CARD',
      };

      const res = await orderService.create(orderPayload);
      if (res.success && res.data) {
        setOrderTrackingCode(res.data.orderNumber || '#ORD-' + Date.now());
        setOrderCompleted(true);
        clearCart();
        await cartService.clear(); // Clear cart via API
      } else {
        alert('خطا در ثبت سفارش: ' + (res.error || 'نامشخص'));
      }
    } catch (err: any) {
      alert('خطای شبکه در ثبت سفارش: ' + (err.message || 'نامشخص'));
    }
  };

  if (orderCompleted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-lg">
          <Check size={44} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          سفارش شما با موفقیت ثبت شد! 🎉
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          از خرید شما سپاسگزاریم. سفارش شما جهت آماده‌سازی به انبار مرکزی شاپینو ارجاع داده شد.
        </p>

        {/* Invoice Summary Box */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 text-right space-y-3 shadow-sm">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
            <span className="text-xs text-gray-400">کد پیگیری سفارش:</span>
            <span className="font-mono font-black text-purple-600 text-lg">{orderTrackingCode}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">مبلغ پرداخت شده:</span>
            <span className="font-bold">{formatPrice(finalTotal())}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">روش پرداخت:</span>
            <span className="font-bold">
              {paymentMethod === 'card'
                ? 'درگاه آنلاین بانکی'
                : paymentMethod === 'wallet'
                ? 'کیف پول شاپینو'
                : 'پرداخت در محل'}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">گیرنده:</span>
            <span className="font-bold">{user?.fullName}</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <Button
            onClick={() => window.print()}
            variant="outline"
            icon={<Printer size={16} />}
          >
            چاپ فاکتور رسمی
          </Button>
          <Button
            onClick={() => navigate('/account')}
            variant="primary"
            icon={<ShoppingBag size={16} />}
          >
            مشاهده در سفارش‌های من
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">سبد خرید شما خالی است</h2>
        <Link to="/shop">
          <Button>بازگشت به فروشگاه</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="flex items-center gap-2">
        <Link to="/cart" className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200">
          <ArrowRight size={18} />
        </Link>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">
          تکمیل خرید و پرداخت
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* RIGHT AREA: ADDRESS + SHIPPING + PAYMENT (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: ADDRESS */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="text-purple-600" /> ۱. انتخاب آدرس تحویل سفارش
              </h3>
              <button
                onClick={() => setAddrModalOpen(true)}
                className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1"
              >
                <Plus size={14} /> افزودن آدرس جدید
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user?.addresses?.map((addr) => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition space-y-2 ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/40 shadow-sm'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {addr.title}
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2">
                      {addr.address}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <span>گیرنده: {addr.fullName}</span>
                      <span>موبایل: {addr.phone}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: SHIPPING METHOD */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-sm">
            <h3 className="font-black text-base text-gray-900 dark:text-white flex items-center gap-2">
              <Truck className="text-purple-600" /> ۲. روش ارسال سفارش
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  id: 'express',
                  title: 'ارسال سریع شاپینو',
                  desc: 'تحویل ۲۴ ساعته',
                  price: '۷۵,۰۰۰ تومان'
                },
                {
                  id: 'standard',
                  title: 'ارسال عادی پست',
                  desc: 'تحویل ۳ تا ۵ روز کاری',
                  price: '۵۰,۰۰۰ تومان'
                },
                {
                  id: 'overnight',
                  title: 'ارسال ویژه شبانه‌روزی',
                  desc: 'تحویل ۴ ساعته (تهران)',
                  price: '۱۲۰,۰۰۰ تومان'
                }
              ].map((opt) => {
                const isSelected = shippingMethod === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setShippingMethod(opt.id as any)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/40 shadow-sm'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs text-gray-900 dark:text-white">{opt.title}</p>
                      <p className="text-[11px] text-gray-400 mt-1">{opt.desc}</p>
                    </div>
                    <p className="text-xs font-black text-purple-600 mt-3">{opt.price}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: PAYMENT METHOD */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-sm">
            <h3 className="font-black text-base text-gray-900 dark:text-white flex items-center gap-2">
              <CreditCard className="text-purple-600" /> ۳. انتخاب روش پرداخت
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  id: 'card',
                  title: 'درگاه آنلاین بانکی',
                  desc: 'پرداخت با کارت‌های شتاب',
                  icon: <CreditCard size={20} />
                },
                {
                  id: 'wallet',
                  title: 'کیف پول شاپینو',
                  desc: `موجودی: ${formatPrice(user?.walletBalance || 0)}`,
                  icon: <Wallet size={20} />
                },
                {
                  id: 'cod',
                  title: 'پرداخت در محل (COD)',
                  desc: 'پرداخت با کارت‌خوان هنگام تحویل',
                  icon: <Building size={20} />
                }
              ].map((pm) => {
                const isSelected = paymentMethod === pm.id;
                return (
                  <div
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center gap-3 ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/40 shadow-sm'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
                    }`}
                  >
                    <div className={isSelected ? 'text-purple-600' : 'text-gray-400'}>
                      {pm.icon}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-gray-900 dark:text-white">{pm.title}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{pm.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {paymentMethod === 'card' && (
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4 space-y-3 mt-4 border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  شبیه‌ساز پرداخت آنلاین بانکی (نمونه‌کار Full-Stack):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="شماره کارت"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="xxxx-xxxx-xxxx-xxxx"
                  />
                  <Input
                    label="تاریخ انقضا"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                  />
                  <Input
                    label="CVV2"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="xxx"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* LEFT AREA: ORDER SUMMARY (4 columns) */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-purple-200 dark:border-purple-900 p-6 shadow-xl space-y-5 sticky top-24">
            <h3 className="font-black text-base text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
              خلاصه نهایی سفارش
            </h3>

            {/* Items short list */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={it.id} className="flex items-center justify-between text-xs">
                  <span className="truncate max-w-[180px] font-medium text-gray-700 dark:text-gray-300">
                    {it.quantity}× {it.product.title}
                  </span>
                  <span className="font-mono font-bold">
                    {formatPrice((it.selectedSeller?.price || it.product.price) * it.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price lines */}
            <div className="space-y-2 border-t border-gray-100 dark:border-gray-800 pt-3 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>جمع کل کالاها:</span>
                <span className="font-mono">{formatPrice(subTotal())}</span>
              </div>
              {discountAmount() > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>تخفیف کالا و کوپن:</span>
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

            {/* Final Total */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-between items-center">
              <span className="text-sm font-black text-gray-900 dark:text-white">
                مبلغ نهایی قابل پرداخت:
              </span>
              <span className="text-xl font-black text-purple-600 dark:text-purple-400 font-mono">
                {formatPrice(finalTotal())}
              </span>
            </div>

            <Button
              onClick={handleCompleteOrder}
              disabled={!selectedAddressId}
              className="w-full py-4 text-sm shadow-xl shadow-purple-500/25"
            >
              پرداخت و ثبت سفارش نهایی
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>تضمین بازگشت وجه تا ۷ روز پس از تحویل کالا</span>
            </div>
          </div>
        </div>
      </div>

      {/* NEW ADDRESS MODAL */}
      <Modal
        isOpen={isAddrModalOpen}
        onClose={() => setAddrModalOpen(false)}
        title="افزودن آدرس تحویل جدید"
      >
        <form onSubmit={handleAddNewAddress} className="space-y-4">
          <Input
            label="عنوان آدرس (مثلاً منزل یا شرکت)"
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

export default Checkout;
