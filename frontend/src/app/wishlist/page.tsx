'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/lib/stores/wishlistStore';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  if (items.length === 0) {
    return (
      <div className="container-page py-6">
        <EmptyState
          icon={<Heart size={32} />}
          title="لیست علاقه‌مندی خالی است"
          description="محصولات مورد علاقه‌تان را با کلیک روی آیکن قلب اضافه کنید."
          action={
            <Link href="/shop">
              <Button>مشاهده فروشگاه</Button>
            </Link>
          }
        />
      </div>
    );
  }
  return (
    <div className="container-page py-6">
      <h1 className="text-lg md:text-2xl font-black mb-4">علاقه‌مندی‌ها</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {items.map((i) => (
          <ProductCard key={i.productId} product={i.product} />
        ))}
      </div>
    </div>
  );
}
