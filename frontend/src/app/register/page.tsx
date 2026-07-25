'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Phone, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const change = <K extends keyof typeof form>(k: K, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success('ثبت‌نام موفق');
      router.replace('/');
    } catch (err) {
      toast.error((err as Error).message || 'ثبت‌نام ناموفق');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-10 max-w-md">
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6">
        <h1 className="text-xl font-black text-center mb-1">ایجاد حساب کاربری</h1>
        <p className="text-sm text-[var(--text-muted)] text-center mb-6">
          چند ثانیه، برای دسترسی به هزاران کالا
        </p>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="نام"
              value={form.firstName}
              onChange={(e) => change('firstName', e.target.value)}
              leftIcon={<User size={16} />}
              required
            />
            <Input
              label="نام خانوادگی"
              value={form.lastName}
              onChange={(e) => change('lastName', e.target.value)}
            />
          </div>
          <Input
            label="ایمیل"
            type="email"
            value={form.email}
            onChange={(e) => change('email', e.target.value)}
            leftIcon={<Mail size={16} />}
            required
          />
          <Input
            label="شماره موبایل"
            type="tel"
            value={form.phone}
            onChange={(e) => change('phone', e.target.value)}
            leftIcon={<Phone size={16} />}
          />
          <Input
            label="رمز عبور"
            type="password"
            value={form.password}
            onChange={(e) => change('password', e.target.value)}
            leftIcon={<Lock size={16} />}
            hint="حداقل ۶ کاراکتر"
            required
          />
          <Button fullWidth size="lg" type="submit" loading={loading}>
            ثبت‌نام
          </Button>
        </form>
        <div className="text-center text-sm text-[var(--text-muted)] mt-4">
          حساب دارید؟{' '}
          <Link href="/login" className="text-[var(--color-brand-600)] font-bold">
            وارد شوید
          </Link>
        </div>
      </div>
    </div>
  );
}
