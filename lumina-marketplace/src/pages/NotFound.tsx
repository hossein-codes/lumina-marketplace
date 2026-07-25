import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-[120px] leading-none mb-4">🔍</div>
      <h1 className="text-6xl font-black text-gray-900 mb-3">۴۰۴</h1>
      <h2 className="text-2xl font-bold text-gray-700 mb-3">صفحه پیدا نشد!</h2>
      <p className="text-gray-500 max-w-sm mb-8">
        صفحه‌ای که دنبالش می‌گردی وجود نداره یا منتقل شده. برو صفحه اصلی!
      </p>
      <div className="flex gap-3">
        <Link to="/" className="px-6 py-3 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition">
          صفحه اصلی
        </Link>
        <Link to="/shop" className="px-6 py-3 border-2 border-purple-200 text-purple-700 font-bold rounded-2xl hover:bg-purple-50 transition">
          فروشگاه
        </Link>
      </div>
    </div>
  );
}
