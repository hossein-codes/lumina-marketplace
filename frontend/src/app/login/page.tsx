"use client";
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('token', data.data.token);
        router.push(redirect);
      } else {
        alert(data.error || 'خطا در ورود');
      }
    } catch {
      alert('خطا در ارتباط');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-[var(--text-primary)] mb-2">ورود به حساب کاربری</h1>
          <p className="text-sm text-[var(--text-muted)]">به فروشگاه لومینا خوش آمدید</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="ایمیل" type="email" placeholder="example@lumina.ir" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="رمز عبور" type={showPass ? 'text' : 'password'} placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} rightIcon={<button type="button" onClick={() => setShowPass(!showPass)} className="text-ink-400 hover:text-ink-600">{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} required />
          <Button type="submit" loading={loading} size="lg" className="w-full mt-2"><LogIn className="w-4 h-4" /> ورود</Button>
        </form>

        <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
          <p className="text-xs text-[var(--text-muted)] text-center mb-3">حساب‌های آزمایشی:</p>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div className="bg-[var(--surface-muted)] rounded-lg p-2 text-center"><div className="font-bold text-brand-600">مدیر</div><div className="text-[var(--text-muted)]">admin123</div></div>
            <div className="bg-[var(--surface-muted)] rounded-lg p-2 text-center"><div className="font-bold text-brand-600">فروشنده</div><div className="text-[var(--text-muted)]">seller123</div></div>
            <div className="bg-[var(--surface-muted)] rounded-lg p-2 text-center"><div className="font-bold text-brand-600">کاربر</div><div className="text-[var(--text-muted)]">user1234</div></div>
          </div>
        </div>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">حساب کاربری ندارید؟ <Link href="/register" className="text-brand-600 hover:text-brand-700 font-medium">ثبت‌نام کنید</Link></p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">در حال بارگذاری...</div>}>
      <LoginContent />
    </Suspense>
  );
}
