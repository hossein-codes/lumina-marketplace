import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  ArrowLeft,
  Flame,
  ShieldCheck,
  Truck,
  RefreshCw
} from 'lucide-react';
import { CATEGORIES, MOCK_PRODUCTS, MOCK_BLOG_ARTICLES } from '../data/mockDatabase';
import { ProductCard } from '../components/product/ProductCard';
import { CountdownTimer } from '../components/ui/DesignComponents';
import { useProducts } from '../hooks/useApi';

export const Home: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<'popular' | 'new' | 'discount'>('popular');

  const heroSlides = [
    {
      title: 'رونمایی از سری آیفون ۱۶ پرو مکس',
      subtitle: 'با تراشه قدرتمند A18 Pro و بدنه تیتانیومی گرید هوافضا — تحویل فوری',
      ctaText: 'خرید آنلاین آیفون ۱۶',
      ctaLink: '/product/prod-1',
      badge: '🔥 پیشنهاد طلایی هفته',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&q=80',
      bgGradient: 'from-purple-900 via-indigo-900 to-gray-900'
    },
    {
      title: 'لپ‌تاپ‌های مک‌بوک و گیمینگ ایسوس',
      subtitle: 'تخفیف‌های استثنایی برای برنامه‌نویسان، طراحان و گیمرهای حرفه‌ای',
      ctaText: 'مشاهده لپ‌تاپ‌ها',
      ctaLink: '/shop?cat=laptops',
      badge: '💻 پرفروش‌ترین‌های دنیای دیجیتال',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80',
      bgGradient: 'from-blue-900 via-slate-900 to-gray-900'
    },
    {
      title: 'جشنواره عطر و ادکلن‌های اورجینال فرانسه',
      subtitle: 'شنل، دیور، ورساچه با ضمانت اصالت ۱۰۰٪ بارکددار و امکان مرجوعی',
      ctaText: 'خرید عطر اورجینال',
      ctaLink: '/shop?cat=fragrances',
      badge: '🌸 رایحه‌ای ماندگار برای شما',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200&q=80',
      bgGradient: 'from-rose-900 via-purple-950 to-gray-900'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const { data: apiProducts = [], isLoading: productsLoading } = useProducts({ limit: 20 });

  const flashSaleProducts = (apiProducts || []).filter((p: any) => p.isFlashSale);
  const popularProducts = (apiProducts || []).filter((p: any) => p.rating >= 4.8);
  const newProducts = (apiProducts || []).filter((p: any) => p.isNew);
  const discountProducts = (apiProducts || []).filter((p: any) => p.discountPercentage >= 10);

  const displayedProducts =
    activeTab === 'popular'
      ? popularProducts
      : activeTab === 'new'
      ? newProducts
      : discountProducts;

  return (
    <div className="space-y-16 pb-12">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative overflow-hidden bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Carousel (2 columns) */}
            <div className="lg:col-span-2 relative rounded-3xl overflow-hidden bg-gray-900 min-h-[420px] flex items-center shadow-2xl border border-gray-800">
              {heroSlides.map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-700 flex flex-col justify-end p-8 md:p-12 ${
                    idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-35"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${slide.bgGradient} opacity-90`} />

                  {/* Slide Content */}
                  <div className="relative z-10 max-w-xl space-y-4 text-white">
                    <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
                      {slide.badge}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                      {slide.subtitle}
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <Link
                        to={slide.ctaLink}
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-purple-500/30 transition hover:scale-105"
                      >
                        <ShoppingBag size={18} /> {slide.ctaText}
                      </Link>
                      <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm rounded-2xl transition"
                      >
                        مشاهده همه کالاها <ArrowLeft size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {/* Slider Dots & Navigation */}
              <div className="absolute bottom-6 left-8 z-20 flex items-center gap-2">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === activeSlide ? 'w-8 bg-white' : 'w-2 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Side Promo Banners (1 column) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {/* Promo Banner 1: Espresso Machine */}
              <Link
                to="/product/prod-6"
                className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-900 to-gray-900 p-6 flex flex-col justify-between min-h-[200px] border border-gray-800 shadow-xl"
              >
                <div className="relative z-10 space-y-2">
                  <span className="text-[10px] bg-amber-500 text-black font-black px-2 py-0.5 rounded-full">
                    پیشنهاد سرآشپز
                  </span>
                  <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition">
                    اسپرسوساز اتوماتیک دلونگی
                  </h3>
                  <p className="text-xs text-gray-300">با پمپ ۱۵ بار واقعی و آسیاب سرامیکی</p>
                </div>
                <div className="relative z-10 flex items-center justify-between mt-4">
                  <span className="text-sm font-black text-amber-400">۲۴,۵۰۰,۰۰۰ تومان</span>
                  <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:bg-amber-500 group-hover:text-black transition">
                    <ArrowLeft size={16} />
                  </span>
                </div>
              </Link>

              {/* Promo Banner 2: Nike Pegasus */}
              <Link
                to="/product/prod-8"
                className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-purple-900 to-gray-900 p-6 flex flex-col justify-between min-h-[200px] border border-gray-800 shadow-xl"
              >
                <div className="relative z-10 space-y-2">
                  <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded-full">
                    ۲۰٪ تخفیف
                  </span>
                  <h3 className="text-lg font-black text-white group-hover:text-purple-300 transition">
                    کفش رانینگ اورجینال نایکی
                  </h3>
                  <p className="text-xs text-gray-300">Pegasus 40 با کفی Air Zoom</p>
                </div>
                <div className="relative z-10 flex items-center justify-between mt-4">
                  <span className="text-sm font-black text-purple-300">۷,۶۰۰,۰۰۰ تومان</span>
                  <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:bg-purple-500 transition">
                    <ArrowLeft size={16} />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION (Amazon & Digikala inspired) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-purple-600" /> دسته‌بندی‌های اصلی شاپینو
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              بیش از ۱۰۰ هزار کالای متنوع در ۱۰ دسته‌بندی تخصصی
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            مشاهده همه کالاها <ArrowLeft size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?cat=${cat.slug}`}
              className="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-5 flex flex-col items-center text-center hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-12 h-12 object-cover rounded-xl"
                />
              </div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                {cat.name}
              </h3>
              <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FLASH SALE SECTION (شگفت‌انگیز شاپینو) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-purple-700 rounded-3xl p-6 md:p-8 text-white shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 border-b border-white/20 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Flame size={26} className="text-amber-300 animate-bounce" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black">پیشنهادهای شگفت‌انگیز</h2>
                <p className="text-xs text-white/80 mt-0.5">تخفیف‌های زمان‌دار ویژه کاربران شاپینو</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-white/90">زمان باقی‌مانده تا پایان تخفیف:</span>
              <CountdownTimer targetDate={new Date(Date.now() + 18 * 3600 * 1000).toISOString()} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {flashSaleProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. PRODUCT TABS SECTION (محبوب‌ترین‌ها، جدیدترین‌ها، بیشترین تخفیف) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="text-purple-600" /> محصولات منتخب شاپینو
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              بر اساس امتیاز مشتریان و تعداد فروش در سراسر کشور
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-700">
            {[
              { id: 'popular', label: '⭐ محبوب‌ترین‌ها' },
              { id: 'new', label: '🆕 جدیدترین‌ها' },
              { id: 'discount', label: '🔥 بیشترین تخفیف' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-900 text-purple-700 dark:text-purple-300 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-black text-sm border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition"
          >
            مشاهده همه محصولات این بخش <ArrowLeft size={16} />
          </Link>
        </div>
      </section>

      {/* 5. SELLER SYSTEM PROMO BANNER (Enterprise Business Vision) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-gray-900 via-purple-950 to-indigo-950 border border-purple-800/40 p-8 md:p-12 text-white shadow-2xl">
          <div className="max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-purple-600/30 text-purple-300 text-xs font-bold border border-purple-500/40">
              💼 همکاری در فروش (Marketplace Seller System)
            </span>
            <h3 className="text-3xl md:text-4xl font-black leading-tight">
              شما هم فروشنده کالاهای خود در شاپینو باشید!
            </h3>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              با پیوستن به خانواده بزرگ فروشندگان شاپینو، کالاهای خود را به میلیون‌ها خریدار در سراسر ایران نمایش دهید و از تسویه‌حساب روزانه و پنل مدیریت فروش اختصاصی بهره‌مند شوید.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/seller"
                className="px-6 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-purple-500/30 transition hover:scale-105"
              >
                ثبت‌نام فروشنده جدید ←
              </Link>
              <Link
                to="/admin"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm rounded-2xl transition"
              >
                مشاهده پنل مدیریت کل (Admin Demo)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SEO BLOG ARTICLES SECTION */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              وبلاگ و راهنمای خرید تخصصی
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              جدیدترین مقالات آموزشی و بررسی‌های فنی برای انتخابی هوشمندانه
            </p>
          </div>
          <Link
            to="/blog"
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            مشاهده تمام مقالات <ArrowLeft size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_BLOG_ARTICLES.map((article) => (
            <Link
              key={article.id}
              to={`/blog/${article.slug}`}
              className="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-purple-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl shadow">
                  {article.category}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition leading-relaxed mb-2">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4 flex-1">
                  {article.excerpt}
                </p>
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400">
                  <span>{article.author}</span>
                  <span>{article.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
