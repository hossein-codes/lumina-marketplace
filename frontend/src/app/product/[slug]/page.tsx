'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart, Minus, Plus, ShieldCheck, ShoppingCart, Truck, Undo2 } from 'lucide-react';
import { toast } from 'sonner';
import { productService, reviewService } from '@/lib/api/services';
import { useCartStore } from '@/lib/stores/cartStore';
import { useWishlistStore } from '@/lib/stores/wishlistStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { Price } from '@/components/ui/Price';
import { Rating } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate, formatNumber } from '@/lib/utils/format';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const addToCart = useCartStore((s) => s.add);
  const toggleWish = useWishlistStore((s) => s.toggle);

  const { data: productRes, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getBySlug(slug),
  });
  const product = productRes?.data;

  const { data: reviewsRes } = useQuery({
    queryKey: ['reviews', product?.id],
    queryFn: () => reviewService.byProduct(product!.id),
    enabled: !!product?.id,
  });

  const createReview = useMutation({
    mutationFn: () =>
      reviewService.create({
        productId: product!.id,
        rating: newReview.rating,
        comment: newReview.comment,
      }),
    onSuccess: () => {
      toast.success('نظر شما ثبت شد');
      setNewReview({ rating: 5, comment: '' });
      qc.invalidateQueries({ queryKey: ['reviews', product?.id] });
      qc.invalidateQueries({ queryKey: ['product', slug] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="container-page py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="aspect-square rounded-2xl" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-xl font-bold mb-2">محصول یافت نشد</h1>
        <Link href="/shop" className="text-[var(--color-brand-600)] font-medium">
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  const gallery = [product.thumbnail, ...(product.images ?? [])];
  const inStock = product.stock > 0;

  return (
    <div className="container-page py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-[var(--text-muted)] mb-4 flex flex-wrap items-center gap-1">
        <Link href="/">خانه</Link>
        <span>/</span>
        <Link href="/shop">فروشگاه</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link href={`/shop?category=${product.category.slug}`}>{product.category.name}</Link>
          </>
        )}
        <span>/</span>
        <span className="text-[var(--text-primary)]">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_320px] gap-6">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--surface-card)] border border-[var(--border-subtle)]">
            <Image
              src={gallery[selectedImage]}
              alt={product.title}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover"
              priority
            />
            {product.isFlashSale && (
              <Badge variant="brand" className="absolute top-3 right-3">
                فروش ویژه
              </Badge>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === i
                      ? 'border-[var(--color-brand-500)]'
                      : 'border-[var(--border-subtle)]'
                  }`}
                >
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.brand && (
            <Link
              href={`/shop?brand=${product.brand.slug}`}
              className="text-xs text-[var(--color-brand-600)] font-medium"
            >
              {product.brand.name}
            </Link>
          )}
          <h1 className="text-xl md:text-2xl font-black mt-1 leading-8">{product.title}</h1>
          <div className="flex items-center gap-4 mt-3 text-sm">
            <Rating value={product.rating} />
            <span className="text-[var(--text-muted)] font-num">
              ({formatNumber(product.reviewCount)} نظر)
            </span>
            {product.sku && (
              <span className="text-[var(--text-muted)]">کد: {product.sku}</span>
            )}
          </div>

          <div className="mt-6 space-y-3">
            <h3 className="font-bold text-sm">معرفی</h3>
            <p className="text-sm leading-7 text-[var(--text-secondary)] whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {product.tags?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((t) => (
                <Badge key={t} variant="neutral">
                  #{t}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Buy box */}
        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 space-y-4">
            <div className="flex justify-end">
              <Price value={product.price} discountPercentage={product.discountPercentage} size="lg" />
            </div>

            <div className="flex items-center gap-2 text-xs">
              {inStock ? (
                <span className="text-emerald-600 font-bold">✓ موجود در انبار</span>
              ) : (
                <span className="text-[var(--color-danger-500)] font-bold">ناموجود</span>
              )}
              <span className="text-[var(--text-muted)] font-num">
                ({formatNumber(product.stock)} عدد)
              </span>
            </div>

            {inStock && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--text-muted)]">تعداد:</span>
                <div className="flex items-center rounded-lg border border-[var(--border-default)]">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-9 h-9 grid place-items-center hover:bg-[var(--surface-muted)]"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-sm font-num">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="w-9 h-9 grid place-items-center hover:bg-[var(--surface-muted)]"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={!inStock}
              leftIcon={<ShoppingCart size={18} />}
              onClick={async () => {
                await addToCart(product, qty);
                toast.success('به سبد خرید اضافه شد');
              }}
            >
              افزودن به سبد خرید
            </Button>
            <Button
              variant="outline"
              size="md"
              fullWidth
              leftIcon={<Heart size={16} />}
              onClick={async () => {
                await toggleWish(product);
                toast.success('علاقه‌مندی به‌روزرسانی شد');
              }}
            >
              افزودن به علاقه‌مندی‌ها
            </Button>

            <ul className="pt-2 space-y-2 text-xs text-[var(--text-secondary)]">
              <li className="flex items-center gap-2">
                <Truck size={14} className="text-[var(--color-brand-500)]" /> ارسال سریع در سراسر ایران
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[var(--color-brand-500)]" /> ضمانت اصالت کالا
              </li>
              <li className="flex items-center gap-2">
                <Undo2 size={14} className="text-[var(--color-brand-500)]" /> ۷ روز مهلت بازگشت
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Reviews */}
      <section className="mt-12">
        <h2 className="text-lg font-black mb-4">دیدگاه کاربران</h2>

        {user ? (
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold">امتیاز شما:</span>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setNewReview((r) => ({ ...r, rating: n }))}
                  className={`text-xl ${n <= newReview.rating ? 'text-[var(--color-warning-500)]' : 'text-[var(--border-strong)]'}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview((r) => ({ ...r, comment: e.target.value }))}
              placeholder="نظر شما درباره این کالا..."
              rows={3}
              className="w-full rounded-lg border border-[var(--border-default)] p-3 text-sm bg-[var(--surface-card)] outline-none focus:border-[var(--color-brand-500)]"
            />
            <div className="mt-2 flex justify-end">
              <Button
                onClick={() => createReview.mutate()}
                loading={createReview.isPending}
                disabled={!newReview.comment.trim()}
              >
                ثبت دیدگاه
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] p-4 mb-6 text-sm text-[var(--text-secondary)]">
            برای ثبت دیدگاه ابتدا{' '}
            <Link href="/login" className="text-[var(--color-brand-600)] font-bold">
              وارد شوید
            </Link>
            .
          </div>
        )}

        <div className="space-y-3">
          {(reviewsRes?.data ?? []).length === 0 && (
            <div className="text-sm text-[var(--text-muted)]">هنوز دیدگاهی ثبت نشده است.</div>
          )}
          {(reviewsRes?.data ?? []).map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">
                    {r.user?.firstName || 'کاربر'} {r.user?.lastName || ''}
                  </span>
                  <Rating value={r.rating} showValue={false} />
                </div>
                <span className="text-xs text-[var(--text-muted)]">{formatDate(r.createdAt)}</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-6">{r.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
