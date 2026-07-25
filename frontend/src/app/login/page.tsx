'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/stores/authStore';
import { useCartStore } from '@/lib/stores/cartStore';
import { useWishlistStore } from '@/lib/stores/wishlistStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = sp.get('redirect') || '/';
  const login = useAuthStore((s) => s.login);
  const syncCart = useCartStore((s) => s.syncGuestCartToServer);
  const fetchWishlist = useWishlistStore((s) => s.fetch);
  const [email, setEmail] = useState('user@lumina.ir');
  const [password, setPassword] = useState('user1234');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      await syncCart();
      await fetchWishlist();
      toast.success('ورود موفق');
      router.replace(redirect);
    } catch (err) {
      toast.error((err as Error).message || 'ورود ناموفق');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-10 max-w-md">
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6">
        <h1 className="text-xl font-black text-center mb-1">ورود به لومینا</h1>
        <p className="text-sm text-[var(--text-muted)] text-center mb-6">
          به دنیای خرید هوشمند خوش آمدید
        </p>
        <form onSubmit={submit} className="space-y-4">
          <Input
            label="ایمیل"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={16} />}
            required
          />
          <Input
            label="رمز عبور"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock size={16} />}
            required
          />
          <Button fullWidth size="lg" type="submit" loading={loading}>
            ورود
          </Button>
        </form>
        <div className="text-center text-sm text-[var(--text-muted)] mt-4">
          حساب کاربری ندارید؟{' '}
          <Link href="/register" className="text-[var(--color-brand-600)] font-bold">
            ثبت‌نام کنید
          </Link>
        </div>
        <div className="mt-6 p-3 rounded-lg bg-[var(--surface-muted)] text-xs text-[var(--text-muted)] leading-6">
          <div className="font-bold text-[var(--text-secondary)] mb-1">حساب‌های نمونه:</div>
          مشتری: user@lumina.ir / user1234<br />
          فروشنده: seller@lumina.ir / seller123<br />
          ادمین: admin@lumina.ir / admin123
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
