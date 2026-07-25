# Lumina Marketplace — Architecture Guide

## Design System (Centralized)
- `src/design-system/tokens/colors.css` — Color tokens (CSS variables)
- `src/design-system/theme.css` — Tailwind v4 theme mapping using `@theme`
- `src/components/ui/DesignComponents.tsx` — Base UI components using design tokens
- `src/lib/config/app.ts` — App-level configuration

## Architecture Changes
- Component colors now use design tokens (`brand-600`, `surface`, `text-primary`) instead of hardcoded Tailwind defaults.
- All UI components reference `src/design-system/` for consistency.
- Theme changes apply globally via CSS variables (`:root` / `.dark`).

## Next Steps for Full Migration
- Move page-specific logic into `src/features/<feature>/components/`
- Centralize API services in `src/services/`
- Use design tokens exclusively — no raw `purple-600`, `gray-100`, etc.
