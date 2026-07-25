/**
 * Domain-oriented API services.
 * Every backend endpoint is represented here as a typed function.
 */

import { api } from './client';
import type {
  Address,
  AdminStats,
  Brand,
  Cart,
  CartItem,
  Category,
  Order,
  OrderStatus,
  Payment,
  PaymentMethod,
  Product,
  Review,
  User,
  WishlistItem,
} from '@/lib/types';

// ----------------- Auth -----------------
export const authService = {
  register: (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    phone?: string;
  }) => api.post<{ user: User; token: string }>('/auth/register', payload, { auth: false }),

  login: (payload: { email: string; password: string }) =>
    api.post<{ user: User; token: string }>('/auth/login', payload, { auth: false }),

  me: () => api.get<User>('/auth/me'),
};

// ----------------- Users -----------------
export const userService = {
  profile: () => api.get<User>('/users/profile'),
  updateProfile: (payload: Partial<Pick<User, 'firstName' | 'lastName' | 'phone'>>) =>
    api.put<User>('/users/profile', payload),
  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    api.put<{ message: string }>('/users/password', payload),
};

// ----------------- Addresses -----------------
export const addressService = {
  list: () => api.get<Address[]>('/addresses'),
  create: (payload: Omit<Address, 'id' | 'userId' | 'createdAt'>) =>
    api.post<Address>('/addresses', payload),
  update: (id: string, payload: Partial<Address>) => api.put<Address>(`/addresses/${id}`, payload),
  remove: (id: string) => api.delete<{ message: string }>(`/addresses/${id}`),
};

// ----------------- Products -----------------
export interface ProductListParams {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  search?: string;
  sort?: 'createdAt' | 'price' | 'rating';
}

export const productService = {
  list: (params: ProductListParams = {}) =>
    api.get<Product[]>('/products', { query: params, auth: false, next: { revalidate: 60 } }),
  getBySlug: (slug: string) =>
    api.get<Product>(`/products/${slug}`, { auth: false, next: { revalidate: 60 } }),
  create: (payload: Partial<Product>) => api.post<Product>('/products', payload),
  update: (id: string, payload: Partial<Product>) => api.put<Product>(`/products/${id}`, payload),
  remove: (id: string) => api.delete<{ message: string }>(`/products/${id}`),
};

// ----------------- Categories -----------------
export const categoryService = {
  list: () =>
    api.get<Category[]>('/categories', { auth: false, next: { revalidate: 300 } }),
  getBySlug: (slug: string) =>
    api.get<Category>(`/categories/${slug}`, { auth: false, next: { revalidate: 300 } }),
  create: (payload: Partial<Category>) => api.post<Category>('/categories', payload),
  update: (id: string, payload: Partial<Category>) => api.put<Category>(`/categories/${id}`, payload),
  remove: (id: string) => api.delete<{ message: string }>(`/categories/${id}`),
};

// ----------------- Brands -----------------
export const brandService = {
  list: () => api.get<Brand[]>('/brands', { auth: false, next: { revalidate: 300 } }),
  getBySlug: (slug: string) => api.get<Brand>(`/brands/${slug}`, { auth: false }),
  create: (payload: Partial<Brand>) => api.post<Brand>('/brands', payload),
  update: (id: string, payload: Partial<Brand>) => api.put<Brand>(`/brands/${id}`, payload),
  remove: (id: string) => api.delete<{ message: string }>(`/brands/${id}`),
};

// ----------------- Cart -----------------
export const cartService = {
  get: () => api.get<Cart>('/cart'),
  add: (productId: string, quantity = 1) =>
    api.post<CartItem>('/cart', { productId, quantity }),
  update: (itemId: string, quantity: number) =>
    api.put<CartItem>(`/cart/${itemId}`, { quantity }),
  remove: (itemId: string) => api.delete<{ message: string }>(`/cart/${itemId}`),
  clear: () => api.delete<{ message: string }>('/cart'),
};

// ----------------- Wishlist -----------------
export const wishlistService = {
  list: () => api.get<WishlistItem[]>('/wishlist'),
  add: (productId: string) => api.post<WishlistItem>('/wishlist', { productId }),
  remove: (productId: string) => api.delete<{ message: string }>(`/wishlist/${productId}`),
};

// ----------------- Orders -----------------
export interface CreateOrderPayload {
  items: { productId: string; quantity: number; unitPrice: number }[];
  shippingAddressId?: string;
  billingAddressId?: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export const orderService = {
  create: (payload: CreateOrderPayload) => api.post<Order>('/orders', payload),
  myOrders: () => api.get<Order[]>('/orders'),
  getById: (id: string) => api.get<Order>(`/orders/${id}`),
};

// ----------------- Reviews -----------------
export const reviewService = {
  byProduct: (productId: string) => api.get<Review[]>(`/reviews/product/${productId}`, { auth: false }),
  create: (payload: { productId: string; rating: number; comment?: string }) =>
    api.post<Review>('/reviews', payload),
  mine: () => api.get<Review[]>('/reviews/me'),
};

// ----------------- Payments -----------------
export const paymentService = {
  create: (payload: {
    orderId: string;
    amount: number;
    method?: PaymentMethod;
    transactionId?: string;
  }) => api.post<Payment>('/payments', payload),
  byOrder: (orderId: string) => api.get<Payment[]>(`/payments/order/${orderId}`),
  confirm: (id: string) => api.put<Payment>(`/payments/${id}/confirm`),
};

// ----------------- Admin -----------------
export const adminService = {
  stats: () => api.get<AdminStats>('/admin/stats'),
  listUsers: (params: { page?: number; limit?: number; search?: string } = {}) =>
    api.get<User[]>('/admin/users', { query: params }),
  updateUser: (id: string, payload: { role?: string; isActive?: boolean }) =>
    api.put<User>(`/admin/users/${id}`, payload),
  listOrders: (params: { page?: number; limit?: number; status?: OrderStatus } = {}) =>
    api.get<Order[]>('/admin/orders', { query: params }),
  updateOrderStatus: (id: string, payload: { status?: OrderStatus; trackingCode?: string }) =>
    api.put<Order>(`/admin/orders/${id}`, payload),
};
