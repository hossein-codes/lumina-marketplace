import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  Grid,
  List,
  Search,
  X,
  ChevronDown,
  Filter,
  Check,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { MOCK_PRODUCTS, CATEGORIES, Product } from '../data/mockDatabase';
import { ProductCard } from '../components/product/ProductCard';
import { formatPrice } from '../utils/format';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Read URL params
  const catSlug = searchParams.get('cat') || '';
  const brandParam = searchParams.get('brand') || '';
  const queryParam = searchParams.get('q') || '';

  // Local filter state
  const [selectedBrand, setSelectedBrand] = useState<string>(brandParam);
  const [priceRange, setPriceRange] = useState<number>(200000000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [flashSaleOnly, setFlashSaleOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('popular'); // popular, newest, price-asc, price-desc, discount

  // Extract all available brands
  const allBrands = useMemo(() => {
    const set = new Set<string>();
    MOCK_PRODUCTS.forEach((p) => set.add(p.brand));
    return Array.from(set);
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      // Category filter
      if (catSlug && p.category !== catSlug && p.subCategory !== catSlug) return false;
      // Brand filter
      if (selectedBrand && p.brand !== selectedBrand) return false;
      // Search term
      if (queryParam) {
        const q = queryParam.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q) || p.enTitle.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchBrand && !matchTag) return false;
      }
      // Price
      if (p.price > priceRange) return false;
      // In stock
      if (inStockOnly && p.stock <= 0) return false;
      // Flash sale
      if (flashSaleOnly && !p.isFlashSale) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'discount') return b.discountPercentage - a.discountPercentage;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return b.rating - a.rating; // default popular
    });
  }, [catSlug, selectedBrand, queryParam, priceRange, inStockOnly, flashSaleOnly, sortBy]);

  const handleClearFilters = () => {
    setSelectedBrand('');
    setPriceRange(200000000);
    setInStockOnly(false);
    setFlashSaleOnly(false);
    setSearchParams({});
  };

  const currentCategoryObj = CATEGORIES.find((c) => c.slug === catSlug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Banner & Breadcrumbs */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
          <span>شاپینو</span>
          <span>/</span>
          <span>فروشگاه کالاها</span>
          {currentCategoryObj && (
            <>
              <span>/</span>
              <span className="text-purple-600 font-bold">{currentCategoryObj.name}</span>
            </>
          )}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              {currentCategoryObj ? currentCategoryObj.name : queryParam ? `نتایج جستجو برای «${queryParam}»` : 'تمام محصولات شاپینو'}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {filteredProducts.length} کالا بر اساس انتخاب شما یافت شد
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-2xl text-xs font-bold shadow-md"
            >
              <Filter size={15} /> فیلترهای پیشرفته
            </button>
            <div className="hidden sm:flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition ${
                  viewMode === 'grid' ? 'bg-white dark:bg-gray-900 text-purple-600 shadow-sm' : 'text-gray-400'
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition ${
                  viewMode === 'list' ? 'bg-white dark:bg-gray-900 text-purple-600 shadow-sm' : 'text-gray-400'
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* SIDEBAR FILTERS (Desktop) */}
        <aside
          className={`fixed inset-0 z-50 lg:static lg:block bg-black/60 lg:bg-transparent transition-opacity ${
            mobileFilterOpen ? 'block' : 'hidden'
          }`}
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            className="w-80 lg:w-full bg-white dark:bg-gray-900 h-full lg:h-auto lg:rounded-3xl border border-gray-200 dark:border-gray-800 p-6 space-y-6 overflow-y-auto shadow-xl lg:shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Clear button */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <h3 className="font-black text-base text-gray-900 dark:text-white flex items-center gap-2">
                <Filter size={18} className="text-purple-600" /> فیلتر کالاها
              </h3>
              <button
                onClick={handleClearFilters}
                className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
              >
                <RotateCcw size={13} /> حذف فیلترها
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">دسته‌بندی‌ها</h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSearchParams({})}
                  className={`w-full text-right px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    !catSlug
                      ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  تمام دسته‌بندی‌ها
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSearchParams({ cat: c.slug })}
                    className={`w-full text-right px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      catSlug === c.slug
                        ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles (In-Stock / Flash Sale) */}
            <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  فقط کالاهای موجود در انبار
                </span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 rounded"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Sparkles size={13} className="text-amber-500" /> فقط پیشنهادهای ویژه
                </span>
                <input
                  type="checkbox"
                  checked={flashSaleOnly}
                  onChange={(e) => setFlashSaleOnly(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 rounded"
                />
              </label>
            </div>

            {/* Brand Filter */}
            <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">برند سازنده</h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedBrand('')}
                  className={`w-full text-right px-3 py-1.5 rounded-xl text-xs font-medium ${
                    !selectedBrand
                      ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 font-bold'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  همه برندها
                </button>
                {allBrands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`w-full text-right px-3 py-1.5 rounded-xl text-xs font-medium ${
                      selectedBrand === b
                        ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">حداکثر قیمت</h4>
              <input
                type="range"
                min={100000}
                max={200000000}
                step={500000}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs font-mono text-purple-600 font-bold">
                <span>تا سقف:</span>
                <span>{formatPrice(priceRange)}</span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full lg:hidden py-3 bg-purple-600 text-white rounded-2xl font-bold text-sm shadow-md"
            >
              اعمال فیلترها
            </button>
          </div>
        </aside>

        {/* MAIN PRODUCTS AREA (3 Columns) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort & Active Filters Toolbar */}
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400">مرتب‌سازی بر اساس:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none"
              >
                <option value="popular">⭐ محبوب‌ترین کالاها</option>
                <option value="newest">🆕 جدیدترین کالاها</option>
                <option value="price-asc">📉 ارزان‌ترین قیمت</option>
                <option value="price-desc">📈 گران‌ترین قیمت</option>
                <option value="discount">🔥 بیشترین تخفیف</option>
              </select>
            </div>

            {/* Active Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {selectedBrand && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold">
                  برند: {selectedBrand}
                  <X size={13} className="cursor-pointer" onClick={() => setSelectedBrand('')} />
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  فقط موجود
                  <X size={13} className="cursor-pointer" onClick={() => setInStockOnly(false)} />
                </span>
              )}
            </div>
          </div>

          {/* Products Grid / List */}
          {filteredProducts.length > 0 ? (
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-16 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-black text-gray-800 dark:text-white mb-2">
                کالایی با مشخصات انتخابی شما یافت نشد!
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                لطفاً فیلترهای خود را تغییر دهید یا دکمه حذف فیلترها را بزنید.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-3 bg-purple-600 text-white font-bold text-xs rounded-2xl shadow-md hover:bg-purple-700 transition"
              >
                بازنشانی تمام فیلترها
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
