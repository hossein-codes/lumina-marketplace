import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', loading = false, leftIcon, rightIcon, className, children, disabled, ...props }: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600 shadow-md hover:shadow-glow',
    secondary: 'bg-ink-800 text-white hover:bg-ink-900',
    outline: 'border border-ink-300 text-ink-700 hover:bg-ink-50',
    ghost: 'text-ink-600 hover:text-brand-600 hover:bg-brand-50',
    danger: 'bg-danger-500 text-white hover:bg-danger-600',
    success: 'bg-success-500 text-white hover:bg-success-600',
  };
  const sizes: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-1.5 rounded-sm gap-1.5',
    md: 'text-sm px-4 py-2 rounded-md gap-2',
    lg: 'text-base px-6 py-3 rounded-lg gap-2.5',
    icon: 'p-2 rounded-md',
  };
  return (
    <button
      disabled={disabled || loading}
      className={cn('inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed', variants[variant], sizes[size], className)}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
