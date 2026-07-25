import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../data/mockDatabase';

interface WishlistStore {
  items: Product[];
  toggle: (product: Product) => void;
  isWished: (id: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const exists = get().items.find((i) => i.id === product.id);
        if (exists) {
          set((state) => ({ items: state.items.filter((i) => i.id !== product.id) }));
        } else {
          set((state) => ({ items: [...state.items, product] }));
        }
      },
      isWished: (id) => !!get().items.find((i) => i.id === id),
      clear: () => set({ items: [] })
    }),
    { name: 'shopino-wishlist-v2' }
  )
);
