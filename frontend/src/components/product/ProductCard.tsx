"use client";
import Link from 'next/link';
import { Heart, ShoppingCart, Plus } from 'lucide-react';
import { Price } from '@/components/ui/Price';
import { Rating } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';
import { useState } from 'react';

export function ProductCard({ product }: { product: any }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="group relative bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <Link href={`/product/${product.slug}`} className="block relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        </div>
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && <Badge variant="brand" className="text-[10px]">جدید</Badge>}
          {product.isFlashSale && <Badge variant="danger" className="text-[10px]">فروش ویژه</Badge>}
          {product.discountPercentage && product.discountPercentage > 0 && <Badge variant="success" className="text-[10px]">{product.discountPercentage}%</Badge>}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-white hover:shadow-md transition-all"
          aria-label="علاقه‌مندی"
        >
          <Heart className={`w-4 h-4 transition-colors ${liked ? 'text-brand-500 fill-brand-500' : 'text-ink-400'}`} />
        </button>
      </Link>

      <div className="p-4 flex flex-col gap-2">
        <Link href={`/product/${product.slug}`} className="text-sm font-semibold text-[var(--text-primary)] hover:text-brand-600 line-clamp-2 leading-relaxed transition-colors">{product.title}</Link>
        <div className="flex items-center gap-1">
          <Rating value={product.rating} />
          <span className="text-[10px] text-[var(--text-muted)]">({product.reviewCount})</span>
        </div>
        <div className="flex items-end justify-between gap-2 mt-1">
          <Price price={product.price} discountPercentage={product.discountPercentage} />
        </div>
        <div className="flex gap-2 mt-1">
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-medium py-2 rounded-lg transition-colors">
            <ShoppingCart className="w-3.5 h-3.5" /> افزودن به سبد
          </button>
        </div>
      </div>
    </div>
  );
}
