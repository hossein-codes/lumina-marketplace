import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Clock, User, ArrowLeft, Tag } from 'lucide-react';
import { MOCK_BLOG_ARTICLES } from '../data/mockDatabase';

export const BlogList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('');

  const categories = [
    'همه دسته‌بندی‌ها',
    'راهنمای خرید دیجیتال',
    'آموزش و ترفند',
    'زیبایی و عطر'
  ];

  const filteredArticles = MOCK_BLOG_ARTICLES.filter((art) => {
    if (selectedCat && selectedCat !== 'همه دسته‌بندی‌ها' && art.category !== selectedCat) {
      return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Blog Hero Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-gray-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl space-y-4 text-center">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold">
          <BookOpen size={15} /> مجله و راهنمای خرید تخصصی شاپینو
        </span>
        <h1 className="text-3xl md:text-5xl font-black">
          آگاهانه انتخاب کنید، هوشمندانه بخرید
        </h1>
        <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
          بررسی فنی جدیدترین کالاهای دیجیتال، آموزش‌های کاربردی و راهنمای خرید مد، زیبایی و لوازم خانه از کارشناسان شاپینو
        </p>

        {/* Search bar in hero */}
        <div className="max-w-xl mx-auto pt-4">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2.5 text-white">
            <Search size={18} className="text-purple-300" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو در بین مقالات و راهنماها..."
              className="bg-transparent flex-1 outline-none text-sm text-white placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition ${
              (selectedCat === cat || (!selectedCat && cat === 'همه دسته‌بندی‌ها'))
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredArticles.map((article) => (
          <Link
            key={article.id}
            to={`/blog/${article.slug}`}
            className="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col"
          >
            <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 right-3 bg-purple-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl shadow">
                {article.category}
              </span>
            </div>

            <div className="p-6 flex flex-col flex-1 space-y-3">
              <h3 className="font-black text-base text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition leading-relaxed">
                {article.title}
              </h3>

              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 flex-1">
                {article.excerpt}
              </p>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  <User size={13} /> {article.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={13} /> {article.readTime}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-[-4px] transition-transform">
                <span>ادامه مطالعه مقاله</span>
                <ArrowLeft size={16} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
