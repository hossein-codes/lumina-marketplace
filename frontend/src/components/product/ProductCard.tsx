'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/lib/types';
import { useCartStore } from '@/lib/stores/cartStore';
import { useWishlistStore } from '@/lib/stores/wishlistStore';
import { Badge } from '@/components/ui/Badge';
import { Price } from '@/components/ui/Price';
import { Rating } from '@/components/ui/Rating';
import { cn } from '@/lib/utils/cn';

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const addToCart = useCartStore((s) => s.add);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const inWishlist = useWishlistStore((s) => s.has(product.id));

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product, 1);
    toast.success('به سبد خرید اضافه شد', { description: product.title });
  };

  const handleWish = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWish(product);
    toast(inWishlist ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها اضافه شد');
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn(
        'group relative flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)]',
        'hover:border-[var(--color-brand-300)] hover:shadow-[var(--shadow-md)] transition-all overflow-hidden'
      )}
    >
      <button
        onClick={handleWish}
        aria-label="افزودن به علاقه‌مندی"
        className={cn(
          'absolute top-3 left-3 z-10 h-9 w-9 rounded-full grid place-items-center transition-colors',
          'bg-[var(--surface-card)]/90 backdrop-blur border border-[var(--border-subtle)]',
          inWishlist ? 'text-[var(--color-brand-500)]' : 'text-[var(--text-muted)] hover:text-[var(--color-brand-500)]'
        )}
      >
        <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
      </button>

      {product.isFlashSale && (
        <Badge variant="brand" className="absolute top-3 right-3 z-10">
          فروش ویژه
        </Badge>
      )}
      {!product.isFlashSale && product.isNew && (
        <Badge variant="info" className="absolute top-3 right-3 z-10">
          جدید
        </Badge>
      )}

      <div className="relative aspect-square bg-[var(--surface-muted)]">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className={cn('flex flex-col gap-2 p-3', compact && 'p-2')}>
        <h3
          className={cn(
            'text-sm font-medium text-[var(--text-primary)] line-clamp-2 min-h-[2.6em]',
            compact && 'text-xs min-h-[2.4em]'
          )}
        >
          {product.title}
        </h3>

        <div className="flex items-center justify-between">
          <Rating value={product.rating} />
          {product.stock > 0 ? (
            <span className="text-[11px] text-emerald-600 font-medium">موجود</span>
          ) : (
            <span className="text-[11px] text-[var(--text-muted)]">ناموجود</span>
          )}
        </div>

        <div className="flex items-end justify-between pt-1">
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="h-9 w-9 grid place-items-center rounded-full bg-[var(--color-brand-500)] text-white hover:bg-[var(--color-brand-600)] disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="افزودن به سبد"
          >
            <ShoppingCart size={16} />
          </button>
          <Price value={product.price} discountPercentage={product.discountPercentage} size="sm" />
        </div>
      </div>
    </Link>
  );
}
