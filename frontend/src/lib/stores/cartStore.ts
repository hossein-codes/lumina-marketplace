import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
  items: { productId: string; quantity: number; product?: any }[];
  itemCount: number;
  subtotal: number;
  addItem: (productId: string, product?: any) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  syncGuestCartToServer: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      subtotal: 0,
      addItem: (productId, product) => {
        const items = [...get().items];
        const existing = items.find(i => i.productId === productId);
        if (existing) existing.quantity += 1;
        else items.push({ productId, quantity: 1, product });
        const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
        const subtotal = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);
        set({ items, itemCount, subtotal });
      },
      removeItem: (productId) => {
        const items = get().items.filter(i => i.productId !== productId);
        const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
        const subtotal = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);
        set({ items, itemCount, subtotal });
      },
      updateQuantity: (productId, quantity) => {
        const items = get().items.map(i => i.productId === productId ? { ...i, quantity } : i);
        const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
        const subtotal = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);
        set({ items, itemCount, subtotal });
      },
      clear: () => set({ items: [], itemCount: 0, subtotal: 0 }),
      syncGuestCartToServer: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        const items = get().items;
        for (const item of items) {
          await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ productId: item.productId, quantity: item.quantity }),
          });
        }
        set({ items: [], itemCount: 0, subtotal: 0 });
      },
    }),
    { name: 'cart-store' }
  )
);
