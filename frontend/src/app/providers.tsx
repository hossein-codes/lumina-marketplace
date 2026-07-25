'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { useAuthStore } from '@/lib/stores/authStore';
import { useCartStore } from '@/lib/stores/cartStore';
import { useWishlistStore } from '@/lib/stores/wishlistStore';

export function Providers({ children }: { children: ReactNode }) {
  const [qc] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  const hydrate = useAuthStore((s) => s.hydrate);
  const fetchCart = useCartStore((s) => s.fetch);
  const fetchWishlist = useWishlistStore((s) => s.fetch);
  const token = useAuthStore((s) => s.token);

  // Rehydrate auth once on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // When user logs in, sync server-side carts/wishlists
  useEffect(() => {
    if (token) {
      fetchCart();
      fetchWishlist();
    }
  }, [token, fetchCart, fetchWishlist]);

  return (
    <QueryClientProvider client={qc}>
      {children}
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          style: { fontFamily: 'var(--font-sans)' },
        }}
      />
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
