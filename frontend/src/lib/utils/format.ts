/**
 * Formatting helpers for prices, numbers, dates.
 * All strings are Persian-friendly.
 */

const nfIR = new Intl.NumberFormat('fa-IR');

export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '۰';
  const n = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(n)) return '۰';
  return nfIR.format(n);
}

export function formatPrice(
  value: number | string | null | undefined,
  opts: { currency?: string; suffix?: string } = {}
): string {
  const suffix = opts.suffix ?? 'تومان';
  return `${formatNumber(value)} ${suffix}`;
}

/**
 * Calculate final price after discount.
 */
export function applyDiscount(price: number, discountPercentage?: number | null): number {
  if (!discountPercentage) return price;
  return Math.round(price * (1 - discountPercentage / 100));
}

/**
 * Difference between original and discounted price.
 */
export function discountAmount(price: number, discountPercentage?: number | null): number {
  if (!discountPercentage) return 0;
  return Math.round(price * (discountPercentage / 100));
}

const dtfIR = new Intl.DateTimeFormat('fa-IR', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '';
  return dtfIR.format(d);
}

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
