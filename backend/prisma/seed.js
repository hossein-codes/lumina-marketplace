const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding database...');

  // ---- Users ----
  const [adminPass, sellerPass, customerPass] = await Promise.all([
    bcrypt.hash('admin123', 12),
    bcrypt.hash('seller123', 12),
    bcrypt.hash('user1234', 12),
  ]);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@lumina.ir' },
    update: {},
    create: { email: 'admin@lumina.ir', password: adminPass, firstName: 'مدیر', lastName: 'سیستم', role: 'ADMIN', emailVerified: true },
  });
  const seller = await prisma.user.upsert({
    where: { email: 'seller@lumina.ir' },
    update: {},
    create: { email: 'seller@lumina.ir', password: sellerPass, firstName: 'فروشنده', lastName: 'نمونه', role: 'SELLER', emailVerified: true },
  });
  const customer = await prisma.user.upsert({
    where: { email: 'user@lumina.ir' },
    update: {},
    create: { email: 'user@lumina.ir', password: customerPass, firstName: 'کاربر', lastName: 'نمونه', role: 'CUSTOMER', emailVerified: true },
  });

  // ---- Categories ----
  const categoriesData = [
    { name: 'دیجیتال', slug: 'digital', description: 'کالای دیجیتال', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600' },
    { name: 'موبایل', slug: 'mobile', description: 'گوشی و لوازم جانبی', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=600' },
    { name: 'لپ‌تاپ', slug: 'laptop', description: 'انواع لپ‌تاپ', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600' },
    { name: 'صوتی و تصویری', slug: 'audio-video', description: 'هدفون، اسپیکر، تلویزیون', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600' },
    { name: 'خانه و آشپزخانه', slug: 'home-kitchen', description: 'لوازم خانگی', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600' },
    { name: 'مد و پوشاک', slug: 'fashion', description: 'پوشاک زنانه و مردانه', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600' },
    { name: 'زیبایی و سلامت', slug: 'beauty', description: 'محصولات آرایشی و بهداشتی', image: 'https://images.unsplash.com/photo-1522335789203-aaa60eff30ea?w=600' },
    { name: 'ورزش و سفر', slug: 'sports', description: 'لوازم ورزشی', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600' },
  ];
  const categories = {};
  for (const c of categoriesData) {
    categories[c.slug] = await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  // ---- Brands ----
  const brandsData = [
    { name: 'Apple', slug: 'apple', description: 'Think different', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
    { name: 'Samsung', slug: 'samsung', description: 'Do what you can\'t' },
    { name: 'Sony', slug: 'sony' },
    { name: 'Xiaomi', slug: 'xiaomi' },
    { name: 'Asus', slug: 'asus' },
    { name: 'LG', slug: 'lg' },
    { name: 'Bosch', slug: 'bosch' },
    { name: 'Nike', slug: 'nike' },
    { name: 'Adidas', slug: 'adidas' },
    { name: 'Lumina', slug: 'lumina', description: 'برند اختصاصی فروشگاه لومینا' },
  ];
  const brands = {};
  for (const b of brandsData) {
    brands[b.slug] = await prisma.brand.upsert({ where: { slug: b.slug }, update: {}, create: b });
  }

  // ---- Products ----
  const productsData = [
    { title: 'گوشی iPhone 15 Pro Max 256GB', slug: 'iphone-15-pro-max-256', description: 'پرچمدار اپل با تراشه A17 Pro، دوربین 48MP و نمایشگر ProMotion.', price: 78000000, discountPercentage: 8, thumbnail: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=600', images: ['https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800'], categorySlug: 'mobile', brandSlug: 'apple', stock: 24, isNew: true, isFlashSale: false, rating: 4.9, reviewCount: 210, sku: 'APL-IP15PM-256', tags: ['گوشی', 'پرچمدار', 'اپل'] },
    { title: 'گوشی Samsung Galaxy S24 Ultra', slug: 'galaxy-s24-ultra', description: 'زوم اپتیکال 10x، قلم S-Pen و پردازنده Snapdragon 8 Gen 3.', price: 62000000, discountPercentage: 12, thumbnail: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600', images: [], categorySlug: 'mobile', brandSlug: 'samsung', stock: 40, isNew: true, rating: 4.8, reviewCount: 180, sku: 'SAM-S24U', tags: ['گوشی', 'اندروید'] },
    { title: 'شیائومی 14T Pro', slug: 'xiaomi-14t-pro', description: 'دوربین Leica، شارژ سریع 120 وات و صفحه AMOLED.', price: 32000000, discountPercentage: 15, thumbnail: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600', images: [], categorySlug: 'mobile', brandSlug: 'xiaomi', stock: 60, isFlashSale: true, rating: 4.6, reviewCount: 95, sku: 'XMI-14TP', tags: ['گوشی', 'دوربین', 'شارژ-سریع'] },

    { title: 'لپ‌تاپ MacBook Pro 14 M3 Pro', slug: 'macbook-pro-14-m3-pro', description: 'قدرت M3 Pro با نمایشگر Liquid Retina XDR.', price: 145000000, discountPercentage: 5, thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', images: [], categorySlug: 'laptop', brandSlug: 'apple', stock: 12, rating: 4.9, reviewCount: 88, sku: 'APL-MBP14-M3P', tags: ['لپ‌تاپ', 'حرفه‌ای'] },
    { title: 'لپ‌تاپ ASUS ROG Zephyrus G14', slug: 'asus-rog-zephyrus-g14', description: 'گیمینگ سبک با RTX 4070 و AMD Ryzen 9.', price: 88000000, discountPercentage: 10, thumbnail: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600', images: [], categorySlug: 'laptop', brandSlug: 'asus', stock: 18, isNew: true, rating: 4.7, reviewCount: 64, sku: 'ASU-G14', tags: ['گیمینگ'] },

    { title: 'هدفون Sony WH-1000XM5', slug: 'sony-wh-1000xm5', description: 'حذف نویز فعال کلاس جهانی و باتری 30 ساعته.', price: 18500000, discountPercentage: 20, thumbnail: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600', images: [], categorySlug: 'audio-video', brandSlug: 'sony', stock: 55, isFlashSale: true, rating: 4.8, reviewCount: 302, sku: 'SNY-WH1000XM5', tags: ['هدفون', 'نویزکنسل'] },
    { title: 'تلویزیون LG OLED C3 55 اینچ', slug: 'lg-oled-c3-55', description: 'صفحه OLED evo با فرکانس 120Hz، ایده‌آل برای گیم و فیلم.', price: 72000000, discountPercentage: 7, thumbnail: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600', images: [], categorySlug: 'audio-video', brandSlug: 'lg', stock: 9, rating: 4.9, reviewCount: 47, sku: 'LG-OLED-C3-55', tags: ['تلویزیون', 'OLED'] },

    { title: 'جاروبرقی رباتیک Xiaomi', slug: 'xiaomi-robot-vacuum', description: 'جارو رباتیک هوشمند با نقشه‌برداری لیزری.', price: 22000000, discountPercentage: 18, thumbnail: 'https://images.unsplash.com/photo-1518444023931-84e3466a1e58?w=600', images: [], categorySlug: 'home-kitchen', brandSlug: 'xiaomi', stock: 30, rating: 4.5, reviewCount: 71, sku: 'XMI-RV', tags: ['خانه', 'هوشمند'] },
    { title: 'مخلوط‌کن Bosch سری 4', slug: 'bosch-blender-series-4', description: 'موتور 800 وات، تیغه ضدزنگ و ظرفیت 1.5 لیتر.', price: 4500000, discountPercentage: 25, thumbnail: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600', images: [], categorySlug: 'home-kitchen', brandSlug: 'bosch', stock: 120, isFlashSale: true, rating: 4.4, reviewCount: 156, sku: 'BSH-BL4', tags: ['آشپزخانه'] },

    { title: 'کفش ورزشی Nike Air Zoom Pegasus 41', slug: 'nike-pegasus-41', description: 'کفش دویدن روزانه با ReactX و Air Zoom.', price: 6800000, discountPercentage: 0, thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', images: [], categorySlug: 'sports', brandSlug: 'nike', stock: 44, isNew: true, rating: 4.6, reviewCount: 89, sku: 'NKE-PEG41', tags: ['کفش', 'دویدن'] },
    { title: 'کفش Adidas Ultraboost Light', slug: 'adidas-ultraboost-light', description: 'راحتی بی‌نظیر با فوم Boost نسل جدید.', price: 7900000, discountPercentage: 12, thumbnail: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600', images: [], categorySlug: 'sports', brandSlug: 'adidas', stock: 33, rating: 4.7, reviewCount: 51, sku: 'ADS-UBL', tags: ['کفش'] },

    { title: 'تی‌شرت مردانه Lumina Basic', slug: 'lumina-basic-tshirt-men', description: 'پارچه پنبه ۱۰۰٪، دوخت حرفه‌ای، رنگ‌های متنوع.', price: 480000, discountPercentage: 30, thumbnail: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=600', images: [], categorySlug: 'fashion', brandSlug: 'lumina', stock: 250, isFlashSale: true, rating: 4.3, reviewCount: 402, sku: 'LUM-TSHM', tags: ['پوشاک', 'پایه'] },
    { title: 'کرم مرطوب‌کننده Lumina Aqua', slug: 'lumina-aqua-moisturizer', description: 'مرطوب‌کننده روزانه با اسید هیالورونیک برای همه پوست‌ها.', price: 320000, discountPercentage: 10, thumbnail: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600', images: [], categorySlug: 'beauty', brandSlug: 'lumina', stock: 500, rating: 4.5, reviewCount: 210, sku: 'LUM-AQMOIST', tags: ['زیبایی', 'پوست'] },
  ];

  for (const p of productsData) {
    const { categorySlug, brandSlug, ...rest } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...rest,
        categoryId: categories[categorySlug].id,
        brandId: brands[brandSlug].id,
      },
    });
  }

  // ---- Address for customer ----
  await prisma.address.upsert({
    where: { id: 'seed-address-1' },
    update: {},
    create: {
      id: 'seed-address-1',
      userId: customer.id,
      label: 'خانه',
      street: 'خیابان ولیعصر، پلاک ۱۲۳',
      city: 'تهران',
      province: 'تهران',
      zipCode: '1234567890',
      country: 'IR',
      isDefault: true,
    },
  });

  console.log('✅ Seed complete.');
  console.log(`   Admin:    admin@lumina.ir    / admin123`);
  console.log(`   Seller:   seller@lumina.ir   / seller123`);
  console.log(`   Customer: user@lumina.ir     / user1234`);
  console.log(`   Products: ${productsData.length}, Categories: ${categoriesData.length}, Brands: ${brandsData.length}`);
}

seed()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
