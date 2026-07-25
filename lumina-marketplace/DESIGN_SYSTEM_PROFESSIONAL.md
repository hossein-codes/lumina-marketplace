# Lumina Professional Design System — Documentation

## Philosophy: Not Colorful — Focused on Product
The previous design used bright purple (`#9333ea`) and colorful gradients. This distracted customers from products. The new design removes all garish colors.

### Color Strategy
- **Single brand tone:** Deep navy (`#334155`) — professional, trustworthy, store-appropriate
- **Surfaces:** Pure white (`#ffffff`) and soft gray (`#f1f5f9`) — clean background for products
- **Text:** High contrast (`#0f172a` primary, `#64748b` secondary) — readable without strain
- **No bright colors:** Success, warning, danger are deep emerald (`#059669`), amber (`#d97706`), and red (`#dc2626`) — visible but not loud

### Typography Strategy
- **Iran Yekan:** Professional Persian font, optimized for screens
- **Weights:** Regular (400), Medium (500), Bold (700), Black (900) — clear hierarchy
- **Scale:** 12px to 36px — tight for mobile, larger for desktop
- **Tracking:** Slight negative letter-spacing (`-0.03em`) for headings — modern feel

## Mobile vs Desktop — Separate Design
The user specified that mobile and desktop designs will be completely separate.

### Mobile Design (`< 1024px`)
- Single column layout
- Sticky bottom navigation (not top header)
- Large touch targets (minimum 48px)
- Bottom sheet for cart and filters (not side drawers)
- PWA installation prompt visible
- Font size: 16px base (larger for touch readability)

### Desktop Design (`>= 1024px`)
- Multi-column grid (3-4 columns for products)
- Persistent sidebar for categories/filters
- Hover states for all interactive elements
- Font size: 17px base (slightly larger for reading comfort)
- Expanded header with full navigation

## PWA — Mobile Web App Installation
The mobile experience is designed as a Progressive Web App:
- `manifest.json` defines installation parameters
- `service-worker.js` caches static assets for offline reading
- `apple-mobile-web-app-capable` meta tag enables iOS installation
- Shortcuts for quick access: Shop (`/shop`), Cart (`/cart`), Profile (`/profile`)

## Future Native App Preparation
The architecture supports future native app development:
- All API endpoints use standard REST JSON (`/api/*`)
- Service layer (`src/services/api.ts`) can be reused in React Native with minimal changes
- Design tokens (`professional.css`) are platform-independent
- Component structure (`components/ui/`) uses pure TypeScript/React — portable
- State management (`zustand`) is framework-agnostic

When building the native app:
- Replace `axios` calls with native `fetch`
- Keep the same endpoint URLs (`BASE_URL` changes to production server)
- Reuse component logic (Button, Input, Badge, Modal)
- Reuse design tokens (colors, spacing, radius)

## What Was Removed (Not Professional for Store)
- Bright purple gradients (`from-purple-900 via-indigo-900`)
- Rainbow color schemes
- Playful animations (`spin`, `scale` on every interaction)
- Large decorative shadows that cover content
- Over-complex typography with too many weights

## What Was Added (Store-Appropriate)
- Subtle shadows (`shadow-md` at `rgb(15 23 42 / 0.08)`) — depth without distraction
- Sharp focus states (`outline: 2px solid brand-500`) — accessibility
- Minimal scrollbars (5px width, muted color) — clean scroll
- Professional selection colors (`brand-100` background, `brand-900` text)

This design system supports expansion without restructuring.
