import { Card, CardHeader, CardBody, CardTitle } from '@/components/ui/Card';

export default function SellerPage() {
  return (
    <main className="container-page py-8 md:py-12">
      <h1 className="text-3xl font-black text-[var(--text-primary)] mb-8">داشبورد فروشنده</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card><CardHeader><CardTitle>محصولات من</CardTitle></CardHeader><CardBody><p className="text-3xl font-black text-brand-600">۸</p></CardBody></Card>
        <Card><CardHeader><CardTitle>سفارش‌ها</CardTitle></CardHeader><CardBody><p className="text-3xl font-black text-brand-600">۱۵</p></CardBody></Card>
        <Card><CardHeader><CardTitle>درآمد</CardTitle></CardHeader><CardBody><p className="text-3xl font-black text-brand-600">۴۲,۰۰۰,۰۰۰</p></CardBody></Card>
      </div>
    </main>
  );
}
