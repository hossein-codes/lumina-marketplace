import Link from 'next/link';
import { Smartphone, Laptop, Headphones, Home, Shirt, Sparkles, Trophy, Plane } from 'lucide-react';

const categories = [
  { name: 'دیجیتال', slug: 'digital', icon: Sparkles, image: 'https://images.unsplash.com/photo-1518770660439-4636500cff5f?w=300&q=80' },
  { name: 'موبایل', slug: 'mobile', icon: Smartphone, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80' },
  { name: 'لپ‌تاپ', slug: 'laptop', icon: Laptop, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=80' },
  { name: 'صوتی', slug: 'audio-video', icon: Headphones, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80' },
  { name: 'خانه', slug: 'home-kitchen', icon: Home, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80' },
  { name: 'مد', slug: 'fashion', icon: Shirt, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80' },
  { name: 'زیبایی', slug: 'beauty-health', icon: Sparkles, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&q=80' },
  { name: 'ورزش', slug: 'sport-travel', icon: Trophy, image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=300&q=80' },
];

export function CategoryStrip() {
  return (
    <section className="py-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/shop?category=${cat.slug}`} className="group relative rounded-2xl overflow-hidden bg-[var(--surface-card)] border border-[var(--border-subtle)] hover:border-brand-300 hover:shadow-md transition-all">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="text-white font-bold text-sm drop-shadow-lg">{cat.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
