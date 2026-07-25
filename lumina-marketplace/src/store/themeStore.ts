import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
  setMode: (mode: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: 'light',
      toggleTheme: () =>
        set((state) => {
          const nextMode = state.mode === 'light' ? 'dark' : 'light';
          if (typeof document !== 'undefined') {
            if (nextMode === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
          return { mode: nextMode };
        }),
      setMode: (mode) => {
        if (typeof document !== 'undefined') {
          if (mode === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        set({ mode });
      },
    }),
    { name: 'shopino-theme' }
  )
);
