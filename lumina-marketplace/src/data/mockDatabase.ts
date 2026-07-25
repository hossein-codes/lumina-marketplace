export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  brands: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  image: string;
  description: string;
  subCategories: SubCategory[];
  promoImage?: string;
}

export interface SellerOffer {
  id: string;
  sellerId: string;
  sellerName: string;
  rating: number;
  price: number;
  discountPercentage: number;
  stock: number;
  shippingTime: string;
  guarantee: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  colorCode?: string;
  size?: string;
  priceDiff: number;
  stock: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  likes: number;
  verified: boolean;
}

export interface QuestionAnswer {
  id: string;
  user: string;
  question: string;
  date: string;
  answer?: {
    author: string;
    text: string;
    date: string;
  };
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  enTitle: string;
  brand: string;
  category: string; // category slug
  subCategory: string; // subcategory slug
  price: number; // base price in Toman
  discountPercentage: number;
  rating: number;
  reviewsCount: number;
  salesCount: number;
  stock: number;
  thumbnail: string;
  images: string[];
  description: string;
  features: { key: string; value: string }[];
  variants: {
    colors?: { name: string; hex: string }[];
    sizes?: string[];
  };
  sellers: SellerOffer[];
  reviews: Review[];
  qa: QuestionAnswer[];
  isFlashSale?: boolean;
  flashSaleEndsAt?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  tags: string[];
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'کالای دیجیتال',
    slug: 'digital',
    iconName: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
    description: 'گوشی موبایل، لپ‌تاپ، تبلت، هندزفری و تجهیزات جانبی',
    promoImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80',
    subCategories: [
      { id: 'sub-1', name: 'گوشی موبایل', slug: 'smartphones', brands: ['اپل (Apple)', 'سامسونگ (Samsung)', 'شیائومی (Xiaomi)', 'گوگل (Google)'] },
      { id: 'sub-2', name: 'لپ‌تاپ و اولترابوک', slug: 'laptops', brands: ['ایسوس (ASUS)', 'لنوو (Lenovo)', 'اپل مک‌بوک (Apple)', 'اچ‌پی (HP)'] },
      { id: 'sub-3', name: 'ساعت و مچ‌بند هوشمند', slug: 'smartwatches', brands: ['اپل واچ', 'گلکسی واچ', 'امیزفیت'] },
      { id: 'sub-4', name: 'هندزفری و هدفون', slug: 'headphones', brands: ['سونی (Sony)', 'انکر (Anker)', 'ایرپادز (Apple)'] },
    ]
  },
  {
    id: 'cat-2',
    name: 'مد و پوشاک',
    slug: 'fashion',
    iconName: 'Shirt',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=80',
    description: 'لباس مردانه، زنانه، کیف، کفش و اکسسوری‌های خاص',
    promoImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
    subCategories: [
      { id: 'sub-5', name: 'پوشاک مردانه', slug: 'mens-wear', brands: ['زارا (Zara)', 'نایکی (Nike)', 'آدیداس (Adidas)'] },
      { id: 'sub-6', name: 'پوشاک زنانه', slug: 'womens-wear', brands: ['زارا (Zara)', 'منگو (Mango)', 'ال‌سی وایکیکی'] },
      { id: 'sub-7', name: 'کفش ورزشی و رسمی', slug: 'shoes', brands: ['نایکی (Nike)', 'آدیداس (Adidas)', 'پوما (Puma)'] },
      { id: 'sub-8', name: 'کیف و اکسسوری', slug: 'accessories', brands: ['چرم مشهد', 'دیوید جونز'] },
    ]
  },
  {
    id: 'cat-3',
    name: 'زیبایی و سلامت',
    slug: 'beauty',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80',
    description: 'عطر و ادکلن، لوازم آرایشی، مراقبت پوست و مو',
    promoImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
    subCategories: [
      { id: 'sub-9', name: 'عطر و ادکلن', slug: 'fragrances', brands: ['شنل (Chanel)', 'دیور (Dior)', 'ورساچه (Versace)', 'بلگاری'] },
      { id: 'sub-10', name: 'مراقبت پوست', slug: 'skincare', brands: ['اوردینری (The Ordinary)', 'لورآل (Loreal)', 'سیمپل (Simple)'] },
      { id: 'sub-11', name: 'لوازم آرایشی', slug: 'makeup', brands: ['مک (MAC)', 'هدی بیوتی', 'میبلین'] },
    ]
  },
  {
    id: 'cat-4',
    name: 'خانه و آشپزخانه',
    slug: 'home',
    iconName: 'Home',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&q=80',
    description: 'لوازم برقی خانگی، دکوراسیون، مبلمان و ظروف آشپزخانه',
    subCategories: [
      { id: 'sub-12', name: 'لوازم برقی خانگی', slug: 'home-appliances', brands: ['بوش (Bosch)', 'ال‌جی (LG)', 'فیلیپس (Philips)'] },
      { id: 'sub-13', name: 'دکوراسیون و نورپردازی', slug: 'decoration', brands: ['ایکیا (IKEA)', 'چشمه نور'] },
      { id: 'sub-14', name: 'قهوه‌ساز و چای‌ساز', slug: 'coffee-makers', brands: ['دلونگی (DeLonghi)', 'نوا (Nova)', 'مبشی'] },
    ]
  },
  {
    id: 'cat-5',
    name: 'ابزار و تجهیزات',
    slug: 'tools',
    iconName: 'Wrench',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80',
    description: 'ابزارآلات برقی، دستی، تجهیزات کارگاهی و ایمنی',
    subCategories: [
      { id: 'sub-15', name: 'ابزار برقی و شارژی', slug: 'power-tools', brands: ['بوش (Bosch)', 'رونیکس (Ronix)', 'ماکیتا (Makita)'] },
      { id: 'sub-16', name: 'ابزار دستی', slug: 'hand-tools', brands: ['رونیکس', 'توسن', 'استنلی'] },
    ]
  },
  {
    id: 'cat-6',
    name: 'کتاب و هنر',
    slug: 'books',
    iconName: 'BookOpen',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
    description: 'کتاب‌های چاپی، لوازم تحریر، بازی‌های فکری و هنری',
    subCategories: [
      { id: 'sub-17', name: 'کتاب‌های روانشناسی و توسعه', slug: 'psychology-books', brands: ['نشر چشمه', 'نشر نوین', 'نشر قطره'] },
      { id: 'sub-18', name: 'لوازم التحریر و طراحی', slug: 'stationery', brands: ['فابرکاستل', 'استدلر', 'پیکاسو'] },
    ]
  },
  {
    id: 'cat-7',
    name: 'ورزش و سفر',
    slug: 'sports',
    iconName: 'Dumbbell',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80',
    description: 'پوشاک ورزشی، تجهیزات بدنسازی، کوهنوردی و کمپینگ',
    subCategories: [
      { id: 'sub-19', name: 'تجهیزات بدنسازی و فیتنس', slug: 'fitness', brands: ['آدیداس', 'پرو اسپرت', 'کِتل بل'] },
      { id: 'sub-20', name: 'لوازم کمپینگ و کوهنوردی', slug: 'camping', brands: ['کله گاوی', 'دیوتر', 'کلمن'] },
    ]
  },
  {
    id: 'cat-8',
    name: 'خودرو و موتور',
    slug: 'automotive',
    iconName: 'Car',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80',
    description: 'لوازم جانبی خودرو، صوتی و تصویری، ابزار نگهداری خودرو',
    subCategories: [
      { id: 'sub-21', name: 'لوازم جانبی و تزئینی خودرو', slug: 'auto-accessories', brands: ['پایونیر', 'کنوود', 'بوش'] },
    ]
  },
  {
    id: 'cat-9',
    name: 'کودک و اسباب‌بازی',
    slug: 'kids',
    iconName: 'Baby',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80',
    description: 'اسباب‌بازی فکری، پوشاک کودک، لوازم مراقبت از نوزاد',
    subCategories: [
      { id: 'sub-22', name: 'اسباب‌بازی و ساختنی', slug: 'toys', brands: ['لگو (LEGO)', 'هات‌ویلز', 'متل'] },
    ]
  },
  {
    id: 'cat-10',
    name: 'صنعتی و اداری',
    slug: 'industrial',
    iconName: 'Briefcase',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80',
    description: 'ماشین‌های اداری، پرینتر، تجهیزات شبکه و اتوماسیون صنعتی',
    subCategories: [
      { id: 'sub-23', name: 'پرینتر و اسکنر', slug: 'printers', brands: ['اچ‌پی (HP)', 'کانن (Canon)', 'اپسون (Epson)'] },
    ]
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'گوشی موبایل اپل مدل iPhone 16 Pro Max دو سیم‌کارت ظرفیت 256 گیگابایت',
    slug: 'apple-iphone-16-pro-max-256gb',
    enTitle: 'Apple iPhone 16 Pro Max 256GB Dual SIM',
    brand: 'اپل (Apple)',
    category: 'digital',
    subCategory: 'smartphones',
    price: 78500000,
    discountPercentage: 6,
    rating: 4.8,
    reviewsCount: 142,
    salesCount: 890,
    stock: 24,
    thumbnail: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'
    ],
    description: 'آیفون ۱۶ پرو مکس با پردازنده فوق قدرتمند A18 Pro، بدنه تیتانیومی گرید هوافضا و دوربین پریسکوپی با زوم ۵ برابری اپتیکال یکی از کامل‌ترین پرچمداران جهان است. نمایشگر 6.9 اینچی Super Retina XDR با نرخ نوسازی 120 هرتز تجربه‌ای بی‌رقیب از تماشای محتوا ارائه می‌دهد.',
    features: [
      { key: 'پردازنده', value: 'Apple A18 Pro (3 nm)' },
      { key: 'حافظه داخلی', value: '256 گیگابایت / رم 8 گیگابایت' },
      { key: 'دوربین اصلی', value: '48 مگاپیکسل + 48 مگاپیکسل اولتراواید + 12 مگاپیکسل تله‌فوتو' },
      { key: 'باتری', value: '4685 میلی‌آمپر ساعت با پشتیبانی از MagSafe' },
      { key: 'جنس بدنه', value: 'تیتانیوم گرید ۵ + شیشه سرامیک شیلد' }
    ],
    variants: {
      colors: [
        { name: 'تیتانیوم صحرایی (Desert Titanium)', hex: '#D2C3B3' },
        { name: 'تیتانیوم مشکی (Black Titanium)', hex: '#2A2B2D' },
        { name: 'تیتانیوم طبیعی (Natural Titanium)', hex: '#8C8A85' }
      ]
    },
    sellers: [
      {
        id: 'seller-1',
        sellerId: 's-1',
        sellerName: 'دیجی‌سرویس اصل (نماینده رسمی)',
        rating: 4.9,
        price: 78500000,
        discountPercentage: 6,
        stock: 12,
        shippingTime: 'ارسال فوری (امروز)',
        guarantee: '۱۸ ماه گارانتی شرکتی + کد رجیستری معتبر'
      },
      {
        id: 'seller-2',
        sellerId: 's-2',
        sellerName: 'بازرگانی موبایل شاپینو',
        rating: 4.7,
        price: 79200000,
        discountPercentage: 4,
        stock: 8,
        shippingTime: 'ارسال ۲۴ ساعته',
        guarantee: '۱۸ ماه گارانتی آروند + بیمه شکستگی'
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        userId: 'u-101',
        userName: 'آرش علیزاده',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
        rating: 5,
        date: '۱۴۰۳/۱۰/۱۲',
        title: 'شاهکار اپل در نسل جدید',
        comment: 'دوربین اولتراواید ۴۸ مگاپیکسل تغییر فوق‌العاده‌ای نسبت به ۱۵ پرو مکس داشته. باتری راحت یک روز و نیم با کار سنگین دوام میاره.',
        likes: 34,
        verified: true
      },
      {
        id: 'rev-2',
        userId: 'u-102',
        userName: 'مهسا کامرانی',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
        rating: 5,
        date: '۱۴۰۳/۱۰/۰۸',
        title: 'رنگ تیتانیوم صحرایی بی‌نظیره',
        comment: 'رنگ جدید اپل خیلی شیک و خاصه. از شاپینو با قیمت عالی و ارسال چند ساعته خریدم.',
        likes: 18,
        verified: true
      }
    ],
    qa: [
      {
        id: 'qa-1',
        user: 'رضا امینی',
        question: 'آیا این مدل رجیستری دائم داره و آنتن قطع نمیشه؟',
        date: '۱۴۰۳/۱۰/۱۴',
        answer: {
          author: 'پشتیبانی شاپینو',
          text: 'بله دوست عزیز، این کالا به صورت قانونی وارد شده و همراه با کد فعال‌سازی همتا (رجیستری دائم) ارسال می‌گردد.',
          date: '۱۴۰۳/۱۰/۱۴'
        }
      }
    ],
    isFlashSale: true,
    flashSaleEndsAt: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    isFeatured: true,
    isNew: true,
    tags: ['آیفون ۱۶', 'apple iphone 16 pro max', 'گوشی موبایل', 'پرچمدار']
  },
  {
    id: 'prod-2',
    title: 'گوشی موبایل سامسونگ مدل Galaxy S24 Ultra دو سیم‌کارت ظرفیت 256 گیگابایت',
    slug: 'samsung-galaxy-s24-ultra-256gb',
    enTitle: 'Samsung Galaxy S24 Ultra 256GB Dual SIM',
    brand: 'سامسونگ (Samsung)',
    category: 'digital',
    subCategory: 'smartphones',
    price: 64900000,
    discountPercentage: 10,
    rating: 4.8,
    reviewsCount: 218,
    salesCount: 1150,
    stock: 45,
    thumbnail: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80'
    ],
    description: 'سامسونگ گلکسی S24 اولترا با دستیار هوش مصنوعی پیشرفته Galaxy AI، نمایشگر کاملاً تخت ضد انعکاس با پوشش گوریلا آرمر و دوربین ۲۰۰ مگاپیکسلی با زوم فضایی ۱۰۰ برابری تجربه بی‌نظیری را برای کاربران حرفه‌ای فراهم می‌کند.',
    features: [
      { key: 'پردازنده', value: 'Snapdragon 8 Gen 3 for Galaxy (4 nm)' },
      { key: 'قلم S-Pen', value: 'دارد، داخلی با پشتیبانی از ژست‌های حرکتی' },
      { key: 'دوربین اصلی', value: '200 + 50 + 10 + 12 مگاپیکسل با زوم ۵ برابری اپتیکال' },
      { key: 'باتری', value: '5000 میلی‌آمپر ساعت با پشتیبانی از شارژ 45 وات' },
      { key: 'جنس بدنه', value: 'فریم تیتانیومی + گوریلا گلس آرمر' }
    ],
    variants: {
      colors: [
        { name: 'تیتانیوم خاکستری (Titanium Gray)', hex: '#636468' },
        { name: 'تیتانیوم مشکی (Titanium Black)', hex: '#1E1F21' },
        { name: 'تیتانیوم بنفش (Titanium Violet)', hex: '#4B3F5B' }
      ]
    },
    sellers: [
      {
        id: 'seller-3',
        sellerId: 's-1',
        sellerName: 'دیجی‌سرویس اصل (نماینده رسمی)',
        rating: 4.9,
        price: 64900000,
        discountPercentage: 10,
        stock: 25,
        shippingTime: 'ارسال فوری',
        guarantee: '۱۸ ماه گارانتی مایکروتل + ضمانت تعویض ۳۰ روزه'
      }
    ],
    reviews: [
      {
        id: 'rev-3',
        userId: 'u-103',
        userName: 'پویا محمدیان',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
        rating: 5,
        date: '۱۴۰۳/۱۰/۱۱',
        title: 'بهترین گوشی اندرویدی تاریخ',
        comment: 'نمایشگر ضد انعکاسش زیر نور آفتاب فوق‌العاده‌ست. قابلیت Circle to Search و ترجمه زنده با هوش مصنوعی عالی کار می‌کنه.',
        likes: 42,
        verified: true
      }
    ],
    qa: [],
    isFlashSale: true,
    flashSaleEndsAt: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    isFeatured: true,
    tags: ['سامسونگ s24', 'galaxy s24 ultra', 'گوشی موبایل', 'هوش مصنوعی']
  },
  {
    id: 'prod-3',
    title: 'لپ‌تاپ 16.2 اینچی اپل مدل MacBook Pro M3 Max (2024) رم 36 گیگابایت',
    slug: 'apple-macbook-pro-16-m3-max-36gb',
    enTitle: 'Apple MacBook Pro 16.2" M3 Max (14-Core CPU, 30-Core GPU) 36GB/1TB',
    brand: 'اپل مک‌بوک (Apple)',
    category: 'digital',
    subCategory: 'laptops',
    price: 184000000,
    discountPercentage: 8,
    rating: 4.9,
    reviewsCount: 48,
    salesCount: 160,
    stock: 7,
    thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80'
    ],
    description: 'مک‌بوک پرو ۱۶ اینچی مجهز به تراشه فوق‌العاده M3 Max، ایده‌آل‌ترین انتخاب برای تدوین‌گران سینمایی، برنامه‌نویسان ارشد، هوش مصنوعی و طراحی سه‌بعدی است. با رنگ مشکی فضایی جدید (Space Black) که جذب اثر انگشت را کاهش می‌دهد.',
    features: [
      { key: 'پردازنده', value: 'Apple M3 Max (14-Core CPU / 30-Core GPU)' },
      { key: 'حافظه رم', value: '36 گیگابایت Unified Memory' },
      { key: 'حافظه ذخیره‌سازی', value: '1 ترابایت SSD فوق سریع' },
      { key: 'نمایشگر', value: '16.2 اینچ Liquid Retina XDR با روشنایی ۱۶۰۰ نیت' },
      { key: 'باتری', value: 'تا ۲۲ ساعت شارژدهی مداوم' }
    ],
    variants: {
      colors: [
        { name: 'مشکی فضایی (Space Black)', hex: '#2A2C2E' },
        { name: 'نقره‌ای (Silver)', hex: '#C2C4C6' }
      ]
    },
    sellers: [
      {
        id: 'seller-4',
        sellerId: 's-3',
        sellerName: 'اپل سنتر ایران',
        rating: 4.9,
        price: 184000000,
        discountPercentage: 8,
        stock: 5,
        shippingTime: 'ارسال فوری با بیمه کامل حمل و نقل',
        guarantee: '۱۸ ماه گارانتی الماس پایتخت + خدمات نرم‌افزاری'
      }
    ],
    reviews: [],
    qa: [],
    isFeatured: true,
    tags: ['مک بوک پرو m3 max', 'macbook pro 16', 'لپ تاپ اپل', 'لپ تاپ برنامه‌نویسی']
  },
  {
    id: 'prod-4',
    title: 'لپ‌تاپ گیمینگ 16 اینچی ایسوس مدل ROG Strix SCAR 16 (i9 14900HX / RTX 4080)',
    slug: 'asus-rog-strix-scar-16-rtx4080',
    enTitle: 'ASUS ROG Strix SCAR 16 G634JZR i9 14900HX 32GB 1TB SSD RTX 4080',
    brand: 'ایسوس (ASUS)',
    category: 'digital',
    subCategory: 'laptops',
    price: 142000000,
    discountPercentage: 5,
    rating: 4.7,
    reviewsCount: 65,
    salesCount: 230,
    stock: 9,
    thumbnail: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80'
    ],
    description: 'هیولای گیمینگ ایسوس با نسل ۱۴ اینتل Core i9-14900HX و کارت گرافیک NVIDIA GeForce RTX 4080 با توان ۱۷۵ وات. مجهز به نمایشگر Mini LED با نرخ نوسازی 240 هرتز و سیستم خنک‌کننده سه فنه با فلز مایع رسانای حرارت.',
    features: [
      { key: 'پردازنده', value: 'Intel Core i9-14900HX (24 Cores)' },
      { key: 'کارت گرافیک', value: 'NVIDIA RTX 4080 12GB GDDR6 (175W)' },
      { key: 'حافظه رم', value: '32 گیگابایت DDR5 5600MHz' },
      { key: 'نمایشگر', value: '16 اینچ ROG Nebula HDR 2.5K 240Hz' }
    ],
    variants: {},
    sellers: [
      {
        id: 'seller-5',
        sellerId: 's-4',
        sellerName: 'ایسوس تک سنتر',
        rating: 4.8,
        price: 142000000,
        discountPercentage: 5,
        stock: 9,
        shippingTime: 'ارسال فوری ۲۴ ساعته',
        guarantee: '۲۴ ماه گارانتی یکپارچه ایسوس + کیف و موس ارجینال'
      }
    ],
    reviews: [],
    qa: [],
    tags: ['لپ تاپ گیمینگ', 'ایسوس rog strix', 'rtx 4080', 'گیمینگ']
  },
  {
    id: 'prod-5',
    title: 'عطر ادوپرفیوم مردانه شنل بلو دو شنل Bleu de Chanel اصل فرانسه (100 میلی‌لیتر)',
    slug: 'bleu-de-chanel-edp-100ml',
    enTitle: 'Bleu de Chanel Eau de Parfum 100ml Made in France',
    brand: 'شنل (Chanel)',
    category: 'beauty',
    subCategory: 'fragrances',
    price: 9800000,
    discountPercentage: 15,
    rating: 4.9,
    reviewsCount: 310,
    salesCount: 1420,
    stock: 50,
    thumbnail: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35e3?w=800&q=80'
    ],
    description: 'بلو دو شنل ادوپرفیوم یکی از محبوب‌ترین و پرفروش‌ترین عطرهای مردانه تاریخ با رایحه‌ای چوبی، معطر و خنک. ترکیبی مسحورکننده از گریپ‌فروت، زنجبیل، نعناع هندی، سرو و چوب صندل که جذابیتی غیرقابل مقاومت به شما می‌بخشد.',
    features: [
      { key: 'نوع غلظت', value: 'ادوپرفیوم (Eau de Parfum)' },
      { key: 'حجم', value: '100 میلی‌لیتر' },
      { key: 'طبع و رایحه', value: 'خنک، تلخ و چوبی' },
      { key: 'کشور سازنده', value: 'فرانسه (Made in France)' },
      { key: 'ماندگاری', value: 'بسیار بالا (۱۲+ ساعت)' }
    ],
    variants: {
      sizes: ['50 میلی‌لیتر', '100 میلی‌لیتر', '150 میلی‌لیتر']
    },
    sellers: [
      {
        id: 'seller-6',
        sellerId: 's-5',
        sellerName: 'گالری عطر لیلیوم (ضمانت اصالت ۱۰۰٪)',
        rating: 4.9,
        price: 9800000,
        discountPercentage: 15,
        stock: 32,
        shippingTime: 'ارسال فوری',
        guarantee: 'ضمانت اصالت کالا با قابلیت مرجوعی بدون قید و شرط'
      }
    ],
    reviews: [],
    qa: [],
    isFlashSale: true,
    flashSaleEndsAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    isFeatured: true,
    tags: ['عطر مردانه', 'بلو دو شنل', 'bleu de chanel', 'ادوپرفیوم']
  },
  {
    id: 'prod-6',
    title: 'اسپرسوساز اتوماتیک دلونگی مدل Magnifica S ECAM 22.110.B با آسیاب سرامیکی',
    slug: 'delonghi-magnifica-s-ecam-22110b',
    enTitle: 'DeLonghi Magnifica S ECAM 22.110.B Automatic Espresso Machine',
    brand: 'دلونگی (DeLonghi)',
    category: 'home',
    subCategory: 'coffee-makers',
    price: 24500000,
    discountPercentage: 12,
    rating: 4.8,
    reviewsCount: 89,
    salesCount: 420,
    stock: 15,
    thumbnail: 'https://images.unsplash.com/photo-1517668808822-914e167925e2?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1517668808822-914e167925e2?w=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80'
    ],
    description: 'اسپرسوساز تمام اتوماتیک دلونگی ساخت ایتالیا با پمپ 15 بار، آسیاب داخلی ۱۳ درجه‌ای و سیستم کاپوتشینوساز حرفه‌ای. با یک دکمه از دانه تازه قهوه تا اسپرسویی با کرمای مخملی و غلیظ در کمتر از ۴۰ ثانیه آماده می‌شود.',
    features: [
      { key: 'توان مصرفی', value: '1450 وات' },
      { key: 'فشار پمپ', value: '15 بار واقعی' },
      { key: 'آسیاب داخلی', value: 'دارد، 13 درجه آسیاب سرامیکی' },
      { key: 'نازل بخار', value: 'دارد برای تهیه فوم شیر و کاپوتشینو' }
    ],
    variants: {},
    sellers: [
      {
        id: 'seller-7',
        sellerId: 's-6',
        sellerName: 'خانه قهوه ایتالیا',
        rating: 4.9,
        price: 24500000,
        discountPercentage: 12,
        stock: 15,
        shippingTime: 'ارسال فوری همراه با آموزش نصب',
        guarantee: '۲۴ ماه گارانتی سیحون + ۵ سال خدمات پس از فروش'
      }
    ],
    reviews: [],
    qa: [],
    isFeatured: true,
    tags: ['اسپرسوساز دلونگی', 'قهوه ساز اتوماتیک', 'delonghi magnifica', 'لوازم خانه']
  },
  {
    id: 'prod-7',
    title: 'دریل پیچ‌گوشتی چکشی شارژی 18 ولت بوش مدل GSB 18V-50 همراه با دو باتری',
    slug: 'bosch-gsb-18v-50-brushless-drill',
    enTitle: 'Bosch GSB 18V-50 Professional Brushless Cordless Combi Drill',
    brand: 'بوش (Bosch)',
    category: 'tools',
    subCategory: 'power-tools',
    price: 8900000,
    discountPercentage: 10,
    rating: 4.7,
    reviewsCount: 73,
    salesCount: 380,
    stock: 18,
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80'
    ],
    description: 'دریل چکشی شارژی حرفه‌ای بوش سری پروفشنال با موتور براشلس (بدون ذغال) با طول عمر بالا. گشتاور ۵۰ نیوتن‌متر، سه‌نظام فلزی ۱۳ میلی‌متری و دو عدد باتری لیتیومی 18 ولت 2 آمپرساعت به همراه کیف مقاوم L-BOXX.',
    features: [
      { key: 'ولتاژ باتری', value: '18 ولت لیتیوم-یون' },
      { key: 'نوع موتور', value: 'Brushless (بدون ذغال)' },
      { key: 'حداکثر گشتاور', value: '50 نیوتن‌متر' },
      { key: 'متعلقات', value: 'دو عدد باتری + شارژر سریع + کیف L-Case' }
    ],
    variants: {},
    sellers: [
      {
        id: 'seller-8',
        sellerId: 's-7',
        sellerName: 'ابزار صنعت بوش ایران',
        rating: 4.8,
        price: 8900000,
        discountPercentage: 10,
        stock: 18,
        shippingTime: 'ارسال فوری',
        guarantee: '۱۲ ماه گارانتی ابزارسرا (نماینده بوش)'
      }
    ],
    reviews: [],
    qa: [],
    tags: ['دریل شارژی بوش', 'ابزار برقی', 'bosch gsb', 'موتور براشلس']
  },
  {
    id: 'prod-8',
    title: 'کفش رانینگ مردانه نایکی مدل Nike Air Zoom Pegasus 40 اورجینال',
    slug: 'nike-air-zoom-pegasus-40-running-shoes',
    enTitle: 'Nike Air Zoom Pegasus 40 Men Road Running Shoes',
    brand: 'نایکی (Nike)',
    category: 'fashion',
    subCategory: 'shoes',
    price: 7600000,
    discountPercentage: 20,
    rating: 4.8,
    reviewsCount: 156,
    salesCount: 670,
    stock: 22,
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80'
    ],
    description: 'کفش رانینگ اسطوره‌ای نایکی پگاسوس ۴۰ با بالشتک‌های دوقلوی Air Zoom در پنجه و پاشنه و فوم فوق سبک Nike React. تنفس‌پذیری عالی رویه مش و طراحی ارگونومیک برای دویدن‌های طولانی و استفاده روزمره بدون خستگی.',
    features: [
      { key: 'تکنولوژی کفی', value: 'Nike Air Zoom + React Foam' },
      { key: 'جنس رویه', value: 'مش مهندسی‌شده تنفس‌پذیر' },
      { key: 'کاربرد', value: 'دویدن حرفه‌ای، پیاده‌روی، باشگاه و روزمره' },
      { key: 'وزن', value: 'حدود ۲۸۸ گرم' }
    ],
    variants: {
      colors: [
        { name: 'قرمز آتشی (Fire Red)', hex: '#E53E3E' },
        { name: 'مشکی کربنی (Carbon Black)', hex: '#1A202C' },
        { name: 'سفید یخی (Glacier White)', hex: '#EDF2F7' }
      ],
      sizes: ['40', '41', '42', '43', '44', '45']
    },
    sellers: [
      {
        id: 'seller-9',
        sellerId: 's-8',
        sellerName: 'اسپرت کده اورجینال',
        rating: 4.9,
        price: 7600000,
        discountPercentage: 20,
        stock: 22,
        shippingTime: 'ارسال فوری با جعبه اورجینال',
        guarantee: 'ضمانت اصالت ۱۰۰٪ بارکددار + امکان تعویض سایز'
      }
    ],
    reviews: [],
    qa: [],
    isFlashSale: true,
    flashSaleEndsAt: new Date(Date.now() + 36 * 3600 * 1000).toISOString(),
    isFeatured: true,
    tags: ['کفش نایک', 'nike pegasus 40', 'کفش رانینگ', 'کفش ورزشی']
  },
  {
    id: 'prod-9',
    title: 'ساعت هوشمند اپل واچ اولترا 2 مدل 49 میلی‌متر با بند Ocean Band',
    slug: 'apple-watch-ultra-2-49mm-ocean-band',
    enTitle: 'Apple Watch Ultra 2 49mm Titanium Case with Blue Ocean Band',
    brand: 'اپل واچ',
    category: 'digital',
    subCategory: 'smartwatches',
    price: 43500000,
    discountPercentage: 7,
    rating: 4.9,
    reviewsCount: 112,
    salesCount: 530,
    stock: 19,
    thumbnail: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80'
    ],
    description: 'اپل واچ اولترا ۲ با بدنه تیتانیومی ۴۹ میلی‌متری مقاوم در برابر ضربه و آب تا عمق ۱۰۰ متر، روشن‌ترین نمایشگر تاریخ اپل با روشنایی ۳۰۰۰ نیت و قابلیت جادویی Double Tap. مناسب ورزشکاران حرفه‌ای، غواصان و ماجراجویان.',
    features: [
      { key: 'جنس بدنه', value: 'تیتانیوم گرید ۵ (Titanium)' },
      { key: 'نمایشگر', value: 'Always-On Retina با روشنایی 3000 nits' },
      { key: 'مقاومت در برابر آب', value: 'تا عمق ۱۰۰ متر (گواهی EN13319 غواصی)' },
      { key: 'باتری', value: 'تا ۳۶ ساعت استفاده عادی / تا ۷۲ ساعت حالت Low Power' }
    ],
    variants: {
      colors: [
        { name: 'بند اقیانوس آبی (Blue Ocean)', hex: '#2B6CB0' },
        { name: 'بند آلپاین نارنجی (Orange Alpine)', hex: '#DD6B20' },
        { name: 'بند تریل زرد (Yellow Trail)', hex: '#D69E2E' }
      ]
    },
    sellers: [
      {
        id: 'seller-10',
        sellerId: 's-3',
        sellerName: 'اپل سنتر ایران',
        rating: 4.9,
        price: 43500000,
        discountPercentage: 7,
        stock: 19,
        shippingTime: 'ارسال فوری',
        guarantee: '۱۸ ماه گارانتی معتبر شرکتی'
      }
    ],
    reviews: [],
    qa: [],
    tags: ['اپل واچ اولترا 2', 'apple watch ultra 2', 'ساعت هوشمند']
  },
  {
    id: 'prod-10',
    title: 'کتاب عادت‌های اتمی (Atomic Habits) اثر جیمز کلیر - ترجمه هادی بهمنش',
    slug: 'atomic-habits-james-clear-book',
    enTitle: 'Atomic Habits by James Clear - Persian Translation',
    brand: 'نشر نوین',
    category: 'books',
    subCategory: 'psychology-books',
    price: 240000,
    discountPercentage: 25,
    rating: 4.9,
    reviewsCount: 450,
    salesCount: 3400,
    stock: 120,
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80'
    ],
    description: 'کتاب عادت‌های اتمی نوشته جیمز کلیر یکی از پرفروش‌ترین کتاب‌های روانشناسی و توسعه فردی نیویورک تایمز است که به زبانی ساده و علمی نشان می‌دهد چگونه تغییرات ۱ درصدی کوچک می‌توانند در طول زمان به نتایجی خارق‌العاده و تحول‌آفرین منجر شوند.',
    features: [
      { key: 'نویسنده', value: 'جیمز کلیر (James Clear)' },
      { key: 'مترجم', value: 'هادی بهمنش' },
      { key: 'انتشارات', value: 'نشر نوین توسعه' },
      { key: 'تعداد صفحات', value: '۲۸۰ صفحه - جلد شومیز' }
    ],
    variants: {},
    sellers: [
      {
        id: 'seller-11',
        sellerId: 's-9',
        sellerName: 'کتابفروشی مرکزی چشمه',
        rating: 4.9,
        price: 240000,
        discountPercentage: 25,
        stock: 120,
        shippingTime: 'ارسال روزانه سراسر کشور',
        guarantee: 'ضمانت سلامت فیزیکی کتاب'
      }
    ],
    reviews: [],
    qa: [],
    isFeatured: true,
    tags: ['عادت های اتمی', 'کتاب روانشناسی', 'جیمز کلیر', 'توسعه فردی']
  }
];

export const MOCK_BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'blog-1',
    title: 'راهنمای جامع خرید بهترین گوشی تا ۳۰ میلیون تومان در سال ۱۴۰۴',
    slug: 'best-smartphones-under-30-million',
    excerpt: 'در این مقاله به بررسی بهترین گوشی‌های میان‌رده و بالارده بازار از برندهای سامسونگ، شیائومی و موتورولا می‌پردازیم که ارزش خرید فوق‌العاده‌ای دارند.',
    content: 'گوشی‌های میان‌رده پیشرفته امروز قابلیت‌هایی نزدیک به پرچمداران ارائه می‌دهند. نمایشگرهای AMOLED با نرخ ۱۲۰ هرتز، دوربین‌های مجهز به لرزشگیر اپتیکال OIS و پردازنده‌های قدرتمند اسنپدراگون باعث شده‌اند کاربران با هزینه‌ای منطقی تجربه‌ای عالی داشته باشند...',
    category: 'راهنمای خرید دیجیتال',
    author: 'مهندس سامان رضایی',
    date: '۱۴۰۳/۱۰/۱۰',
    readTime: '۷ دقیقه مطالعه',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    tags: ['راهنمای خرید گوشی', 'بهترین گوشی سامسونگ', 'گوشی شیائومی']
  },
  {
    id: 'blog-2',
    title: '۵ ترفند طلایی برای افزایش عمر باتری مک‌بوک و لپ‌تاپ‌های ویندوزی',
    slug: 'how-to-improve-laptop-battery-life',
    excerpt: 'با رعایت چند نکته ساده نرم‌افزاری و سخت‌افزاری می‌توانید سلامت باتری لپ‌تاپ خود را برای سال‌های طولانی بالای ۹۰٪ حفظ کنید.',
    content: 'یکی از مهم‌ترین عوامل کاهش عمر باتری لیتیومی، قرار گرفتن مداوم در شارژ ۱۰۰ درصد یا تخلیه کامل تا صفر درصد است. استفاده از قابلیت Battery Charge Limit در ایسوس یا Optimized Battery Charging در مک‌بوک بهترین روش است...',
    category: 'آموزش و ترفند',
    author: 'سارا تهرانی',
    date: '۱۴۰۳/۱۰/۰۵',
    readTime: '۵ دقیقه مطالعه',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
    tags: ['باتری لپ تاپ', 'افزایش عمر مک بوک', 'ترفند ویندوز']
  },
  {
    id: 'blog-3',
    title: 'تفاوت عطر ادوپرفیوم (EdP) با ادوتویلت (EdT) چیست؟ کدام را بخریم؟',
    slug: 'eau-de-parfum-vs-eau-de-toilette-difference',
    excerpt: 'در هنگام خرید عطر با اصطلاحاتی نظیر پرفیوم، ادوپرفیوم، ادوتویلت و ادکلن مواجه می‌شویم. در این مطلب تفاوت غلظت و ماندگاری آن‌ها را توضیح می‌دهیم.',
    content: 'غلظت اسانس روغنی معطر اصلی‌ترین تفاوت انواع عطرهاست. پرفیوم خالص (Parfum) بین ۲۰ تا ۳۰ درصد غلظت دارد و بیشترین ماندگاری را ارائه می‌دهد. ادوپرفیوم (EdP) با ۱۵ تا ۲۰ درصد غلظت تعادل بی‌نظیری از ماندگاری و پخش بو دارد...',
    category: 'زیبایی و عطر',
    author: 'دکتر علیرضا کاظمی',
    date: '۱۴۰۳/۰۹/۲۸',
    readTime: '۶ دقیقه مطالعه',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
    tags: ['راهنمای خرید عطر', 'ادوپرفیوم', 'ادوتویلت', 'عطر اورجینال']
  }
];

export const DISCOUNT_COUPONS: Record<string, { percent: number; maxDiscount: number; description: string }> = {
  SHOPINO10: { percent: 10, maxDiscount: 2000000, description: '۱۰ درصد تخفیف تا سقف ۲ میلیون تومان' },
  SAVE20: { percent: 20, maxDiscount: 5000000, description: '۲۰ درصد تخفیف ویژه کاربران شاپینو' },
  VIP30: { percent: 30, maxDiscount: 10000000, description: '۳۰ درصد تخفیف ویژه مشتریان VIP' },
  DIGI50: { percent: 50, maxDiscount: 1000000, description: '۵۰ درصد تخفیف طلایی اولین خرید' }
};

export const MOCK_ORDERS = [
  {
    id: 'SHP-984210',
    date: '۱۴۰۳/۱۰/۱۲',
    status: 'shipped', // created, processing, shipped, delivered
    statusLabel: 'در حال ارسال توسط پیک',
    totalAmount: 78500000,
    discountAmount: 4710000,
    shippingAmount: 0,
    paymentMethod: 'درگاه آنلاین سامان (پرداخت شده)',
    items: [
      {
        id: 'item-101',
        productId: 'prod-1',
        title: 'گوشی موبایل اپل مدل iPhone 16 Pro Max دو سیم‌کارت ظرفیت 256 گیگابایت',
        variant: 'تیتانیوم صحرایی (Desert Titanium)',
        price: 78500000,
        quantity: 1,
        thumbnail: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&q=80',
        sellerName: 'دیجی‌سرویس اصل (نماینده رسمی)'
      }
    ],
    shippingAddress: {
      fullName: 'امیرحسین راد',
      phone: '09123456789',
      city: 'تهران',
      address: 'بزرگراه شهید مدرس، خیابان ظفر، پلاک ۴۲، واحد ۸',
      postalCode: '1918912345'
    }
  },
  {
    id: 'SHP-983154',
    date: '۱۴۰۳/۰۹/۲۵',
    status: 'delivered',
    statusLabel: 'تحویل داده شده',
    totalAmount: 9800000,
    discountAmount: 1470000,
    shippingAmount: 0,
    paymentMethod: 'کیف پول شاپینو',
    items: [
      {
        id: 'item-102',
        productId: 'prod-5',
        title: 'عطر ادوپرفیوم مردانه شنل بلو دو شنل Bleu de Chanel اصل فرانسه',
        variant: '100 میلی‌لیتر',
        price: 9800000,
        quantity: 1,
        thumbnail: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=200&q=80',
        sellerName: 'گالری عطر لیلیوم'
      }
    ],
    shippingAddress: {
      fullName: 'امیرحسین راد',
      phone: '09123456789',
      city: 'تهران',
      address: 'بزرگراه شهید مدرس، خیابان ظفر، پلاک ۴۲، واحد ۸',
      postalCode: '1918912345'
    }
  }
];
