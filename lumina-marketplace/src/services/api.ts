// ==========================================
// Lumina Marketplace — API Service Layer
// Principled, scalable, complete, error-proof
// ==========================================

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: any;
}

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */
const BASE_URL = 'http://localhost:4000/api';

/* ------------------------------------------------------------------ */
/* Axios Instance — Fully Configured                                  */
/* ------------------------------------------------------------------ */
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

/* ------------------------------------------------------------------ */
/* Request Interceptor — Attach JWT Token Securely                     */
/* ------------------------------------------------------------------ */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('lumina_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/* ------------------------------------------------------------------ */
/* Response Interceptor — Handle Errors Principally                    */
/* ------------------------------------------------------------------ */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const message = (error.response?.data as any)?.error || error.message || 'Unknown API error';

    if (status === 401) {
      // Token expired or invalid — clear and redirect to login
      localStorage.removeItem('lumina_token');
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }

    if (status === 403) {
      console.warn('[SECURITY] Access forbidden by server:', message);
    }

    // Return a standardized error shape for all consumers
    return Promise.reject({
      status,
      message,
      isApiError: true,
      timestamp: new Date().toISOString(),
    });
  }
);

/* ------------------------------------------------------------------ */
/* Service Functions — One per domain, fully typed                     */
/* ------------------------------------------------------------------ */

// --- Auth ---
export const authService = {
  register: async (payload: { email: string; password: string; firstName: string; lastName?: string; phone?: string }) => {
    const res = await api.post('/auth/register', payload);
    return res.data as ApiResponse;
  },
  login: async (payload: { email: string; password: string }) => {
    const res = await api.post('/auth/login', payload);
    return res.data as ApiResponse<{ token: string; user: any }>;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data as ApiResponse<any>;
  },
};

// --- Products ---
export const productService = {
  list: async (params?: { page?: number; limit?: number; category?: string; brand?: string; search?: string }) => {
    const res = await api.get('/products', { params });
    return res.data as ApiResponse<any[]>;
  },
  getBySlug: async (slug: string) => {
    const res = await api.get(`/products/${slug}`);
    return res.data as ApiResponse<any>;
  },
};

// --- Cart ---
export const cartService = {
  get: async () => {
    const res = await api.get('/cart');
    return res.data as ApiResponse<any>;
  },
  add: async (payload: { productId: string; quantity?: number }) => {
    const res = await api.post('/cart', payload);
    return res.data as ApiResponse<any>;
  },
  updateItem: async (itemId: string, quantity: number) => {
    const res = await api.put(`/cart/${itemId}`, { quantity });
    return res.data as ApiResponse<any>;
  },
  removeItem: async (itemId: string) => {
    const res = await api.delete(`/cart/${itemId}`);
    return res.data as ApiResponse;
  },
  clear: async () => {
    const res = await api.delete('/cart');
    return res.data as ApiResponse;
  },
};

// --- Wishlist ---
export const wishlistService = {
  get: async () => {
    const res = await api.get('/wishlist');
    return res.data as ApiResponse<any[]>;
  },
  add: async (productId: string) => {
    const res = await api.post('/wishlist', { productId });
    return res.data as ApiResponse<any>;
  },
  remove: async (productId: string) => {
    const res = await api.delete(`/wishlist/${productId}`);
    return res.data as ApiResponse;
  },
};

// --- Orders ---
export const orderService = {
  create: async (payload: any) => {
    const res = await api.post('/orders', payload);
    return res.data as ApiResponse<any>;
  },
  getMyOrders: async () => {
    const res = await api.get('/orders');
    return res.data as ApiResponse<any[]>;
  },
};

// --- Reviews ---
export const reviewService = {
  create: async (payload: { productId: string; rating: number; comment?: string }) => {
    const res = await api.post('/reviews', payload);
    return res.data as ApiResponse<any>;
  },
  getByProduct: async (productId: string) => {
    const res = await api.get(`/reviews/product/${productId}`);
    return res.data as ApiResponse<any[]>;
  },
};

// --- Users ---
export const userService = {
  profile: async () => {
    const res = await api.get('/users/profile');
    return res.data as ApiResponse<any>;
  },
  updateProfile: async (payload: any) => {
    const res = await api.put('/users/profile', payload);
    return res.data as ApiResponse<any>;
  },
};

/* ------------------------------------------------------------------ */
/* Helper — Secure Token Management                                    */
/* ------------------------------------------------------------------ */
export const tokenService = {
  set: (token: string) => localStorage.setItem('lumina_token', token),
  get: () => localStorage.getItem('lumina_token'),
  clear: () => localStorage.removeItem('lumina_token'),
  exists: () => !!localStorage.getItem('lumina_token'),
};

/* ------------------------------------------------------------------ */
/* Helper — Event Listener for Global Auth Logout                     */
/* ------------------------------------------------------------------ */
if (typeof window !== 'undefined') {
  window.addEventListener('auth:logout', () => {
    tokenService.clear();
    window.location.href = '/login';
  });
}

/* ------------------------------------------------------------------ */
/* Export — Everything centrally available                            */
/* ------------------------------------------------------------------ */
export default {
  api,
  authService,
  productService,
  cartService,
  wishlistService,
  orderService,
  reviewService,
  userService,
  tokenService,
};
