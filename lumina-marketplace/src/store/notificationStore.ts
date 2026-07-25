import { create } from 'zustand';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: string;
  read: boolean;
}

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

interface NotificationStore {
  notifications: NotificationItem[];
  toasts: ToastItem[];
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  unreadCount: () => number;
  addToast: (message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [
    {
      id: 'notif-1',
      title: 'تخفیف ویژه روز مادر 🎉',
      message: 'کد تخفیف DIGI50 برای خرید اول شما فعال شد. تا ۵۰٪ تخفیف بگیرید!',
      type: 'success',
      timestamp: '۱۰ دقیقه پیش',
      read: false
    },
    {
      id: 'notif-2',
      title: 'به‌روزرسانی سفارش #SHP-984210',
      message: 'سفارش شما از انبار شاپینو خارج و به پیک تحویل داده شد.',
      type: 'info',
      timestamp: '۲ ساعت پیش',
      read: false
    }
  ],
  toasts: [],
  addNotification: (item) => {
    const id = 'n-' + Date.now();
    const timestamp = 'همین الان';
    set((state) => ({
      notifications: [{ ...item, id, timestamp, read: false }, ...state.notifications]
    }));
  },
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true }))
    }));
  },
  clearNotifications: () => set({ notifications: [] }),
  unreadCount: () => get().notifications.filter((n) => !n.read).length,
  addToast: (message, type = 'success') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  }
}));
