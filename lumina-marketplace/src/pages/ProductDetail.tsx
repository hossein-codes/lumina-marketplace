import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RefreshCw,
  Share2,
  Check,
  Award,
  Store,
  ChevronLeft,
  HelpCircle,
  ThumbsUp
} from 'lucide-react';
import { MOCK_PRODUCTS, SellerOffer } from '../data/mockDatabase';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { formatPrice, calculateDiscountPrice } from '../utils/format';
import { RatingStars, Button, Modal } from '../components/ui/DesignComponents';
import { ProductCard } from '../components/product/ProductCard';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: apiProduct, isLoading, error } = useProduct(id || '');

  const product = apiProduct?.data || apiProduct || (MOCK_PRODUCTS.find((p) => p.id === id || p.slug === id));

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWished } = useWishlistStore();

  const [selectedImg, setSelectedImg] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.variants?.colors?.[0]?.name
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.variants?.sizes?.[0]
  );
  const [selectedSeller, setSelectedSeller] = useState<SellerOffer | undefined>(
    product?.sellers?.[0]
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews' | 'qa'>('desc');
  const [isZoomModalOpen, setZoomModalOpen] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // New review state
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  // Loading state for API
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-bold text-gray-600 dark:text-gray-300">در حال دریافت اطلاعات محصول از سرور...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-8xl mb-4">📦</div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
          محصول مورد نظر یافت نشد
        </h2>
        <p className="text-xs text-gray-500 mb-6">
          ممکن است آدرس صفحه تغییر کرده باشد یا کالا از سایت حذف شده باشد.
        </p>
        <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-2xl font-bold text-xs">
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  const wished = isWished(product.id);
  const activePrice = selectedSeller?.price || product.price;
  const activeDiscount = selectedSeller?.discountPercentage || product.discountPercentage || 0;
  const finalPrice = calculateDiscountPrice(activePrice, activeDiscount);

  const handleAddToCart = () => {
    addItem(product, {
      color: selectedColor,
      size: selectedSize,
      seller: selectedSeller,
      quantity
    });
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const images = product.images?.length ? product.images : [product.thumbnail];

  // Related products from same category
  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link to="/" className="hover:text-purple-600">صفحه اصلی</Link>
        <span>/</span>
        <Link to={`/shop?cat=${product.category}`} className="hover:text-purple-600">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-800 dark:text-gray-200 font-bold truncate max-w-xs">
          {product.title}
        </span>
      </div>

      {/* TOP SECTION: GALLERY + INFO + BUY BOX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 1. GALLERY (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          <div
            onClick={() => setZoomModalOpen(true)}
            className="aspect-square rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 flex items-center justify-center relative overflow-hidden cursor-zoom-in group shadow-sm"
          >
            <img
              src={images[selectedImg]}
              alt={product.title}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
            />
            <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2.5 py-1 rounded-xl backdrop-blur-sm">
              برای بزرگنمایی کلیک کنید
            </span>
          </div>

          {/* Thumbnail selector */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImg(idx)}
                className={`w-16 h-16 flex-shrink-0 rounded-2xl border-2 bg-white dark:bg-gray-900 p-1.5 transition ${
                  selectedImg === idx
                    ? 'border-purple-600 shadow-md scale-105'
                    : 'border-gray-200 dark:border-gray-800 opacity-70'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* 2. PRODUCT INFO (5 Columns) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Brand & English Title */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/40 px-3 py-1 rounded-full">
                {product.brand}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggle(product)}
                  className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-purple-50 text-gray-400 hover:text-red-500 transition"
                >
                  <Heart size={18} className={wished ? 'fill-red-500 text-red-500' : ''} />
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: product.title, url: window.location.href });
                    }
                  }}
                  className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-purple-50 text-gray-400 hover:text-purple-600 transition"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mt-3 leading-relaxed">
              {product.title}
            </h1>
            <p className="text-xs text-gray-400 mt-1 font-mono">{product.enTitle}</p>
          </div>

          {/* Ratings & Stats bar */}
          <div className="flex flex-wrap items-center gap-4 py-3 border-y border-gray-100 dark:border-gray-800 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-500">
              <RatingStars rating={product.rating} showNumber />
              <span className="text-gray-400">({product.reviewsCount} نظر خریداران)</span>
            </div>
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-800" />
            <div className="text-gray-600 dark:text-gray-400">
              تعداد فروش: <span className="font-bold text-gray-900 dark:text-white">{product.salesCount}+</span> عدد
            </div>
          </div>

          {/* Color Variants */}
          {product.variants?.colors && product.variants.colors.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                رنگ انتخابی: <span className="text-purple-600">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border-2 text-xs font-bold transition ${
                      selectedColor === color.name
                        ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                        : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Variants */}
          {product.variants?.sizes && product.variants.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                سایز انتخابی: <span className="text-purple-600">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-2xl border-2 text-xs font-bold transition ${
                      selectedSize === size
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                        : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Key Specifications summary */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 space-y-2">
            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">ویژگی‌های برجسته کالا:</p>
            <ul className="space-y-1.5">
              {product.features?.slice(0, 4).map((f, i) => (
                <li key={i} className="text-xs text-gray-600 dark:text-gray-300 flex items-center justify-between">
                  <span className="text-gray-400 font-medium">{f.key}:</span>
                  <span className="font-semibold">{f.value}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Marketplace Sellers List Table */}
          {product.sellers && product.sellers.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                <Store size={16} className="text-purple-600" /> سایر فروشندگان این کالا ({product.sellers.length} فروشنده):
              </p>
              <div className="space-y-2">
                {product.sellers.map((seller) => {
                  const sDiscPrice = calculateDiscountPrice(seller.price, seller.discountPercentage);
                  const isSelected = selectedSeller?.id === seller.id;

                  return (
                    <div
                      key={seller.id}
                      onClick={() => setSelectedSeller(seller)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/40 dark:bg-purple-950/40 shadow-sm'
                          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-purple-600' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-purple-600" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                            {seller.sellerName}
                            <span className="text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">
                              ★ {seller.rating}
                            </span>
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{seller.guarantee}</p>
                        </div>
                      </div>

                      <div className="text-left">
                        <p className="text-sm font-black text-gray-900 dark:text-white font-mono">
                          {formatPrice(sDiscPrice)}
                        </p>
                        {seller.discountPercentage > 0 && (
                          <span className="text-[10px] text-red-500 font-bold">
                            ({seller.discountPercentage}٪ تخفیف)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 3. BUY BOX (3 Columns) */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-purple-200 dark:border-purple-900 p-6 shadow-xl space-y-6 sticky top-24">
            {/* Seller header info */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                <Store size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">فروشنده انتخابی:</p>
                <p className="text-sm font-black text-gray-900 dark:text-white">
                  {selectedSeller?.sellerName || 'فروشگاه شاپینو'}
                </p>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="space-y-1">
              {activeDiscount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-red-500 font-bold">تخفیف کالا: {activeDiscount}٪</span>
                  <span className="text-xs text-gray-400 line-through font-mono">
                    {formatPrice(activePrice)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">قیمت نهایی:</span>
                <span className="text-2xl font-black text-gray-900 dark:text-white font-mono text-purple-600 dark:text-purple-400">
                  {formatPrice(finalPrice)}
                </span>
              </div>
            </div>

            {/* Guarantee & Shipping info */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-300">
                <ShieldCheck size={18} className="text-emerald-500 flex-shrink-0" />
                <span>{selectedSeller?.guarantee || '۱۸ ماه گارانتی شرکتی'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-300">
                <Truck size={18} className="text-blue-500 flex-shrink-0" />
                <span>{selectedSeller?.shippingTime || 'ارسال فوری سراسر کشور'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-300">
                <RefreshCw size={18} className="text-amber-500 flex-shrink-0" />
                <span>۷ روز ضمانت بازگشت بدون قید و شرط</span>
              </div>
            </div>

            {/* Quantity control */}
            <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">تعداد در سبد:</span>
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 hover:text-purple-600"
                >
                  -
                </button>
                <span className="w-6 text-center text-sm font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-7 h-7 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 hover:text-purple-600"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buy Buttons */}
            <div className="space-y-2 pt-2">
              <Button
                onClick={handleAddToCart}
                className="w-full py-4 text-sm shadow-xl shadow-purple-500/25"
                variant={addedSuccess ? 'success' : 'primary'}
                icon={addedSuccess ? <Check size={18} /> : <ShoppingBag size={18} />}
              >
                {addedSuccess ? 'به سبد اضافه شد' : 'افزودن به سبد خرید'}
              </Button>

              <Link
                to="/checkout"
                onClick={handleAddToCart}
                className="block w-full py-3.5 text-center rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 font-bold text-xs text-gray-800 dark:text-gray-200 transition"
              >
                خرید فوری و تسویه‌حساب
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* TABS SECTION: DESCRIPTION / SPECS / REVIEWS / Q&A */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 md:p-8">
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-4 mb-6 overflow-x-auto">
          {[
            { id: 'desc', label: '📖 معرفی و بررسی تخصصی' },
            { id: 'specs', label: '⚙️ مشخصات فنی کامل' },
            { id: 'reviews', label: `⭐ نظرات خریداران (${product.reviewsCount})` },
            { id: 'qa', label: `❓ پرسش و پاسخ (${product.qa?.length || 0})` }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-6 py-3 rounded-2xl font-bold text-xs whitespace-nowrap transition ${
                activeTab === t.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: DESCRIPTION */}
        {activeTab === 'desc' && (
          <div className="space-y-4 max-w-3xl leading-relaxed text-sm text-gray-700 dark:text-gray-300">
            <p className="text-base font-bold text-gray-900 dark:text-white">بررسی تخصصی کالا</p>
            <p>{product.description}</p>
          </div>
        )}

        {/* TAB 2: SPECS TABLE */}
        {activeTab === 'specs' && (
          <div className="max-w-3xl space-y-4">
            <p className="text-base font-bold text-gray-900 dark:text-white mb-2">مشخصات فنی</p>
            <div className="divide-y divide-gray-100 dark:divide-gray-800 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              {product.features?.map((feat, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-3 p-4 bg-white dark:bg-gray-900 even:bg-gray-50 dark:even:bg-gray-800/50 text-xs"
                >
                  <span className="font-bold text-gray-500 dark:text-gray-400">{feat.key}</span>
                  <span className="col-span-2 font-semibold text-gray-800 dark:text-gray-200">
                    {feat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Summary column */}
            <div className="md:col-span-4 bg-gray-50 dark:bg-gray-800/60 p-6 rounded-3xl text-center space-y-3 h-fit">
              <p className="text-5xl font-black text-gray-900 dark:text-white">{product.rating}</p>
              <RatingStars rating={product.rating} size={20} />
              <p className="text-xs text-gray-500">
                بر اساس امتیاز {product.reviewsCount} خریدار از سراسر کشور
              </p>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">
                  شما هم نظر خود را ثبت کنید:
                </p>
                <div className="flex justify-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <button
                      key={st}
                      onClick={() => setNewReviewRating(st)}
                      className="p-1 text-yellow-400 hover:scale-125 transition"
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="تجربه خرید خود را بنویسید..."
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 text-xs outline-none"
                  rows={3}
                />
                <Button
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => {
                    if (newReviewText.trim()) {
                      product.reviews.unshift({
                        id: 'rev-' + Date.now(),
                        userId: 'u-me',
                        userName: 'شما (خریدار)',
                        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
                        rating: newReviewRating,
                        date: 'همین الان',
                        title: 'نظر جدید خریدار',
                        comment: newReviewText,
                        likes: 0,
                        verified: true
                      });
                      setNewReviewText('');
                    }
                  }}
                >
                  ثبت دیدگاه جدید
                </Button>
              </div>
            </div>

            {/* Reviews list */}
            <div className="md:col-span-8 space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-3xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.userAvatar}
                          alt={rev.userName}
                          className="w-10 h-10 rounded-full object-cover border border-purple-200"
                        />
                        <div>
                          <p className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                            {rev.userName}
                            {rev.verified && (
                              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                                خریدار تایید شده
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{rev.date}</p>
                        </div>
                      </div>
                      <RatingStars rating={rev.rating} />
                    </div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{rev.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {rev.comment}
                    </p>
                    <div className="flex items-center justify-end gap-2 text-xs text-gray-400">
                      <button className="hover:text-purple-600 flex items-center gap-1">
                        <ThumbsUp size={13} /> مفید بود ({rev.likes})
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400">هنوز دیدگاهی برای این محصول ثبت نشده است.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Q&A */}
        {activeTab === 'qa' && (
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between">
              <p className="font-bold text-sm text-gray-900 dark:text-white">
                پرسش و پاسخ درباره این کالا
              </p>
            </div>
            {product.qa && product.qa.length > 0 ? (
              product.qa.map((qa) => (
                <div
                  key={qa.id}
                  className="p-5 rounded-3xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 space-y-3"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400">
                    <HelpCircle size={16} />
                    <span>پرسش کاربر: {qa.user}</span>
                    <span className="text-gray-400 text-[11px]">({qa.date})</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{qa.question}</p>
                  {qa.answer && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-white dark:bg-gray-900 border-l-4 border-l-purple-600 text-xs space-y-1">
                      <p className="font-bold text-purple-600">{qa.answer.author}:</p>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {qa.answer.text}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400">
                هنوز سوالی درباره این محصول پرسیده نشده است. اولین نفری باشید که می‌پرسید!
              </p>
            )}
          </div>
        )}
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              محصولات مرتبط و پیشنهادی
            </h2>
            <Link
              to={`/shop?cat=${product.category}`}
              className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1"
            >
              مشاهده همه <ChevronLeft size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* ZOOM MODAL */}
      <Modal
        isOpen={isZoomModalOpen}
        onClose={() => setZoomModalOpen(false)}
        title={product.title}
        maxWidth="max-w-3xl"
      >
        <div className="p-4 bg-white dark:bg-gray-900 flex items-center justify-center">
          <img
            src={images[selectedImg]}
            alt={product.title}
            className="max-h-[70vh] object-contain"
          />
        </div>
      </Modal>
    </div>
  );
};

export default ProductDetail;
