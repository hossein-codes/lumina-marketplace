import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileTabBar } from '@/components/layout/MobileTabBar';

export const metadata: Metadata = {
  title: {
    default: 'لومینا — فروشگاه آنلاین',
    template: '%s | لومینا',
  },
  description:
    'لومینا، تجربه‌ای مدرن از خرید آنلاین؛ محصولات دیجیتال، پوشاک، خانه و آشپزخانه با ارسال سریع.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    siteName: 'لومینا',
  },
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  themeColor: '#ef394a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body>
        <Providers>
          <Header />
          <main className="min-h-[calc(100vh-4rem)] pb-24 md:pb-8">{children}</main>
          <Footer />
          <MobileTabBar />
        </Providers>
      </body>
    </html>
  );
}
