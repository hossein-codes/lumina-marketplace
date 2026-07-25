import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, User, Clock, Calendar, ArrowRight, Share2, Tag } from 'lucide-react';
import { MOCK_BLOG_ARTICLES, MOCK_PRODUCTS } from '../data/mockDatabase';
import { ProductCard } from '../components/product/ProductCard';

export const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = MOCK_BLOG_ARTICLES.find((a) => a.slug === slug || a.id === slug);

  if (!article) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">مقاله مورد نظر یافت نشد</h2>
        <Link to="/blog">
          <button className="px-5 py-2.5 bg-purple-600 text-white rounded-2xl text-xs font-bold">
            بازگشت به لیست مقالات
          </button>
        </Link>
      </div>
    );
  }

  // Related products to display below article
  const relatedProducts = MOCK_PRODUCTS.slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link to="/" className="hover:text-purple-600">صفحه اصلی</Link>
        <span>/</span>
        <Link to="/blog" className="hover:text-purple-600">مجله شاپینو</Link>
        <span>/</span>
        <span className="text-gray-800 dark:text-gray-200 font-bold truncate max-w-xs">
          {article.title}
        </span>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <span className="inline-block px-3.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold">
          {article.category}
        </span>
        <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-200 dark:border-gray-800 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-bold text-gray-700 dark:text-gray-300">
              <User size={15} /> {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={15} /> {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={15} /> {article.readTime}
            </span>
          </div>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: article.title, url: window.location.href });
              }
            }}
            className="flex items-center gap-1.5 text-purple-600 hover:underline font-bold"
          >
            <Share2 size={15} /> اشتراک‌گذاری مقاله
          </button>
        </div>
      </div>

      {/* Cover Image */}
      <div className="aspect-video rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-800">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 md:p-12 shadow-sm space-y-6">
        <p className="text-base font-bold text-gray-800 dark:text-gray-200 leading-relaxed border-l-4 border-l-purple-600 pl-4 py-1">
          {article.excerpt}
        </p>

        <div className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-loose space-y-4">
          <p>{article.content}</p>
          <p>
            توصیه می‌کنیم پیش از تصمیم نهایی، حتماً نظرات خریداران واقعی در صفحه هر محصول را مطالعه کرده و از گارانتی معتبر شرکتی اطمینان حاصل کنید. تیم پشتیبانی شاپینو در تمام ساعات شبانه‌روز آماده پاسخگویی به سوالات شماست.
          </p>
        </div>

        {/* Tags */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
            <Tag size={14} /> برچسب‌ها:
          </span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Recommended products below article */}
      <div className="space-y-6 pt-6">
        <h3 className="text-xl font-black text-gray-900 dark:text-white">
          محصولات مرتبط با این مقاله در شاپینو
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
