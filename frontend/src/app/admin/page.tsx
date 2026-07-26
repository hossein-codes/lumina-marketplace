import { Card, CardHeader, CardBody, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function AdminPage() {
  return (
    <main className="container-page py-8 md:py-12">
      <h1 className="text-3xl font-black text-[var(--text-primary)] mb-8">داشبورد ادمین</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card><CardHeader><CardTitle>کاربران</CardTitle></CardHeader><CardBody><p className="text-3xl font-black text-brand-600">۱۲۳</p><p className="text-xs text-[var(--text-muted)]">کاربر ثبت‌نام شده</p></CardBody></Card>
        <Card><CardHeader><CardTitle>محصولات</CardTitle></CardHeader><CardBody><p className="text-3xl font-black text-brand-600">۱۳</p><p className="text-xs text-[var(--text-muted)]">محصول فعال</p></CardBody></Card>
        <Card><CardHeader><CardTitle>سفارش‌ها</CardTitle></CardHeader><CardBody><p className="text-3xl font-black text-brand-600">۴۵</p><p className="text-xs text-[var(--text-muted)]">سفارش ثبت شده</p></CardBody></Card>
        <Card><CardHeader><CardTitle>درآمد</CardTitle></CardHeader><CardBody><p className="text-3xl font-black text-brand-600">۹۸۵,۰۰۰,۰۰۰</p><p className="text-xs text-[var(--text-muted)]">تومان</p></CardBody></Card>
      </div>
    </main>
  );
}
