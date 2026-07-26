import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  items: { productId: string; product?: any }[];
  addItem: (productId: string, product?: any) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  syncGuestWishlistToServer: () => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId, product) => {
        if (get().items.find(i => i.productId === productId)) return;
        set({ items: [...get().items, { productId, product }] });
      },
      removeItem: (productId) => set({ items: get().items.filter(i => i.productId !== productId) }),
      isInWishlist: (productId) => get().items.some(i => i.productId === productId),
      syncGuestWishlistToServer: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        const items = get().items;
        for (const item of items) {
          await fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ productId: item.productId }),
          });
        }
      },
    }),
    { name: 'wishlist-store' }
  )
);
