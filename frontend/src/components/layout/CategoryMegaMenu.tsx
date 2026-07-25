'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import { categoryService } from '@/lib/api/services';

export function CategoryMegaMenu() {
  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await categoryService.list()).data ?? [],
    staleTime: 5 * 60_000,
  });

  const categories = (data ?? []).slice(0, 8);

  return (
    <nav className="flex items-center gap-2 h-11 overflow-x-auto scrollbar-none">
      <Link
        href="/shop"
        className="px-3 h-9 text-sm font-medium rounded-md flex items-center gap-1.5 hover:bg-[var(--surface-muted)] text-[var(--color-brand-600)]"
      >
        همه دسته‌ها
        <ChevronDown size={14} />
      </Link>
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`/shop?category=${c.slug}`}
          className="px-3 h-9 text-sm rounded-md flex items-center whitespace-nowrap hover:bg-[var(--surface-muted)] text-[var(--text-secondary)]"
        >
          {c.name}
        </Link>
      ))}
    </nav>
  );
}
