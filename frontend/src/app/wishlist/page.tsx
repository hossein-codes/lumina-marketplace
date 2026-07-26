import Link from 'next/link';
import { Heart } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export default function WishlistPage() {
  return (
    <main className="min-h-screen">
      <div className="container-page py-8 md:py-12">
        <h1 className="text-3xl font-black text-[var(--text-primary)] mb-8">علاقه‌مندی‌ها</h1>
        <EmptyState title="لیست علاقه‌مندی‌ها خالی است" description="محصولات مورد علاقه خود را از صفحه محصولات به این لیست اضافه کنید." icon="wishlist" />
      </div>
    </main>
  );
}
