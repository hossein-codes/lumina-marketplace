import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Phone, Mail, MapPin, Send, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';
import { CATEGORIES } from '../../data/mockDatabase';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20 border-t border-gray-800">
      {/* Top Value Propositions */}
      <div className="border-b border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-900/40 text-purple-400 flex items-center justify-center">
              <Truck size={24} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">ارسال سریع و رایگان</p>
              <p className="text-xs text-gray-400 mt-0.5">برای سفارش‌های بالای ۵ میلیون</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/40 text-emerald-400 flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">ضمانت اصالت ۱۰۰٪</p>
              <p className="text-xs text-gray-400 mt-0.5">تضمین اورجینال بودن کالاها</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-900/40 text-blue-400 flex items-center justify-center">
              <RefreshCw size={24} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">۷ روز ضمانت بازگشت</p>
              <p className="text-xs text-gray-400 mt-0.5">مرجوعی آسان و بدون قید</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-900/40 text-amber-400 flex items-center justify-center">
              <Award size={24} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">پشتیبانی ۲۴ ساعته</p>
              <p className="text-xs text-gray-400 mt-0.5">همراه شما در تمام مراحل</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand info */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center">
              <Store size={22} className="text-white" />
            </div>
            <span className="text-2xl font-black text-white">شاپینو</span>
          </Link>
          <p className="text-xs leading-relaxed text-gray-400">
            شاپینو، بازار آنلاین بی‌نهایت (Marketplace) کالا و خدمات با همکاری هزاران فروشنده معتبر سراسر کشور. تجربه‌ای نوین از خرید اینترنتی با سرعت، تنوع و اطمینان.
          </p>
          <div className="flex gap-2">
            <span className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center text-white text-xs font-bold hover:bg-purple-600 transition cursor-pointer">IG</span>
            <span className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center text-white text-xs font-bold hover:bg-blue-600 transition cursor-pointer">TG</span>
            <span className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center text-white text-xs font-bold hover:bg-red-600 transition cursor-pointer">YT</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4">دسترسی سریع به سیستم</h4>
          <ul className="space-y-2.5 text-xs text-gray-400">
            <li><Link to="/shop" className="hover:text-purple-400 transition">فروشگاه همه کالاها</Link></li>
            <li><Link to="/blog" className="hover:text-purple-400 transition">وبلاگ و مقالات آموزشی (SEO)</Link></li>
            <li><Link to="/seller" className="hover:text-purple-400 transition">ثبت‌نام و پنل فروشندگان</Link></li>
            <li><Link to="/admin" className="hover:text-purple-400 transition">پنل مدیریت سازمانی (Admin)</Link></li>
            <li><Link to="/account" className="hover:text-purple-400 transition">پیگیری سفارش‌ها</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4">دسته‌بندی‌های محبوب</h4>
          <ul className="space-y-2.5 text-xs text-gray-400">
            {CATEGORIES.slice(0, 5).map((cat) => (
              <li key={cat.id}>
                <Link to={`/shop?cat=${cat.slug}`} className="hover:text-purple-400 transition">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info & Newsletter */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-sm mb-2">اطلاعات تماس و پشتیبانی</h4>
          <ul className="space-y-2.5 text-xs text-gray-400">
            <li className="flex items-center gap-2"><Phone size={14} className="text-purple-400" /> ۰۲۱-۹۱۰۰۱۲۳۴</li>
            <li className="flex items-center gap-2"><Mail size={14} className="text-purple-400" /> info@shopino.ir</li>
            <li className="flex items-start gap-2"><MapPin size={14} className="text-purple-400 mt-0.5 flex-shrink-0" /> تهران، ونک، خیابان ملاصدرا، پلاک ۱۲۸</li>
          </ul>

          <div className="p-3.5 bg-gray-800/80 rounded-2xl border border-gray-700/60">
            <p className="text-xs text-gray-300 font-bold mb-2">عضویت در خبرنامه تخفیف‌ها</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs outline-none text-white placeholder-gray-500"
              />
              <button className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-xs text-white font-bold transition flex items-center justify-center">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-6 text-center text-xs text-gray-500">
        © ۱۴۰۴ شاپینو — طراحی و توسعه توسط تیم Senior Full Stack (React/Vite Enterprise). تمامی حقوق محفوظ است.
      </div>
    </footer>
  );
};

export default Footer;
export { Footer };
