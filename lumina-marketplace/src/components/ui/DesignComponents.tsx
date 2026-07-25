import React, { useState, useEffect } from 'react';
import { Star, X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

/* ==========================================
   Lumina Design System — Base Components (Tokenized)
   ========================================== */

// --- Button ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-200 select-none active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

  const styles = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25',
    secondary: 'bg-surface-muted hover:bg-surface-soft text-text-secondary hover:text-text-primary',
    accent: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25',
    outline: 'border-2 border-brand-600 text-brand-600 hover:bg-brand-50 dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-900/20',
    ghost: 'text-text-secondary hover:bg-surface-muted hover:text-text-primary',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25',
  };

  const sizes = {
    sm: 'px-3.5 py-2 text-xs gap-1.5',
    md: 'px-5 py-3 text-sm gap-2',
    lg: 'px-7 py-4 text-base gap-2.5',
  };

  return (
    <button
      className={`${base} ${styles[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

// --- Input ---
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? `input-${label}` : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-text-secondary mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {rightIcon && (
          <div className="absolute right-3.5 text-text-muted pointer-events-none">{rightIcon}</div>
        )}
        <input
          id={inputId}
          className={`w-full bg-surface border ${
            error ? 'border-red-500 focus:ring-red-500/20' : 'border-surface-muted focus:border-brand-600 focus:ring-brand-500/20'
          } rounded-2xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-all ${
            rightIcon ? 'pr-11' : ''
          } ${leftIcon ? 'pl-11' : ''} ${className}`}
          {...props}
        />
        {leftIcon && (
          <div className="absolute left-3.5 text-text-muted pointer-events-none">{leftIcon}</div>
        )}
      </div>
      {error ? (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-text-muted mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

// --- Badge ---
export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'accent';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'sm',
  className = '',
}) => {
  const variants = {
    primary: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 border border-brand-200 dark:border-brand-800',
    secondary: 'bg-surface-muted text-text-secondary dark:bg-gray-800 dark:text-gray-300 border border-surface-muted dark:border-gray-700',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800',
    accent: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs font-bold rounded-lg',
    md: 'px-3.5 py-1 text-sm font-bold rounded-xl',
  };

  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

// --- Modal ---
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div
        className={`w-full ${maxWidth} bg-surface rounded-3xl shadow-2xl border border-surface-muted overflow-hidden animate-scaleUp`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-muted">
            <h3 className="font-black text-lg text-text-primary">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-surface-muted text-text-muted hover:text-text-secondary transition"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- RatingStars ---
export const RatingStars: React.FC<{ rating: number; size?: number; showNumber?: boolean }> = ({
  rating,
  size = 14,
  showNumber = false,
}) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-surface-muted fill-surface-muted'
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-xs font-bold text-text-secondary mr-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
};

// --- CountdownTimer ---
export const CountdownTimer: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const diff = new Date(targetDate).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-1.5 font-mono">
      <div className="bg-red-600 text-white font-black text-xs px-2 py-1 rounded-lg">{String(timeLeft.hours).padStart(2, '0')}</div>
      <span className="text-red-600 font-bold">:</span>
      <div className="bg-red-600 text-white font-black text-xs px-2 py-1 rounded-lg">{String(timeLeft.minutes).padStart(2, '0')}</div>
      <span className="text-red-600 font-bold">:</span>
      <div className="bg-red-600 text-white font-black text-xs px-2 py-1 rounded-lg">{String(timeLeft.seconds).padStart(2, '0')}</div>
    </div>
  );
};

// --- ToastContainer ---
import { useNotificationStore } from '../../store/notificationStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotificationStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />,
          warning: <AlertTriangle size={18} className="text-amber-500 flex-shrink-0" />,
          error: <AlertCircle size={18} className="text-red-500 flex-shrink-0" />,
          info: <Info size={18} className="text-blue-500 flex-shrink-0" />,
        };
        const borders = {
          success: 'border-l-4 border-l-emerald-500',
          warning: 'border-l-4 border-l-amber-500',
          error: 'border-l-4 border-l-red-500',
          info: 'border-l-4 border-l-blue-500',
        };
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-surface rounded-2xl shadow-xl border border-surface-muted p-4 flex items-center justify-between gap-3 ${borders[toast.type]} animate-slideIn`}
          >
            <div className="flex items-center gap-3">
              {icons[toast.type]}
              <span className="text-sm font-semibold text-text-primary">{toast.message}</span>
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-text-muted hover:text-text-secondary transition p-1">
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
