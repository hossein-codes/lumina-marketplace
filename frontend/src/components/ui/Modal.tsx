'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}) {
  const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' } as const;
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={`relative w-full ${widths[size]} rounded-2xl bg-[var(--surface-card)] shadow-2xl overflow-hidden`}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', duration: 0.25 }}
          >
            {(title || onClose) && (
              <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
                <h3 className="text-base font-bold">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-1 rounded-md hover:bg-[var(--surface-muted)]"
                  aria-label="بستن"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
