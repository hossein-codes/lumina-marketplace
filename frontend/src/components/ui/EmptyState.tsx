import { Package, ShoppingBag, Heart, SearchX } from 'lucide-react';

export function EmptyState({ title, description, icon }: { title: string; description?: string; icon?: 'cart' | 'wishlist' | 'orders' | 'search' }) {
  const Icon = icon === 'cart' ? ShoppingBag : icon === 'wishlist' ? Heart : icon === 'orders' ? Package : SearchX;
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-[var(--surface-muted)] flex items-center justify-center">
        <Icon className="w-10 h-10 text-[var(--text-muted)]" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>
        {description && <p className="text-sm text-[var(--text-muted)] mt-1">{description}</p>}
      </div>
    </div>
  );
}
