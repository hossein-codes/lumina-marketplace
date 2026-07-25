import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, Category } from '../../data/mockDatabase';
import { ChevronLeft, ChevronDown, Sparkles } from 'lucide-react';

export const MegaMenu: React.FC = () => {
  const [activeCat, setActiveCat] = useState<Category>(CATEGORIES[0]);

  return (
    <div className="relative group">
      <button className="flex items-center gap-1.5 px-4 py-3 font-bold text-sm text-gray-800 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition">
        <span>دسته‌بندی کالاها</span>
        <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-200" />
      </button>

      {/* Mega Menu Dropdown */}
      <div className="absolute top-full right-0 w-[900px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
        <div className="flex min-h-[420px]">
          {/* Column 1: Main Categories List */}
          <div className="w-64 bg-gray-50 dark:bg-gray-800/60 border-l border-gray-200 dark:border-gray-800 p-2 space-y-1">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onMouseEnter={() => setActiveCat(cat)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-2xl cursor-pointer text-sm font-semibold transition ${
                  activeCat.id === cat.id
                    ? 'bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <span>{cat.name}</span>
                <ChevronLeft size={16} className={activeCat.id === cat.id ? 'text-purple-600' : 'text-gray-400'} />
              </div>
            ))}
          </div>

          {/* Column 2: SubCategories & Brands */}
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-5">
              <div>
                <h4 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  {activeCat.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{activeCat.description}</p>
              </div>
              <Link
                to={`/shop?cat=${activeCat.slug}`}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                مشاهده همه محصولات {activeCat.name} <ChevronLeft size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {activeCat.subCategories.map((sub) => (
                <div key={sub.id} className="space-y-2">
                  <Link
                    to={`/shop?cat=${sub.slug}`}
                    className="block font-black text-sm text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition"
                  >
                    {sub.name}
                  </Link>
                  {sub.brands && sub.brands.length > 0 && (
                    <ul className="space-y-1.5 border-r-2 border-purple-100 dark:border-purple-900/40 pr-3">
                      {sub.brands.map((brand) => (
                        <li key={brand}>
                          <Link
                            to={`/shop?cat=${sub.slug}&brand=${encodeURIComponent(brand)}`}
                            className="text-xs text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300 transition block"
                          >
                            {brand}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Promo Banner Image */}
          {activeCat.promoImage && (
            <div className="w-64 relative overflow-hidden bg-gray-900">
              <img
                src={activeCat.promoImage}
                alt={activeCat.name}
                className="w-full h-full object-cover opacity-60 hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-500 text-black px-2 py-0.5 rounded-full mb-2 w-fit">
                  <Sparkles size={12} /> پیشنهاد ویژه
                </span>
                <p className="font-black text-base leading-tight mb-2">جشنواره تخفیف‌های {activeCat.name}</p>
                <Link
                  to={`/shop?cat=${activeCat.slug}`}
                  className="inline-flex items-center justify-center py-2 px-3 bg-white text-gray-900 rounded-xl text-xs font-bold hover:bg-purple-600 hover:text-white transition"
                >
                  مشاهده کالاها
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
