import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-100 mt-auto">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-black text-brand-400 tracking-tighter">LUMINA</Link>
            <p className="text-sm text-ink-400 mt-3 leading-relaxed max-w-md">فروشگاه آنلاین حرفه‌ای با بهترین برندها، قیمت‌های رقابتی و ارسال سریع به سراسر کشور. تجربه خریدی مطمئن با لومینا.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">دسترسی سریع</h4>
            <ul className="space-y-2 text-sm text-ink-400">
              <li><Link href="/shop" className="hover:text-brand-400 transition-colors">فروشگاه</Link></li>
              <li><Link href="/cart" className="hover:text-brand-400 transition-colors">سبد خرید</Link></li>
              <li><Link href="/profile" className="hover:text-brand-400 transition-colors">حساب کاربری</Link></li>
              <li><Link href="/orders" className="hover:text-brand-400 transition-colors">سفارش‌ها</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">دسته‌بندی‌ها</h4>
            <ul className="space-y-2 text-sm text-ink-400">
              <li><Link href="/shop?category=digital" className="hover:text-brand-400 transition-colors">دیجیتال</Link></li>
              <li><Link href="/shop?category=mobile" className="hover:text-brand-400 transition-colors">موبایل</Link></li>
              <li><Link href="/shop?category=laptop" className="hover:text-brand-400 transition-colors">لپ‌تاپ</Link></li>
              <li><Link href="/shop?category=fashion" className="hover:text-brand-400 transition-colors">مد و پوشاک</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-ink-800 mt-10 pt-6 text-xs text-ink-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>© ۲۰۲۶ لومینا مارکت. تمامی حقوق محفوظ است.</span>
          <span>طراحی شده با ❤️ در تهران</span>
        </div>
      </div>
    </footer>
  );
}
