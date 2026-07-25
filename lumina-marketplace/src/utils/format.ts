export const formatPrice = (priceInToman: number): string => {
  if (isNaN(priceInToman)) return '۰';
  return new Intl.NumberFormat('fa-IR').format(priceInToman) + ' تومان';
};

export const calculateDiscountPrice = (price: number, discountPercentage: number): number => {
  if (!discountPercentage) return price;
  return Math.round(price * (1 - discountPercentage / 100));
};

export const formatPersianNumber = (num: number | string): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (x) => persianDigits[parseInt(x, 10)]);
};
