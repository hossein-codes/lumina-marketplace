import type { Metadata } from 'next';
import '../styles/globals.css';
import { Toaster } from 'sonner';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'لومینا مارکت | فروشگاه آنلاین حرفه‌ای',
  description: 'فروشگاه آنلاین حرفه‌ای با بهترین قیمت‌ها و ارسال سریع',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />
      </head>
      <body className="font-vazirmatn bg-[var(--surface-page)] text-[var(--text-primary)] antialiased min-h-screen">
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
