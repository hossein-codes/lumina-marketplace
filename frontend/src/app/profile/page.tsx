'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, MapPin, Package, Settings, ShieldCheck, User } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores/authStore';
import { addressService, userService } from '@/lib/api/services';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type Tab = 'profile' | 'addresses' | 'security';

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const setUser = useAuthStore((s) => s.setUser);
  const [tab, setTab] = useState<Tab>('profile');

  useEffect(() => {
    if (!user) router.replace('/login?redirect=/profile');
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="container-page py-6">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-5">
        <aside className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-3 h-fit">
          <div className="flex items-center gap-3 p-3 border-b border-[var(--border-subtle)] mb-2">
            <div className="w-12 h-12 rounded-full bg-[var(--color-brand-500)] text-white grid place-items-center font-black">
              {user.firstName?.[0] || '?'}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm truncate">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-xs text-[var(--text-muted)] truncate">{user.email}</div>
            </div>
          </div>
          <NavItem active={tab === 'profile'} icon={<User size={16} />} onClick={() => setTab('profile')}>
            اطلاعات شخصی
          </NavItem>
          <NavItem active={tab === 'addresses'} icon={<MapPin size={16} />} onClick={() => setTab('addresses')}>
            نشانی‌ها
          </NavItem>
          <NavLink href="/orders" icon={<Package size={16} />}>
            سفارش‌ها
          </NavLink>
          <NavItem
            active={tab === 'security'}
            icon={<ShieldCheck size={16} />}
            onClick={() => setTab('security')}
          >
            امنیت
          </NavItem>
          {user.role === 'ADMIN' && (
            <NavLink href="/admin" icon={<Settings size={16} />}>
              پنل مدیریت
            </NavLink>
          )}
          {(user.role === 'SELLER' || user.role === 'ADMIN') && (
            <NavLink href="/seller" icon={<Settings size={16} />}>
              پنل فروشنده
            </NavLink>
          )}
          <button
            onClick={() => {
              logout();
              router.replace('/');
            }}
            className="w-full flex items-center gap-2 text-sm px-3 py-2 rounded-lg text-[var(--color-danger-500)] hover:bg-rose-50 mt-2"
          >
            <LogOut size={16} /> خروج
          </button>
        </aside>

        <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5">
          {tab === 'profile' && <ProfileForm user={user} onUpdate={setUser} />}
          {tab === 'addresses' && <AddressesTab />}
          {tab === 'security' && <SecurityTab />}
        </section>
      </div>
    </div>
  );
}

function NavItem({
  active,
  icon,
  children,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors ${
        active
          ? 'bg-[var(--color-brand-50)] text-[var(--color-brand-700)] font-bold'
          : 'hover:bg-[var(--surface-muted)] text-[var(--text-secondary)]'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="w-full flex items-center gap-2 text-sm px-3 py-2 rounded-lg hover:bg-[var(--surface-muted)] text-[var(--text-secondary)]"
    >
      {icon}
      {children}
    </Link>
  );
}

function ProfileForm({ user, onUpdate }: { user: NonNullable<ReturnType<typeof useAuthStore>['getState'] extends never ? never : any>; onUpdate: (u: any) => void }) {
  const [form, setForm] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phone: user.phone || '',
  });
  const mut = useMutation({
    mutationFn: () => userService.updateProfile(form),
    onSuccess: (res) => {
      onUpdate(res.data);
      toast.success('اطلاعات ذخیره شد');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <h2 className="font-bold mb-4">اطلاعات شخصی</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input label="نام" value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} />
        <Input label="نام خانوادگی" value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} />
        <Input label="ایمیل" value={user.email} disabled />
        <Input label="موبایل" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={() => mut.mutate()} loading={mut.isPending}>ذخیره تغییرات</Button>
      </div>
    </div>
  );
}

function AddressesTab() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => (await addressService.list()).data ?? [],
  });
  const [form, setForm] = useState({ label: '', street: '', city: '', province: '', zipCode: '', country: 'IR', isDefault: false });
  const create = useMutation({
    mutationFn: () => addressService.create(form),
    onSuccess: async () => {
      toast.success('نشانی اضافه شد');
      setForm({ label: '', street: '', city: '', province: '', zipCode: '', country: 'IR', isDefault: false });
      await qc.invalidateQueries({ queryKey: ['addresses'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: (id: string) => addressService.remove(id),
    onSuccess: async () => {
      toast.success('نشانی حذف شد');
      await qc.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  return (
    <div>
      <h2 className="font-bold mb-4">نشانی‌ها</h2>
      <div className="space-y-2 mb-6">
        {(data ?? []).map((a) => (
          <div key={a.id} className="flex items-start justify-between gap-3 rounded-xl border border-[var(--border-subtle)] p-3">
            <div className="text-sm">
              <div className="font-bold flex items-center gap-2">
                {a.label || 'نشانی'}
                {a.isDefault && <span className="text-[10px] bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5">پیش‌فرض</span>}
              </div>
              <div className="text-[var(--text-muted)] text-xs mt-0.5">
                {a.province}، {a.city}، {a.street} — کد پستی: {a.zipCode}
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => remove.mutate(a.id)}>حذف</Button>
          </div>
        ))}
        {(data ?? []).length === 0 && <div className="text-sm text-[var(--text-muted)]">نشانی‌ای ثبت نشده.</div>}
      </div>

      <h3 className="font-bold mb-2">افزودن نشانی جدید</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input label="عنوان" value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} />
        <Input label="استان" value={form.province} onChange={(e) => setForm((f) => ({ ...f, province: e.target.value }))} />
        <Input label="شهر" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
        <Input label="کد پستی" value={form.zipCode} onChange={(e) => setForm((f) => ({ ...f, zipCode: e.target.value }))} />
        <div className="md:col-span-2">
          <Input label="نشانی کامل" value={form.street} onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))} />
        </div>
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))} className="accent-[var(--color-brand-500)]" />
          نشانی پیش‌فرض
        </label>
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={() => create.mutate()} loading={create.isPending} disabled={!form.street || !form.city}>
          افزودن نشانی
        </Button>
      </div>
    </div>
  );
}

function SecurityTab() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const mut = useMutation({
    mutationFn: () => userService.changePassword(form),
    onSuccess: () => {
      toast.success('رمز عبور تغییر یافت');
      setForm({ currentPassword: '', newPassword: '' });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <div>
      <h2 className="font-bold mb-4">تغییر رمز عبور</h2>
      <div className="space-y-3 max-w-md">
        <Input label="رمز فعلی" type="password" value={form.currentPassword} onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))} />
        <Input label="رمز جدید" type="password" value={form.newPassword} onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))} />
        <Button onClick={() => mut.mutate()} loading={mut.isPending} disabled={!form.currentPassword || form.newPassword.length < 6}>
          ذخیره
        </Button>
      </div>
    </div>
  );
}
