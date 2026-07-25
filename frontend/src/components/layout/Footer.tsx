import Link from 'next/link';
import { Instagram, Send, Youtube } from 'lucide-react';

const groups = [
  {
    title: 'با لومینا',
    items: [
      { label: 'درباره ما', href: '/about' },
      { label: 'تماس با ما', href: '/contact' },
      { label: 'فرصت‌های شغلی', href: '/careers' },
      { label: 'وبلاگ', href: '/blog' },
    ],
  },
  {
    title: 'خدمات مشتریان',
    items: [
      { label: 'راهنمای خرید', href: '/help/shopping' },
      { label: 'رویه ارسال', href: '/help/shipping' },
      { label: 'رویه بازگشت کالا', href: '/help/returns' },
      { label: 'سوالات متداول', href: '/help/faq' },
    ],
  },
  {
    title: 'راهنمای خرید',
    items: [
      { label: 'نحوه ثبت سفارش', href: '/help/how-to-order' },
      { label: 'روش‌های پرداخت', href: '/help/payment' },
      { label: 'ارسال کالا', href: '/help/delivery' },
      { label: 'شرایط استفاده', href: '/help/terms' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-[var(--surface-card)] border-t border-[var(--border-subtle)]">
      <div className="container-page py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-lg bg-[var(--color-brand-500)] text-white grid place-items-center font-black">
              L
            </span>
            <span className="font-black text-lg">لومینا</span>
          </div>
          <p className="text-sm text-[var(--text-muted)] leading-6">
            تجربه‌ای حرفه‌ای از خرید آنلاین با ضمانت اصالت کالا و ارسال سریع.
          </p>
          <div className="flex items-center gap-3 mt-4 text-[var(--text-muted)]">
            <a href="#" aria-label="Instagram" className="hover:text-[var(--color-brand-500)]">
              <Instagram size={20} />
            </a>
            <a href="#" aria-label="Telegram" className="hover:text-[var(--color-brand-500)]">
              <Send size={20} />
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-[var(--color-brand-500)]">
              <Youtube size={20} />
            </a>
          </div>
        </div>

        {groups.map((g) => (
          <div key={g.title}>
            <h4 className="font-bold text-sm mb-3">{g.title}</h4>
            <ul className="space-y-2">
              {g.items.map((i) => (
                <li key={i.href}>
                  <Link
                    href={i.href}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--color-brand-500)]"
                  >
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--border-subtle)]">
        <div className="container-page py-4 text-xs text-[var(--text-muted)] flex flex-wrap items-center gap-2 justify-between">
          <span>© {new Date().getFullYear()} فروشگاه لومینا — همه حقوق محفوظ است.</span>
          <span>ساخته‌شده با ❤ در ایران</span>
        </div>
      </div>
    </footer>
  );
}
