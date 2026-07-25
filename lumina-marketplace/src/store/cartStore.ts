/* ==========================================
   Lumina Cart Store — Real API Connected
   Complete, expandable, error-proof
   ========================================== */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartService } from '../services/api';
import { Product } from '../data/mockDatabase';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  savedForLater: CartItem[];
  couponCode: string | null;
  couponDiscountPercent: number;
  isDrawerOpen: boolean;

  setDrawerOpen: (open: boolean) => void;
  syncCart: () => Promise<void>;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  removeSaved: (id: string) => void;
  applyCoupon: (code: string, discountPercent: number) => void;
  removeCoupon: () => void;
  clearCart: () => Promise<void>;

  subTotal: () => number;
  discountAmount: () => number;
  shippingFee: () => number;
  finalTotal: () => number;
  count: () => number;
  clearError: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      savedForLater: [],
      couponCode: null,
      couponDiscountPercent: 0,
      isDrawerOpen: false,

      setDrawerOpen: (open) => set({ isDrawerOpen: open }),

      syncCart: async () => {
        try {
          set({ isLoading: true, error: null });
          const res = await cartService.get();
          if (res.success && res.data) {
            const apiItems = res.data.items || [];
            const mapped = apiItems.map((item: any) => ({
              id: item.productId || item.id,
              product: item.product || ({} as Product),
              quantity: item.quantity || 1,
            }));
            set({ items: mapped, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (err: any) {
          set({ error: err.message || 'خطا در همگام‌سازی سبد خرید.', isLoading: false });
        }
      },

      addItem: async (product, quantity = 1) => {
        try {
          set({ isLoading: true, error: null });
          await cartService.add({ productId: product.id, quantity });
          await get().syncCart();
          set({ isDrawerOpen: true, isLoading: false });
        } catch (err: any) {
          set({ error: err.message || 'خطا در افزودن به سبد.', isLoading: false });
        }
      },

      removeItem: async (id) => {
        try {
          set({ isLoading: true, error: null });
          await cartService.removeItem(id);
          await get().syncCart();
          set({ isLoading: false });
        } catch (err: any) {
          set({ error: err.message || 'خطا در حذف.', isLoading: false });
        }
      },

      updateQuantity: async (id, quantity) => {
        try {
          set({ isLoading: true, error: null });
          await cartService.updateItem(id, quantity);
          await get().syncCart();
          set({ isLoading: false });
        } catch (err: any) {
          set({ error: err.message || 'خطا در به‌روزرسانی.', isLoading: false });
        }
      },

      clearCart: async () => {
        try {
          set({ isLoading: true, error: null });
          await cartService.clear();
          await get().syncCart();
          set({ couponCode: null, couponDiscountPercent: 0, isLoading: false });
        } catch (err: any) {
          set({ error: err.message || 'خطا در پاک‌سازی سبد.', isLoading: false });
        }
      },

      saveForLater: (id) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
          savedForLater: [...state.savedForLater, item],
        }));
      },

      moveToCart: (id) => {
        const item = get().savedForLater.find((i) => i.id === id);
        if (!item) return;
        set((state) => ({
          savedForLater: state.savedForLater.filter((i) => i.id !== id),
          items: [...state.items, item],
        }));
      },

      removeSaved: (id) => set((state) => ({ savedForLater: state.savedForLater.filter((i) => i.id !== id) })),

      applyCoupon: (code, discountPercent) => set({ couponCode: code, couponDiscountPercent: discountPercent }),
      removeCoupon: () => set({ couponCode: null, couponDiscountPercent: 0 }),

      subTotal: () =>
        get().items.reduce((sum, item) => {
          const price = item.product.price || 0;
          return sum + price * item.quantity;
        }, 0),

      discountAmount: () => {
        const sub = get().subTotal();
        const discPercent = get().couponDiscountPercent;
        return sub * (discPercent / 100);
      },

      shippingFee: () => {
        const sub = get().subTotal();
        return sub === 0 ? 0 : sub > 5000000 ? 0 : 75000;
      },

      finalTotal: () => {
        const sub = get().subTotal();
        const disc = get().discountAmount();
        const ship = get().shippingFee();
        return Math.max(0, sub - disc + ship);
      },

      count: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'shopino-cart-v3-api-connected',
      partialize: (state) => ({
        savedForLater: state.savedForLater,
        couponCode: state.couponCode,
        couponDiscountPercent: state.couponDiscountPercent,
      }),
    }
  )
);
