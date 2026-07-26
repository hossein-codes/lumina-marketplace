import { cn } from '@/lib/utils/cn';

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-xl shadow-sm overflow-hidden', className)}>{children}</div>;
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-5 py-4 border-b border-[var(--border-subtle)]', className)}>{children}</div>;
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-base font-bold text-[var(--text-primary)]', className)}>{children}</h3>;
}
