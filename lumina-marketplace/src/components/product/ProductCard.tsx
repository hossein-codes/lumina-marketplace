import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Sparkles, Eye, Check } from 'lucide-react';
import { Product } from '../../data/mockDatabase';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { formatPrice, calculateDiscountPrice } from '../../utils/format';
import { RatingStars } from '../ui/DesignComponents';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWished } = useWishlistStore();

  const wished = isWished(product.id);
  const finalPrice = calculateDiscountPrice(product.price, product.discountPercentage);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleToggleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  };

  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top Badges */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-end">
        {product.discountPercentage > 0 && (
          <span className="bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-xl shadow-sm">
            {product.discountPercentage}٪ تخفیف
          </span>
        )}
        {product.isFlashSale && (
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[10px] px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1">
            <Sparkles size={11} /> پیشنهاد ویژه
          </span>
        )}
        {product.isNew && (
          <span className="bg-purple-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-lg shadow-sm">
            جدید
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWish}
        title="افزودن به علاقه‌مندی"
        className="absolute top-3 left-3 z-10 w-9 h-9 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:scale-110 transition shadow-sm"
      >
        <Heart
          size={18}
          className={`${
            wished ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-gray-400'
          }`}
        />
      </button>

      {/* Image Container */}
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-square bg-gray-50/50 dark:bg-gray-800/30 overflow-hidden p-6"
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
        />
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Brand & Category */}
        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-1.5 font-medium">
          <span>{product.brand}</span>
          <RatingStars rating={product.rating} showNumber />
        </div>

        {/* Title */}
        <Link
          to={`/product/${product.id}`}
          className="font-bold text-sm text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 line-clamp-2 leading-relaxed mb-3 flex-1"
        >
          {product.title}
        </Link>

        {/* Price & Add to Cart button */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-end justify-between gap-2 mt-auto">
          <div>
            {product.discountPercentage > 0 && (
              <div className="text-xs text-gray-400 line-through font-mono">
                {formatPrice(product.price)}
              </div>
            )}
            <div className="text-base font-black text-gray-900 dark:text-white font-mono">
              {formatPrice(finalPrice)}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all ${
              added
                ? 'bg-emerald-600 text-white scale-95 shadow-md shadow-emerald-500/25'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20 hover:scale-105'
            }`}
          >
            {added ? (
              <>
                <Check size={16} />
                <span>افزوده شد</span>
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                <span>خرید سریع</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
