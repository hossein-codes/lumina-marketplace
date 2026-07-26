# Lumina Marketplace

فروشگاه آنلاین حرفه‌ای با استک مدرن.

## استک تکنولوژی

- Next.js 15.5.22 (App Router)
- React 19
- TypeScript 5.7 (strict)
- Tailwind CSS v4 (@tailwindcss/postcss)
- Prisma 6 + PostgreSQL (Neon)
- Zustand 5 (persist)
- @tanstack/react-query 5
- react-hook-form + zod
- bcryptjs + jsonwebtoken
- lucide-react
- framer-motion
- sonner
- tsx (seed)
- Vazirmatn font (CDN)

## ساختار پوشه‌ها

- `frontend/` روت پروژه
- `src/app/` صفحات و API routes
- `src/components/` کامپوننت‌ها
- `src/lib/` منطق و سرویس‌ها
- `prisma/` اسکیما و seed

## Deploy (Vercel + Neon)

1. متغیرهای محیطی `.env` را در Vercel تنظیم کنید.
2. `DATABASE_URL` و `DIRECT_URL` و `JWT_SECRET` را وارد کنید.
3. Root Directory را `frontend` انتخاب کنید.

## اجرای لوکال

```bash
npm install
npm run dev
```

## حساب‌های تست

- admin@lumina.ir / admin123 (ADMIN)
- seller@lumina.ir / seller123 (SELLER)
- user@lumina.ir / user1234 (CUSTOMER)

## API Endpoints

- `/api/health`
- `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- `/api/users/profile`, `/api/users/password`
- `/api/addresses`, `/api/addresses/[id]`
- `/api/products`, `/api/products/[slug]`
- `/api/categories`, `/api/categories/[slug]`
- `/api/brands`, `/api/brands/[slug]`
- `/api/cart`, `/api/cart/[itemId]`
- `/api/wishlist`, `/api/wishlist/[productId]`
- `/api/reviews`, `/api/reviews/me`, `/api/reviews/product/[productId]`
- `/api/orders`, `/api/orders/[id]`
- `/api/payments`, `/api/payments/order/[orderId]`, `/api/payments/[id]/confirm`
- `/api/admin/stats`, `/api/admin/users`, `/api/admin/users/[id]`, `/api/admin/orders`, `/api/admin/orders/[id]`

## صفحات

- `/` (خانه)
- `/shop`, `/product/[slug]`
- `/cart`, `/checkout`
- `/orders`, `/orders/[id]`
- `/wishlist`
- `/login`, `/register`
- `/profile`
- `/admin/*` (فقط ADMIN)
- `/seller/*` (SELLER یا ADMIN)

## اصول معماری

- Singleton Prisma برای serverless
- JWT در Bearer header
- Type-safe کامل با strict TypeScript
- Design System با CSS variables
- Responsive با MobileTabBar
- Guest mode برای سبد خرید و علاقه‌مندی‌ها
