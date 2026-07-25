# Lumina Backend — Professional API

## Architecture
- **Framework:** Express.js + Node.js
- **ORM:** Prisma
- **Database:** PostgreSQL (full relational, ACID-compliant)
- **Auth:** JWT + bcrypt (12 rounds)
- **Security:** Helmet, CORS, Rate Limiting

## Folder Structure
```
backend/
├── config/          # Central config (DB, JWT, CORS)
├── prisma/
│   ├── schema.prisma  # Full relational model (User, Product, Order, Cart, Review...)
│   └── seed.js      # Real seed data
├── src/
│   ├── controllers/  # Business logic layer
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth, Error handling, Rate limit
│   ├── server.js     # Main server entry
│   └── services/     # (Ready for complex business rules)
```

## Database Schema (Principled)
- **Users** with roles (CUSTOMER / SELLER / ADMIN)
- **Products** with brands, categories, reviews, inventory tracking
- **Orders** with full order lifecycle (PENDING → SHIPPED → DELIVERED)
- **Cart & Wishlist** per user
- **Payments** with transaction tracking
- **Addresses** reusable per user

## API Endpoints
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products` (with pagination, filter, search)
- `GET /api/products/:slug`
- `POST /api/orders` (authenticated)
- `GET /api/users/profile`

## Setup
```bash
cd backend
npm install
# Configure DATABASE_URL in .env (PostgreSQL)
npx prisma migrate dev
node prisma/seed.js
npm run dev
```

This backend is built to be expanded: you can add payments gateways, SMS services, analytics, and multi-vendor support without restructuring.
