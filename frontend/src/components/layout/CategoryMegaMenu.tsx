import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export function CategoryMegaMenu() {
  const [open, setOpen] = useState(false);
  const categories = [
    { name: 'دیجیتال', slug: 'digital' },
    { name: 'موبایل', slug: 'mobile' },
    { name: 'لپ‌تاپ', slug: 'laptop' },
    { name: 'صوتی و تصویری', slug: 'audio-video' },
    { name: 'خانه و آشپزخانه', slug: 'home-kitchen' },
    { name: 'مد و پوشاک', slug: 'fashion' },
    { name: 'زیبایی و سلامت', slug: 'beauty-health' },
    { name: 'ورزش و سفر', slug: 'sport-travel' },
  ];

  return (
    <div className="relative hidden md:block">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1 text-sm font-medium text-[var(--text-primary)] hover:text-brand-600 transition-colors py-2">
        دسته‌بندی‌ها <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-2xl shadow-xl p-3 z-50">
          <div className="grid gap-1">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/shop?category=${cat.slug}`} onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-brand-50 hover:text-brand-700 transition-colors">{cat.name}</Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
