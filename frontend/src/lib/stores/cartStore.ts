'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/lib/types';
import { cartService } from '@/lib/api/services';
import { useAuthStore } from './authStore';

/**
 * Cart store — dual mode:
 *  - Guests: items live in localStorage only.
 *  - Authenticated: mirrors server state; every mutation is proxied to the API.
 */

export interface LocalCartItem {
  id: string; // local id when not synced (temp) or server item id
  productId: string;
  quantity: number;
  product: Product;
}

interface CartState {
  items: LocalCartItem[];
  loading: boolean;
  error: string | null;

  fetch: () => Promise<void>;
  add: (product: Product, quantity?: number) => Promise<void>;
  update: (productId: string, quantity: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
  syncGuestCartToServer: () => Promise<void>;

  itemCount: () => number;
  subtotal: () => number;
}

function isAuthed() {
  return !!useAuthStore.getState().token;
}

function serverToLocal(items: CartItem[]): LocalCartItem[] {
  return items
    .filter((i) => !!i.product)
    .map((i) => ({
      id: i.id,
      productId: i.productId,
      quantity: i.quantity,
      product: i.product as Product,
    }));
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      error: null,

      fetch: async () => {
        if (!isAuthed()) return;
        set({ loading: true, error: null });
        try {
          const res = await cartService.get();
          set({ items: serverToLocal(res.data?.items ?? []) });
        } catch (err) {
          set({ error: (err as Error).message });
        } finally {
          set({ loading: false });
        }
      },

      add: async (product, quantity = 1) => {
        if (isAuthed()) {
          try {
            await cartService.add(product.id, quantity);
            await get().fetch();
          } catch (err) {
            set({ error: (err as Error).message });
          }
          return;
        }
        // guest
        const items = [...get().items];
        const existing = items.find((i) => i.productId === product.id);
        if (existing) existing.quantity += quantity;
        else
          items.push({
            id: `local-${product.id}`,
            productId: product.id,
            quantity,
            product,
          });
        set({ items });
      },

      update: async (productId, quantity) => {
        if (quantity <= 0) return get().remove(productId);
        if (isAuthed()) {
          const it = get().items.find((i) => i.productId === productId);
          if (!it) return;
          try {
            await cartService.update(it.id, quantity);
            await get().fetch();
          } catch (err) {
            set({ error: (err as Error).message });
          }
          return;
        }
        set({
          items: get().items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        });
      },

      remove: async (productId) => {
        if (isAuthed()) {
          const it = get().items.find((i) => i.productId === productId);
          if (!it) return;
          try {
            await cartService.remove(it.id);
            await get().fetch();
          } catch (err) {
            set({ error: (err as Error).message });
          }
          return;
        }
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      clear: async () => {
        if (isAuthed()) {
          try {
            await cartService.clear();
          } catch (err) {
            set({ error: (err as Error).message });
          }
        }
        set({ items: [] });
      },

      /**
       * When a guest signs in, push their local items to the server, then refresh.
       */
      syncGuestCartToServer: async () => {
        if (!isAuthed()) return;
        const local = get().items.filter((i) => i.id.startsWith('local-'));
        for (const it of local) {
          try {
            await cartService.add(it.productId, it.quantity);
          } catch {
            /* ignore per-item errors */
          }
        }
        await get().fetch();
      },

      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((s, i) => {
          const price = Number(i.product.price);
          const disc = Number(i.product.discountPercentage ?? 0);
          const final = disc ? Math.round(price * (1 - disc / 100)) : price;
          return s + final * i.quantity;
        }, 0),
    }),
    {
      name: 'lumina.cart',
      partialize: (s) => ({ items: s.items }),
    }
  )
);
