/* ==========================================
   Lumina — API Hooks for Pages
   Complete, expandable, error-proof
   ========================================== */

import { useEffect, useState, useCallback } from 'react';
import { productService, cartService, wishlistService, authService, reviewService, orderService, userService } from './api';

/* ------------------------------------------------------------------ */
/* Generic Data Fetcher                                                 */
/* ------------------------------------------------------------------ */
export interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useApiData<T>(
  fetcher: () => Promise<any>,
  dependencies: any[] = []
): UseApiState<T> {
  const [state, setState] = useState<UseApiState<T>>({ data: null, isLoading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const res = await fetcher();
        if (!cancelled) {
          setState({
            data: res.data || res,
            isLoading: false,
            error: res.error || null,
          });
        }
      } catch (err: any) {
        if (!cancelled) {
          setState({ data: null, isLoading: false, error: err.message || 'خطای شبکه' });
        }
      }
    };
    load();
    return () => { cancelled = true; };
  }, dependencies);

  return state;
}

/* ------------------------------------------------------------------ */
/* Domain-Specific Hooks                                                */
/* ------------------------------------------------------------------ */

export const useProducts = (params?: any) => {
  return useApiData<any[]>(() => productService.list(params || {}), [JSON.stringify(params || {})]);
};

export const useProduct = (slug: string) => {
  return useApiData<any>(() => productService.getBySlug(slug), [slug]);
};

export const useCartData = () => useApiData<any>(() => cartService.get());
export const useWishlistData = () => useApiData<any[]>(() => wishlistService.get());
export const useProfileData = () => useApiData<any>(() => userService.profile());
export const useMyOrders = () => useApiData<any[]>(() => orderService.getMyOrders());
export const useProductReviews = (productId: string) => {
  return useApiData<any[]>(() => reviewService.getByProduct(productId), [productId]);
};

/* ------------------------------------------------------------------ */
/* Action Hooks — Direct, no boilerplate                                */
/* ------------------------------------------------------------------ */
export const useAddToCart = () => {
  return useCallback(async (productId: string, quantity = 1) => {
    try {
      return await cartService.add({ productId, quantity });
    } catch (err: any) {
      throw err;
    }
  }, []);
};
