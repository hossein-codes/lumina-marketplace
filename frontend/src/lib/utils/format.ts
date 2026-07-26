export function formatPrice(price: number | string | undefined | null): string {
  if (price === undefined || price === null) return '۰ تومان';
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(num)) return '۰ تومان';
  return new Intl.NumberFormat('fa-IR').format(num) + ' تومان';
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fa-IR').format(num);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function applyDiscount(price: number, discount?: number | null): number {
  if (!discount || discount <= 0) return price;
  return Math.round(price * (1 - discount / 100));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
