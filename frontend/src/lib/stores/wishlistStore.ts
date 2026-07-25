'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, WishlistItem } from '@/lib/types';
import { wishlistService } from '@/lib/api/services';
import { useAuthStore } from './authStore';

interface WishlistState {
  items: Array<{ productId: string; product: Product }>;
  loading: boolean;

  fetch: () => Promise<void>;
  toggle: (product: Product) => Promise<void>;
  has: (productId: string) => boolean;
  clear: () => void;
}

function isAuthed() {
  return !!useAuthStore.getState().token;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,

      fetch: async () => {
        if (!isAuthed()) return;
        set({ loading: true });
        try {
          const res = await wishlistService.list();
          const items = (res.data ?? [])
            .filter((w: WishlistItem) => !!w.product)
            .map((w: WishlistItem) => ({ productId: w.productId, product: w.product as Product }));
          set({ items });
        } finally {
          set({ loading: false });
        }
      },

      toggle: async (product) => {
        const exists = get().has(product.id);
        if (isAuthed()) {
          try {
            if (exists) await wishlistService.remove(product.id);
            else await wishlistService.add(product.id);
            await get().fetch();
          } catch {
            /* noop */
          }
          return;
        }
        set(
          exists
            ? { items: get().items.filter((i) => i.productId !== product.id) }
            : { items: [...get().items, { productId: product.id, product }] }
        );
      },

      has: (productId) => get().items.some((i) => i.productId === productId),

      clear: () => set({ items: [] }),
    }),
    { name: 'lumina.wishlist', partialize: (s) => ({ items: s.items }) }
  )
);
