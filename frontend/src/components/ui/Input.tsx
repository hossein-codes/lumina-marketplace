import { cn } from '@/lib/utils/cn';
import { AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({ label, hint, error, leftIcon, rightIcon, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label htmlFor={props.id} className="text-sm font-medium text-ink-700">{label}</label>}
      <div className="relative">
        {leftIcon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">{leftIcon}</span>}
        <input
          className={cn(
            'w-full bg-[var(--surface-card)] border border-[var(--border-default)] rounded-lg py-2.5 px-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--ring-focus)] focus:ring-2 focus:ring-[var(--ring-focus)]/20 transition-all',
            leftIcon ? 'pl-10' : '',
            rightIcon ? 'pr-10' : '',
            error ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20' : '',
            className
          )}
          {...props}
        />
        {rightIcon && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400">{rightIcon}</span>}
      </div>
      {hint && !error && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
      {error && (
        <p className="text-xs text-danger-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}
