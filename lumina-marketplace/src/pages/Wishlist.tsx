import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';

export default function Wishlist() {
  const { items, toggle } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-8xl mb-6">❤️</div>
        <h2 className="text-2xl font-black text-gray-800 mb-3">لیست علاقه‌مندی‌ات خالیه!</h2>
        <p className="text-gray-500 mb-8">محصولات مورد علاقه‌ات رو اینجا ذخیره کن</p>
        <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition">
          رفتن به فروشگاه
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="text-red-500 fill-red-500" size={24} />
        <h1 className="text-2xl font-black text-gray-900">علاقه‌مندی‌ها</h1>
        <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">{items.length}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((item) => {
          const discPrice = item.price * (1 - item.discountPercentage / 100);
          return (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
              <Link to={`/product/${item.id}`} className="block relative bg-gray-50 aspect-square overflow-hidden">
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
              </Link>
              <div className="p-4">
                <p className="text-xs text-purple-600 font-medium mb-1">{item.brand}</p>
                <Link to={`/product/${item.id}`} className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-purple-600 transition block mb-3">{item.title}</Link>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-black text-gray-900">${discPrice.toFixed(0)}</span>
                  {item.discountPercentage > 0 && <span className="text-xs text-gray-400 line-through">${item.price}</span>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => addItem(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition"
                  >
                    <ShoppingCart size={13} /> افزودن
                  </button>
                  <button
                    onClick={() => toggle(item)}
                    className="w-9 h-9 flex items-center justify-center border border-red-200 text-red-400 rounded-xl hover:bg-red-50 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
