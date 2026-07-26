"use client";
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AdminProductsPage() {
  const [open, setOpen] = useState(false);
  return (
    <main className="container-page py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-[var(--text-primary)]">محصولات</h1>
        <Button onClick={() => setOpen(true)}>افزودن محصول</Button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="افزودن محصول جدید">
        <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); setOpen(false); }}>
          <Input label="عنوان" placeholder="عنوان محصول" />
          <Input label="slug" placeholder="slug" />
          <Input label="قیمت" type="number" placeholder="قیمت" />
          <Input label="موجودی" type="number" placeholder="موجودی" />
          <Button type="submit">ذخیره</Button>
        </form>
      </Modal>
      <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-sm">
        <p className="text-sm text-[var(--text-muted)]">لیست محصولات در این بخش نمایش داده می‌شود.</p>
      </div>
    </main>
  );
}
