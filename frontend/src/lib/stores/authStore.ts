'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/lib/types';
import { authService } from '@/lib/api/services';
import { setToken as saveToken } from '@/lib/api/client';

interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'authenticated' | 'error';
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
  hydrate: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      status: 'idle',
      error: null,

      login: async (email, password) => {
        set({ status: 'loading', error: null });
        try {
          const res = await authService.login({ email, password });
          const { user, token } = res.data!;
          saveToken(token);
          set({ user, token, status: 'authenticated' });
        } catch (err) {
          set({ status: 'error', error: (err as Error).message });
          throw err;
        }
      },

      register: async (payload) => {
        set({ status: 'loading', error: null });
        try {
          const res = await authService.register(payload);
          const { user, token } = res.data!;
          saveToken(token);
          set({ user, token, status: 'authenticated' });
        } catch (err) {
          set({ status: 'error', error: (err as Error).message });
          throw err;
        }
      },

      logout: () => {
        saveToken(null);
        set({ user: null, token: null, status: 'idle' });
      },

      hydrate: async () => {
        const t = get().token;
        if (!t) return;
        saveToken(t);
        try {
          const res = await authService.me();
          set({ user: res.data!, status: 'authenticated' });
        } catch {
          saveToken(null);
          set({ user: null, token: null, status: 'idle' });
        }
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'lumina.auth',
      partialize: (s) => ({ token: s.token, user: s.user }),
    }
  )
);
