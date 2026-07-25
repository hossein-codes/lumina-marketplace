'use client';

import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Filter, X } from 'lucide-react';
import {
  brandService,
  categoryService,
  productService,
  type ProductListParams,
} from '@/lib/api/services';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/Button';

function ShopContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const params: ProductListParams = useMemo(
    () => ({
      page: Number(sp.get('page') ?? 1),
      limit: 20,
      category: sp.get('category') ?? undefined,
      brand: sp.get('brand') ?? undefined,
      search: sp.get('search') ?? undefined,
      sort: (sp.get('sort') as ProductListParams['sort']) ?? 'createdAt',
    }),
    [sp]
  );

  const productsQ = useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.list(params),
  });

  const categoriesQ = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await categoryService.list()).data ?? [],
    staleTime: 5 * 60_000,
  });

  const brandsQ = useQuery({
    queryKey: ['brands'],
    queryFn: async () => (await brandService.list()).data ?? [],
    staleTime: 5 * 60_000,
  });

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(sp.toString());
    if (value === null || value === '') next.delete(key);
    else next.set(key, value);
    next.delete('page');
    router.push(`/shop?${next.toString()}`);
  };

  const clearAll = () => router.push('/shop');
  const total = productsQ.data?.meta?.total ?? 0;

  const activeChips = Array.from(sp.entries()).filter(([k]) =>
    ['category', 'brand', 'search'].includes(k)
  );

  return (
    <div className="container-page py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar filters — desktop */}
        <aside className="hidden lg:block sticky top-24 self-start">
          <FiltersPanel
            categories={categoriesQ.data ?? []}
            brands={brandsQ.data ?? []}
            selectedCategory={params.category}
            selectedBrand={params.brand}
            onChangeCategory={(v) => set('category', v)}
            onChangeBrand={(v) => set('brand', v)}
            onClear={clearAll}
          />
        </aside>

        <div>
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="text-lg md:text-2xl font-black">فروشگاه</h1>
              <p className="text-xs text-[var(--text-muted)] mt-1 font-num">
                {total} کالا یافت شد
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={params.sort}
                onChange={(e) => set('sort', e.target.value)}
                className="h-10 rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] px-3 text-sm"
              >
                <option value="createdAt">جدیدترین</option>
                <option value="price">قیمت</option>
                <option value="rating">محبوب‌ترین</option>
              </select>
              <Button
                variant="outline"
                size="md"
                leftIcon={<Filter size={16} />}
                onClick={() => setShowFilters(true)}
                className="lg:hidden"
              >
                فیلترها
              </Button>
            </div>
          </div>

          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {activeChips.map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => set(k, null)}
                  className="inline-flex items-center gap-1 px-3 h-8 rounded-full text-xs bg-[var(--color-brand-50)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]"
                >
                  {v}
                  <X size={12} />
                </button>
              ))}
              <button
                onClick={clearAll}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--color-brand-500)] mr-2"
              >
                پاک کردن همه
              </button>
            </div>
          )}

          <ProductGrid
            products={productsQ.data?.data}
            loading={productsQ.isLoading}
            emptyMessage="با فیلترهای فعلی کالایی پیدا نشد"
          />

          {/* Mobile filters bottom sheet */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowFilters(false)}
              />
              <div className="absolute inset-x-0 bottom-0 bg-[var(--surface-card)] rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold">فیلترها</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X size={20} />
                  </button>
                </div>
                <FiltersPanel
                  categories={categoriesQ.data ?? []}
                  brands={brandsQ.data ?? []}
                  selectedCategory={params.category}
                  selectedBrand={params.brand}
                  onChangeCategory={(v) => set('category', v)}
                  onChangeBrand={(v) => set('brand', v)}
                  onClear={clearAll}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FiltersPanel({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  onChangeCategory,
  onChangeBrand,
  onClear,
}: {
  categories: { id: string; name: string; slug: string }[];
  brands: { id: string; name: string; slug: string }[];
  selectedCategory?: string;
  selectedBrand?: string;
  onChangeCategory: (v: string | null) => void;
  onChangeBrand: (v: string | null) => void;
  onClear: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">فیلترها</h3>
        <button
          onClick={onClear}
          className="text-xs text-[var(--color-brand-600)] font-medium"
        >
          پاک کردن
        </button>
      </div>

      <FilterGroup title="دسته‌بندی">
        {categories.map((c) => (
          <FilterCheckbox
            key={c.id}
            label={c.name}
            checked={selectedCategory === c.slug}
            onChange={(chk) => onChangeCategory(chk ? c.slug : null)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="برند">
        {brands.map((b) => (
          <FilterCheckbox
            key={b.id}
            label={b.name}
            checked={selectedBrand === b.slug}
            onChange={(chk) => onChangeBrand(chk ? b.slug : null)}
          />
        ))}
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-[var(--surface-card)] border border-[var(--border-subtle)] p-4">
      <h4 className="text-sm font-bold mb-3">{title}</h4>
      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">{children}</div>
    </div>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm py-1 hover:text-[var(--color-brand-600)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-[var(--color-brand-500)]"
      />
      <span>{label}</span>
    </label>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-page py-6">در حال بارگذاری...</div>}>
      <ShopContent />
    </Suspense>
  );
}
