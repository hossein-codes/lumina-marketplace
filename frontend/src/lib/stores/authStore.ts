import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: any | null;
  token: string | null;
  login: (user: any, token: string) => void;
  register: (user: any, token: string) => void;
  hydrate: (user: any, token?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      register: (user, token) => set({ user, token }),
      hydrate: (user, token) => set({ user: user || null, token: token || null }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-store' }
  )
);
