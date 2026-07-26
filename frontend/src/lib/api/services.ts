import { apiClient } from './client';

export const authService = {
  login: async (email: string, password: string) => {
    const res = await apiClient('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    return res.json();
  },
  register: async (data: any) => {
    const res = await apiClient('/api/auth/register', { method: 'POST', body: JSON.stringify(data) });
    return res.json();
  },
  me: async () => {
    const res = await apiClient('/api/auth/me', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return res.json();
  },
};

export const productService = {
  list: async (query?: string) => {
    const res = await apiClient(`/api/products${query ? `?${query}` : ''}`);
    return res.json();
  },
  get: async (slug: string) => {
    const res = await apiClient(`/api/products/${slug}`);
    return res.json();
  },
};

export const cartService = {
  get: async () => {
    const res = await apiClient('/api/cart', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return res.json();
  },
  add: async (productId: string, quantity = 1) => {
    const res = await apiClient('/api/cart', { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify({ productId, quantity }) });
    return res.json();
  },
  clear: async () => {
    const res = await apiClient('/api/cart', { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return res.json();
  },
};

export const wishlistService = {
  get: async () => {
    const res = await apiClient('/api/wishlist', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return res.json();
  },
  add: async (productId: string) => {
    const res = await apiClient('/api/wishlist', { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify({ productId }) });
    return res.json();
  },
  remove: async (productId: string) => {
    const res = await apiClient(`/api/wishlist/${productId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    return res.json();
  },
};
