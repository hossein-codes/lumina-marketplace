import { UserRole, OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number | string;
  discountPercentage?: number | null;
  stock: number;
  sku: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  rating?: number | null;
  reviewCount: number;
  isNew: boolean;
  isFlashSale: boolean;
  isActive: boolean;
  categoryId: string;
  brandId: string;
  category?: Category;
  brand?: Brand;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image: string;
  parentId?: string | null;
  isActive: boolean;
  parent?: Category | null;
  children?: Category[];
  products?: Product[];
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  isActive: boolean;
  products?: Product[];
};

export type Address = {
  id: string;
  userId: string;
  label?: string | null;
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type CartItemData = {
  id?: string;
  productId: string;
  quantity: number;
  product?: Product;
};

export type WishlistItemData = {
  id?: string;
  productId: string;
  product?: Product;
};

export type Order = {
  id: string;
  userId: string;
  status: OrderStatus;
  shippingAddressId?: string | null;
  billingAddressId?: string | null;
  subtotal: number | string;
  tax: number | string;
  total: number | string;
  trackingCode?: string | null;
  items?: OrderItemData[];
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type OrderItemData = {
  id: string;
  orderId: string;
  productId: string;
  title: string;
  price: number | string;
  quantity: number;
  thumbnail: string;
};

export type Review = {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment?: string | null;
  isVerified: boolean;
  user?: User;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type Payment = {
  id: string;
  orderId?: string | null;
  userId: string;
  method: PaymentMethod;
  amount: number | string;
  status: PaymentStatus;
  reference?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};
