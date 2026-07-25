# Lumina Marketplace

فروشگاه آنلاین حرفه‌ای با معماری تمیز، طراحی مدرن و بک‌اند کامل.

## معماری

```
lumina-marketplace/
├── backend/               # Express + Prisma + PostgreSQL API
│   ├── config/            # پیکربندی مرکزی (env, jwt, cors)
│   ├── prisma/            # schema.prisma + seed.js
│   └── src/
│       ├── controllers/   # منطق دامنه
│       ├── middleware/    # auth + error handler
│       ├── routes/        # REST endpoints
│       └── server.js
│
└── frontend/              # Next.js 15 (App Router) + TS + Tailwind v4
    └── src/
        ├── app/           # همه صفحات (روت‌بندی مبتنی بر پوشه)
        ├── components/    # ui/ + layout/ + product/ + home/
        ├── lib/
        │   ├── api/       # کلاینت + سرویس‌های typed
        │   ├── stores/    # zustand (auth, cart, wishlist)
        │   ├── types/     # تایپ‌های مشترک با Prisma
        │   ├── helpers/   # helperهای دامنه
        │   └── utils/     # cn, format
        └── styles/        # globals.css + design tokens
```

## راه‌اندازی سریع (حتماً یک‌بار انجام شود)

نصب پکیج‌ها و راه‌اندازی هر دو سرور:

### ۱) بک‌اند

```bash
cd backend
cp .env.example .env      # مقادیر DATABASE_URL و JWT_SECRET را پر کنید
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed              # داده اولیه: کاربران، دسته‌بندی‌ها، برندها، محصولات
npm run dev               # روی http://localhost:4000
```

### ۲) فرانت‌اند (در ترمینال دیگر)

```bash
cd frontend
cp .env.example .env      # NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm install
npm run dev               # روی http://localhost:3000
```

فرانت‌اند به‌طور خودکار درخواست‌ها را از `/api/*` به بک‌اند پروکسی می‌کند (تنظیم در `next.config.mjs`).

## حساب‌های تست (پس از seed)

| نقش      | ایمیل              | رمز       |
| -------- | ------------------ | --------- |
| ادمین    | admin@lumina.ir    | admin123  |
| فروشنده  | seller@lumina.ir   | seller123 |
| مشتری    | user@lumina.ir     | user1234  |

## Design System

- **رنگ برند:** قرمز-گرم لومینا (`--color-brand-500: #ef394a`)
- **نوترال:** طیف slate از `ink-50` تا `ink-900`
- **فونت:** Vazirmatn (نسخه Variable، خودکار از CDN بارگذاری می‌شود)
- **توکن‌ها:** فایل `frontend/src/styles/globals.css` — همه رنگ‌ها، شعاع‌ها، سایه‌ها و سطح‌ها به‌عنوان CSS variableها.
- **حالت تیره:** روی `<html class="dark">` فعال می‌شود؛ همه توکن‌ها theme-aware هستند.
- **کامپوننت‌های پایه:** `Button`, `Input`, `Card`, `Badge`, `Rating`, `Price`, `Skeleton`, `Modal`, `EmptyState`.

## API endpointها (بک‌اند)

| منبع         | مسیر                                                                                    |
| ------------ | --------------------------------------------------------------------------------------- |
| Auth         | `POST /auth/register`، `POST /auth/login`، `GET /auth/me`                               |
| Users        | `GET/PUT /users/profile`، `PUT /users/password`                                         |
| Addresses    | `GET/POST /addresses`، `PUT/DELETE /addresses/:id`                                      |
| Products     | `GET /products` (page,limit,category,brand,search,sort)، `GET /products/:slug`، CRUD ادمین |
| Categories   | `GET /categories`، `GET /categories/:slug`، CRUD ادمین                                  |
| Brands       | `GET /brands`، `GET /brands/:slug`، CRUD ادمین                                          |
| Cart         | `GET/POST /cart`، `PUT/DELETE /cart/:itemId`، `DELETE /cart`                            |
| Wishlist     | `GET/POST /wishlist`، `DELETE /wishlist/:productId`                                     |
| Orders       | `POST/GET /orders`، `GET /orders/:id`                                                   |
| Reviews      | `GET /reviews/product/:productId`، `POST /reviews`، `GET /reviews/me`                   |
| Payments     | `POST /payments`، `PUT /payments/:id/confirm`، `GET /payments/order/:orderId`           |
| Admin        | `GET /admin/stats`, `GET/PUT /admin/users`, `GET/PUT /admin/orders`                     |

## صفحات فرانت‌اند

| مسیر                     | نقش‌ها                        |
| ------------------------ | ----------------------------- |
| `/`                      | Home + دسته‌بندی + بخش‌های محصول |
| `/shop`                  | لیست با فیلتر دسته/برند/سرچ/سورت |
| `/product/[slug]`        | جزئیات + گالری + نظرات + خرید |
| `/cart`                  | سبد خرید (guest + logged-in)   |
| `/checkout`              | ۳ مرحله: آدرس → پرداخت → تأیید (ثبت واقعی سفارش) |
| `/orders` و `/orders/[id]` | تاریخچه + جزئیات + ترکینگ    |
| `/wishlist`              | علاقه‌مندی‌ها                  |
| `/login` / `/register`   | ورود / ثبت‌نام                 |
| `/profile`               | اطلاعات + نشانی‌ها + امنیت     |
| `/admin/*`               | داشبورد + سفارش‌ها + کاربران + محصولات (فقط ADMIN) |
| `/seller/*`              | داشبورد فروشنده (SELLER/ADMIN) |

## اصول معماری

1. **جدایی کامل لایه‌ها:** UI → Stores → Services → API Client → Backend.
2. **همه‌چیز type-safe:** یک منبع تایپ در `lib/types/index.ts` که مستقیم از Prisma الگو گرفته.
3. **guest + auth بدون درد:** سبد و علاقه‌مندی در حالت مهمان روی localStorage، پس از ورود به سرور sync می‌شود.
4. **قابل توسعه بدون بازنویسی:** برای هر ماژول جدید فقط route/controller + service + page.
