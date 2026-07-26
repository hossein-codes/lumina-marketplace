"use client";
import { useState } from 'react';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('token', data.data.token);
        router.push('/');
      } else {
        alert(data.error || 'خطا در ثبت‌نام');
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
          <h1 className="text-2xl font-black text-[var(--text-primary)] mb-2">ثبت‌نام در لومینا</h1>
          <p className="text-sm text-[var(--text-muted)]">به خانواده بزرگ لومینا بپیوندید</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="نام" placeholder="نام" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <Input label="نام خانوادگی" placeholder="نام خانوادگی" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <Input label="ایمیل" type="email" placeholder="example@lumina.ir" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="تلفن" placeholder="۰۹۱۲..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="رمز عبور" type={showPass ? 'text' : 'password'} placeholder="حداقل ۶ کاراکتر" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} rightIcon={<button type="button" onClick={() => setShowPass(!showPass)} className="text-ink-400 hover:text-ink-600">{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} />
          <Button type="submit" loading={loading} size="lg" className="w-full mt-2"><UserPlus className="w-4 h-4" /> ثبت‌نام</Button>
        </form>
        <p className="text-center text-sm text-[var(--text-muted)] mt-6">قبلاً ثبت‌نام کرده‌اید؟ <Link href="/login" className="text-brand-600 hover:text-brand-700 font-medium">ورود</Link></p>
      </div>
    </main>
  );
}
