// ==========================================
// Lumina Design System — App Config
// ==========================================

export const APP_CONFIG = {
  name: 'Lumina Marketplace',
  version: '1.0.0',
  description: 'Modern e-commerce platform with complete design system',
  theme: {
    defaultMode: 'light',
    supportsDark: true,
    fontFamily: 'Vazirmatn',
    direction: 'rtl',
  },
  colors: {
    brand: '#9333ea',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
  },
  spacing: {
    base: 4,
    scale: [0, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 6, 8, 10, 12, 16, 20, 24],
  },
} as const;
