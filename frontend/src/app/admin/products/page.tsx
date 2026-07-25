'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { brandService, categoryService, productService } from '@/lib/api/services';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatPrice, slugify } from '@/lib/utils/format';

export default function AdminProductsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => (await productService.list({ limit: 100 })).data ?? [],
  });
  const categoriesQ = useQuery({ queryKey: ['categories'], queryFn: async () => (await categoryService.list()).data ?? [] });
  const brandsQ = useQuery({ queryKey: ['brands'], queryFn: async () => (await brandService.list()).data ?? [] });

  const remove = useMutation({
    mutationFn: (id: string) => productService.remove(id),
    onSuccess: () => {
      toast.success('محصول غیرفعال شد');
      qc.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const create = useMutation({
    mutationFn: (payload: any) => productService.create(payload),
    onSuccess: () => {
      toast.success('محصول ایجاد شد');
      setOpen(false);
      qc.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-black">مدیریت محصولات</h1>
        <Button leftIcon={<Plus size={16} />} onClick={() => setOpen(true)}>افزودن محصول</Button>
      </div>

      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface-muted)] text-[var(--text-muted)] text-xs">
            <tr>
              <th className="text-right p-3">محصول</th>
              <th className="text-right p-3">دسته</th>
              <th className="text-right p-3">قیمت</th>
              <th className="text-right p-3">موجودی</th>
              <th className="text-right p-3">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((p) => (
              <tr key={p.id} className="border-t border-[var(--border-subtle)]">
                <td className="p-3 flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[var(--surface-muted)] shrink-0">
                    <Image src={p.thumbnail} alt="" fill sizes="40px" className="object-cover" />
                  </div>
                  <span className="line-clamp-1">{p.title}</span>
                </td>
                <td className="p-3 text-xs">{p.category?.name}</td>
                <td className="p-3 font-num">{formatPrice(Number(p.price))}</td>
                <td className="p-3 font-num">{p.stock}</td>
                <td className="p-3">
                  <button
                    onClick={() => remove.mutate(p.id)}
                    className="text-[var(--color-danger-500)]"
                    aria-label="حذف"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="افزودن محصول جدید">
        <ProductForm
          categories={categoriesQ.data ?? []}
          brands={brandsQ.data ?? []}
          onSubmit={(payload) => create.mutate(payload)}
          loading={create.isPending}
        />
      </Modal>
    </div>
  );
}

function ProductForm({
  categories,
  brands,
  onSubmit,
  loading,
}: {
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
  onSubmit: (payload: any) => void;
  loading?: boolean;
}) {
  const [f, setF] = useState({
    title: '',
    slug: '',
    description: '',
    price: '',
    stock: '',
    discountPercentage: '',
    thumbnail: '',
    categoryId: categories[0]?.id ?? '',
    brandId: brands[0]?.id ?? '',
  });

  return (
    <div className="p-5 space-y-3">
      <Input label="عنوان" value={f.title} onChange={(e) => setF((x) => ({ ...x, title: e.target.value, slug: slugify(e.target.value) }))} />
      <Input label="Slug (شناسه انگلیسی)" value={f.slug} onChange={(e) => setF((x) => ({ ...x, slug: e.target.value }))} />
      <textarea
        placeholder="توضیحات"
        value={f.description}
        onChange={(e) => setF((x) => ({ ...x, description: e.target.value }))}
        rows={3}
        className="w-full rounded-lg border border-[var(--border-default)] p-3 text-sm bg-[var(--surface-card)] outline-none focus:border-[var(--color-brand-500)]"
      />
      <div className="grid grid-cols-3 gap-3">
        <Input label="قیمت (تومان)" type="number" value={f.price} onChange={(e) => setF((x) => ({ ...x, price: e.target.value }))} />
        <Input label="موجودی" type="number" value={f.stock} onChange={(e) => setF((x) => ({ ...x, stock: e.target.value }))} />
        <Input label="تخفیف ٪" type="number" value={f.discountPercentage} onChange={(e) => setF((x) => ({ ...x, discountPercentage: e.target.value }))} />
      </div>
      <Input label="لینک تصویر شاخص" value={f.thumbnail} onChange={(e) => setF((x) => ({ ...x, thumbnail: e.target.value }))} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">دسته‌بندی</label>
          <select
            value={f.categoryId}
            onChange={(e) => setF((x) => ({ ...x, categoryId: e.target.value }))}
            className="mt-1.5 w-full h-10 rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] px-3 text-sm"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">برند</label>
          <select
            value={f.brandId}
            onChange={(e) => setF((x) => ({ ...x, brandId: e.target.value }))}
            className="mt-1.5 w-full h-10 rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] px-3 text-sm"
          >
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>
      <Button
        fullWidth
        loading={loading}
        onClick={() =>
          onSubmit({
            ...f,
            price: Number(f.price),
            stock: Number(f.stock),
            discountPercentage: f.discountPercentage ? Number(f.discountPercentage) : null,
            images: [],
            tags: [],
          })
        }
        disabled={!f.title || !f.slug || !f.price || !f.categoryId || !f.thumbnail}
      >
        ذخیره محصول
      </Button>
    </div>
  );
}
