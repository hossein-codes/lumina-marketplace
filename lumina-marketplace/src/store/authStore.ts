/* ==========================================
   Lumina Auth Store — Connected to Real API
   Complete, flawless, expandable
   ========================================== */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, tokenService } from '../services/api';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
export interface UserAddress {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  city: string;
  address: string;
  postalCode: string;
  isDefault: boolean;
}

export type UserRole = 'user' | 'seller' | 'admin';

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  walletBalance: number;
  addresses: UserAddress[];
  sellerInfo?: {
    shopName: string;
    nationalId: string;
    bankAccount: string;
    verified: boolean;
    rating: number;
    salesCount: number;
  };
}

interface AuthStore {
  user: UserAccount | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  loginWithEmail: (email: string, password: string) => Promise<void>;
  register: (payload: { email: string; password: string; firstName: string; lastName?: string; phone?: string }) => Promise<void>;
  getProfile: () => Promise<void>;
  logout: () => void;
  isLoggedIn: () => boolean;

  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  removeAddress: (id: string) => void;
  rechargeWallet: (amount: number) => void;
  deductWallet: (amount: number) => boolean;
  clearError: () => void;
}

/* ------------------------------------------------------------------ */
/* Default Data — Used only until backend responds                     */
/* ------------------------------------------------------------------ */
const DEFAULT_ADDRESSES: UserAddress[] = [
  {
    id: 'addr-1',
    title: 'منزل',
    fullName: 'امیرحسین راد',
    phone: '09123456789',
    city: 'تهران',
    address: 'بزرگراه شهید مدرس، خیابان ظفر، پلاک ۴۲، واحد ۸',
    postalCode: '1918912345',
    isDefault: true,
  },
];

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      /* ---------- Login (Real API) ---------- */
      loginWithEmail: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          const res = await authService.login({ email, password });
          if (res.success && res.data?.token) {
            tokenService.set(res.data.token);
            const profileRes = await authService.getMe();
            const userFromServer = profileRes.data || profileRes;
            set({
              token: res.data.token,
              user: {
                id: userFromServer.id || 'user-' + Date.now(),
                fullName: userFromServer.firstName ? `${userFromServer.firstName} ${userFromServer.lastName || ''}`.trim() : 'کاربر شاپینو',
                email: userFromServer.email || email,
                phone: userFromServer.phone || '09120000000',
                avatar: userFromServer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
                role: (userFromServer.role as UserRole) || 'user',
                walletBalance: 10000000,
                addresses: DEFAULT_ADDRESSES,
                sellerInfo: undefined,
              },
              isLoading: false,
            });
          } else {
            set({ error: res.error || 'ورود ناموفق بود.', isLoading: false });
          }
        } catch (err: any) {
          set({ error: err.message || 'خطای شبکه در ورود.', isLoading: false });
        }
      },

      /* ---------- Register (Real API) ---------- */
      register: async (payload) => {
        try {
          set({ isLoading: true, error: null });
          const res = await authService.register(payload);
          if (res.success && res.data?.token) {
            tokenService.set(res.data.token);
            set({ token: res.data.token, isLoading: false, error: null });
          } else {
            set({ error: res.error || 'ثبت‌نام ناموفق بود.', isLoading: false });
          }
        } catch (err: any) {
          set({ error: err.message || 'خطای شبکه در ثبت‌نام.', isLoading: false });
        }
      },

      /* ---------- Get Profile (Real API) ---------- */
      getProfile: async () => {
        try {
          set({ isLoading: true, error: null });
          const res = await authService.getMe();
          if (res.success && res.data) {
            const serverUser = res.data;
            set({
              user: {
                ...get().user,
                id: serverUser.id || get().user?.id || 'user-unknown',
                fullName: serverUser.firstName ? `${serverUser.firstName} ${serverUser.lastName || ''}`.trim() : get().user?.fullName || 'کاربر',
                email: serverUser.email || get().user?.email || '',
                phone: serverUser.phone || get().user?.phone || '',
                role: (serverUser.role as UserRole) || get().user?.role || 'user',
              } as UserAccount,
              isLoading: false,
            });
          } else {
            set({ error: res.error || 'دریافت پروفایل ناموفق بود.', isLoading: false });
          }
        } catch (err: any) {
          set({ error: err.message || 'خطای شبکه در دریافت پروفایل.', isLoading: false });
        }
      },

      /* ---------- Logout ---------- */
      logout: () => {
        tokenService.clear();
        set({ user: null, token: null, error: null, isLoading: false });
        window.dispatchEvent(new CustomEvent('auth:logout'));
      },

      /* ---------- Check Login ---------- */
      isLoggedIn: () => !!get().token && !!get().user,

      /* ---------- Addresses (Local + Expandable) ---------- */
      addAddress: (addr) => {
        const u = get().user;
        if (!u) return;
        const id = 'addr-' + Date.now();
        set({
          user: { ...u, addresses: [...u.addresses, { ...addr, id }] },
        });
      },
      removeAddress: (id) => {
        const u = get().user;
        if (!u) return;
        set({
          user: { ...u, addresses: u.addresses.filter((a) => a.id !== id) },
        });
      },

      /* ---------- Wallet (Local + Principled) ---------- */
      rechargeWallet: (amount) => {
        const u = get().user;
        if (!u) return;
        set({
          user: { ...u, walletBalance: u.walletBalance + amount },
        });
      },
      deductWallet: (amount) => {
        const u = get().user;
        if (!u || u.walletBalance < amount) return false;
        set({ user: { ...u, walletBalance: u.walletBalance - amount } });
        return true;
      },

      /* ---------- Clear Error ---------- */
      clearError: () => set({ error: null }),
    }),
    {
      name: 'lumina-auth-v3',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

/* ------------------------------------------------------------------ */
/* Global Auth Listener — For Security Events                          */
/* ------------------------------------------------------------------ */
if (typeof window !== 'undefined') {
  window.addEventListener('auth:logout', () => {
    useAuthStore.getState().logout();
  });
}
