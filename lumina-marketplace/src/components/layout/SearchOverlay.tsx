import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, Clock, TrendingUp, ArrowLeft, Tag } from 'lucide-react';
import { useSearchStore } from '../../store/searchStore';
import { MOCK_PRODUCTS, CATEGORIES, Product } from '../../data/mockDatabase';
import { formatPrice, calculateDiscountPrice } from '../../utils/format';

export const SearchOverlay: React.FC = () => {
  const { isOverlayOpen, setOverlayOpen, history, popularQueries, addHistory, removeHistory, clearHistory } = useSearchStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOverlayOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOverlayOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.trim().toLowerCase();
    const filtered = MOCK_PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.enTitle.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 5);
    setResults(filtered);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    addHistory(query.trim());
    setOverlayOpen(false);
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  const handleQuickSelect = (term: string) => {
    addHistory(term);
    setOverlayOpen(false);
    navigate(`/shop?q=${encodeURIComponent(term)}`);
  };

  if (!isOverlayOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/50 backdrop-blur-sm animate-fadeIn" onClick={() => setOverlayOpen(false)}>
      <div
        className="w-full bg-white dark:bg-gray-900 shadow-2xl border-b border-gray-200 dark:border-gray-800 p-4 md:py-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-4xl mx-auto">
          {/* Top Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 border-2 border-purple-600 shadow-sm">
            <Search size={22} className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="نام محصول، برند یا دسته‌بندی را جستجو کنید... (مثلاً: آیفون، شنل، دلونگی)"
              className="bg-transparent flex-1 outline-none text-base text-gray-900 dark:text-white placeholder-gray-400 font-medium"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={18} />
              </button>
            )}
            <button
              type="submit"
              className="hidden sm:inline-flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm px-4 py-2 rounded-xl transition"
            >
              جستجو <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => setOverlayOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white font-bold text-sm px-2"
            >
              بستن
            </button>
          </form>

          {/* Instant Search Suggestions & Results */}
          <div className="mt-6 max-h-[70vh] overflow-y-auto pr-1">
            {query.trim() ? (
              <div className="space-y-6">
                {/* Ajax Instant Products */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">نتایج فوری محصولات</h4>
                  {results.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {results.map((p) => {
                        const discPrice = calculateDiscountPrice(p.price, p.discountPercentage);
                        return (
                          <Link
                            key={p.id}
                            to={`/product/${p.id}`}
                            onClick={() => {
                              addHistory(query.trim());
                              setOverlayOpen(false);
                            }}
                            className="flex items-center gap-3 p-2.5 rounded-2xl bg-gray-50 hover:bg-purple-50 dark:bg-gray-800/60 dark:hover:bg-purple-950/40 border border-gray-100 dark:border-gray-700/60 transition group"
                          >
                            <img src={p.thumbnail} alt={p.title} className="w-14 h-14 rounded-xl object-contain bg-white p-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 truncate">
                                {p.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">{p.brand}</p>
                            </div>
                            <div className="text-left flex-shrink-0">
                              <p className="text-sm font-black text-gray-900 dark:text-white">{formatPrice(discPrice)}</p>
                              {p.discountPercentage > 0 && (
                                <span className="text-[10px] bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 font-bold px-1.5 py-0.5 rounded">
                                  {p.discountPercentage}٪
                                </span>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                      <p className="text-sm font-bold text-gray-600 dark:text-gray-300">محصولی با نام «{query}» یافت نشد.</p>
                      <p className="text-xs text-gray-400 mt-1">ممکن است غلط املایی داشته باشد یا دسته‌بندی دیگری را امتحان کنید.</p>
                    </div>
                  )}
                </div>

                {/* Categories Matching Query */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">دسته‌بندی‌های مرتبط</h4>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setOverlayOpen(false);
                          navigate(`/shop?cat=${cat.slug}`);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800 hover:scale-105 transition"
                      >
                        <Tag size={14} /> {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Recent Searches */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock size={15} /> تاریخچه جستجوهای شما
                    </h4>
                    {history.length > 0 && (
                      <button
                        onClick={clearHistory}
                        className="text-xs text-red-500 hover:underline"
                      >
                        پاک کردن همه
                      </button>
                    )}
                  </div>
                  {history.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {history.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl px-3 py-1.5 text-xs font-medium transition cursor-pointer"
                          onClick={() => handleQuickSelect(item)}
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeHistory(item);
                            }}
                            className="text-gray-400 hover:text-red-500 ml-0.5"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">هنوز موردی جستجو نکرده‌اید.</p>
                  )}
                </div>

                {/* Popular Searches */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <TrendingUp size={15} className="text-orange-500" /> جستجوهای محبوب کاربران
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {popularQueries.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleQuickSelect(term)}
                        className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 rounded-xl px-3 py-1.5 text-xs font-bold transition"
                      >
                        🔥 {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
