import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchStore {
  history: string[];
  popularQueries: string[];
  addHistory: (query: string) => void;
  removeHistory: (query: string) => void;
  clearHistory: () => void;
  isOverlayOpen: boolean;
  setOverlayOpen: (open: boolean) => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      history: ['آیفون ۱۶', 'بلو دو شنل', 'اپل واچ اولترا', 'اسپرسوساز دلونگی'],
      popularQueries: [
        'آیفون ۱۶ پرو مکس',
        'سامسونگ s24',
        'مک‌بوک پرو m3',
        'عطر بلو دو شنل',
        'لپ‌تاپ گیمینگ ایسوس',
        'کفش نایکی پگاسوس',
        'عادت‌های اتمی',
        'اسپرسوساز دلونگی'
      ],
      addHistory: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        set((state) => ({
          history: [trimmed, ...state.history.filter((h) => h !== trimmed)].slice(0, 10)
        }));
      },
      removeHistory: (query) =>
        set((state) => ({
          history: state.history.filter((h) => h !== query)
        })),
      clearHistory: () => set({ history: [] }),
      isOverlayOpen: false,
      setOverlayOpen: (open) => set({ isOverlayOpen: open }),
    }),
    {
      name: 'shopino-search-history',
      partialize: (state) => ({ history: state.history })
    }
  )
);
