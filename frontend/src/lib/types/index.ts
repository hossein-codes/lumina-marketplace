/**
 * Shared TypeScript types that mirror the backend Prisma models.
 * Keep in sync with backend/prisma/schema.prisma
 */

export type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  avatar?: string | null;
  role: UserRole;
  isActive?: boolean;
  emailVerified?: boolean;
  createdAt?: string;
  addresses?: Address[];
}

export interface Address {
  id: string;
  userId: string;
  label?: string | null;
  street: string;
  city: string;
  province: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parentId?: string | null;
  parent?: Category | null;
  children?: Category[];
  _count?: { products: number };
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  _count?: { products: number };
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user?: { firstName: string; lastName?: string | null };
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number | string;
  discountPercentage?: number | string | null;
  thumbnail: string;
  images: string[];
  brandId?: string | null;
  categoryId: string;
  stock: number;
  isActive: boolean;
  isNew: boolean;
  isFlashSale: boolean;
  rating: number | string;
  reviewCount: number;
  sku?: string | null;
  weight?: number | string | null;
  dimensions?: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  brand?: Brand | null;
  category?: Category;
  reviews?: Review[];
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product?: Product;
}

export interface Cart {
  id?: string;
  userId?: string;
  items: CartItem[];
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product?: Product;
  createdAt: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentMethod = 'CASH_ON_DELIVERY' | 'BANK_TRANSFER' | 'CARD' | 'WALLET';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number | string;
  totalPrice: number | string;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number | string;
  shippingCost: number | string;
  taxAmount: number | string;
  totalAmount: number | string;
  currency: string;
  shippingAddressId?: string | null;
  billingAddressId?: string | null;
  paymentMethod?: PaymentMethod | null;
  trackingCode?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user?: Pick<User, 'email' | 'firstName' | 'lastName'>;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number | string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number };
}

export interface AdminStats {
  users: number;
  products: number;
  orders: number;
  revenue: number;
  ordersByStatus: { status: OrderStatus; _count: { _all: number } }[];
  topProducts: Pick<Product, 'id' | 'title' | 'slug' | 'thumbnail' | 'price' | 'rating' | 'stock'>[];
}
