import { PrismaClient, UserRole, OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = (pwd: string) => bcrypt.hashSync(pwd, 12);

  // Clean
  await prisma.review.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.user.deleteMany({});

  // Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@lumina.ir',
      firstName: 'مدیر',
      lastName: 'لومینا',
      phone: '09121234567',
      password: hash('admin123'),
      role: UserRole.ADMIN,
    },
  });

  const seller = await prisma.user.create({
    data: {
      email: 'seller@lumina.ir',
      firstName: 'فروشنده',
      lastName: 'لومینا',
      phone: '09129876543',
      password: hash('seller123'),
      role: UserRole.SELLER,
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@lumina.ir',
      firstName: 'کاربر',
      lastName: 'نمونه',
      phone: '09137654321',
      password: hash('user1234'),
      role: UserRole.CUSTOMER,
    },
  });

  await prisma.address.create({
    data: {
      userId: user.id,
      label: 'خانه',
      fullName: 'کاربر نمونه',
      street: 'خیابان ولیعصر، پلاک ۱',
      city: 'تهران',
      postalCode: '1234567890',
      country: 'Iran',
      isDefault: true,
    },
  });

  // Categories
  const categories = [
    { name: 'دیجیتال', slug: 'digital', description: 'محصولات دیجیتال و الکترونیک', image: 'https://images.unsplash.com/photo-1518770660439-4636500cff5f?w=600&q=80' },
    { name: 'موبایل', slug: 'mobile', description: 'گوشی و لوازم جانبی موبایل', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80' },
    { name: 'لپ‌تاپ', slug: 'laptop', description: 'لپ‌تاپ و کامپیوتر', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80' },
    { name: 'صوتی و تصویری', slug: 'audio-video', description: 'تلویزیون، هدفون و سیستم صوتی', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' },
    { name: 'خانه و آشپزخانه', slug: 'home-kitchen', description: 'لوازم خانگی و آشپزخانه', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80' },
    { name: 'مد و پوشاک', slug: 'fashion', description: 'پوشاک و مد', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80' },
    { name: 'زیبایی و سلامت', slug: 'beauty-health', description: 'محصولات زیبایی و سلامت', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80' },
    { name: 'ورزش و سفر', slug: 'sport-travel', description: 'لوازم ورزشی و سفر', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80' },
  ];

  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }

  // Brands
  const brands = [
    { name: 'Apple', slug: 'apple', description: 'اپل', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
    { name: 'Samsung', slug: 'samsung', description: 'سامسونگ', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
    { name: 'Sony', slug: 'sony', description: 'سونی', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Sony_logo.svg' },
    { name: 'Xiaomi', slug: 'xiaomi', description: 'شیائومی', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Mi_logo.svg' },
    { name: 'Asus', slug: 'asus', description: 'ایسوس', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/AsusTek_Computer_logo.svg' },
    { name: 'LG', slug: 'lg', description: 'ال‌جی', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/29/LG_logo.svg' },
    { name: 'Bosch', slug: 'bosch', description: 'بوش', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Bosch-logo.svg' },
    { name: 'Nike', slug: 'nike', description: 'نایکی', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
    { name: 'Adidas', slug: 'adidas', description: 'آدیداس', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
    { name: 'Lumina', slug: 'lumina', description: 'لومینا', logo: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=300&q=80' },
  ];

  for (const b of brands) {
    await prisma.brand.create({ data: b });
  }

  const catMobile = await prisma.category.findUnique({ where: { slug: 'mobile' } });
  const catLaptop = await prisma.category.findUnique({ where: { slug: 'laptop' } });
  const catAudio = await prisma.category.findUnique({ where: { slug: 'audio-video' } });
  const catKitchen = await prisma.category.findUnique({ where: { slug: 'home-kitchen' } });
  const catFashion = await prisma.category.findUnique({ where: { slug: 'fashion' } });
  const catBeauty = await prisma.category.findUnique({ where: { slug: 'beauty-health' } });
  const catSport = await prisma.category.findUnique({ where: { slug: 'sport-travel' } });
  const catDigital = await prisma.category.findUnique({ where: { slug: 'digital' } });

  const brandApple = await prisma.brand.findUnique({ where: { slug: 'apple' } });
  const brandSamsung = await prisma.brand.findUnique({ where: { slug: 'samsung' } });
  const brandXiaomi = await prisma.brand.findUnique({ where: { slug: 'xiaomi' } });
  const brandAsus = await prisma.brand.findUnique({ where: { slug: 'asus' } });
  const brandSony = await prisma.brand.findUnique({ where: { slug: 'sony' } });
  const brandLG = await prisma.brand.findUnique({ where: { slug: 'lg' } });
  const brandBosch = await prisma.brand.findUnique({ where: { slug: 'bosch' } });
  const brandNike = await prisma.brand.findUnique({ where: { slug: 'nike' } });
  const brandAdidas = await prisma.brand.findUnique({ where: { slug: 'adidas' } });
  const brandLumina = await prisma.brand.findUnique({ where: { slug: 'lumina' } });

  const products = [
    {
      title: 'آیفون ۱۵ پرو مکس', slug: 'iphone-15-pro-max', description: 'پرچم‌دار جدید اپل با تراشه A17 Pro، دوربین حرفه‌ای و نمایشگر Super Retina XDR.',
      price: 68900000, discountPercentage: 5, stock: 15, sku: 'IPH-15-PM-001', thumbnail: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80',
      images: ['https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80', 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80'],
      tags: ['جدید', 'پرچم‌دار', 'اپل'], isNew: true, isFlashSale: true, categoryId: catMobile!.id, brandId: brandApple!.id, rating: 4.9, reviewCount: 128,
    },
    {
      title: 'گلکسی S24 Ultra', slug: 'galaxy-s24-ultra', description: 'فوق‌العاده‌ترین گوشی سامسونگ با قلم S Pen، نمایشگر Dynamic AMOLED 2X و دوربین ۲۰۰ مگاپیکسلی.',
      price: 72500000, discountPercentage: 8, stock: 22, sku: 'SAM-S24-U-002', thumbnail: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
      images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80'],
      tags: ['جدید', 'پرچم‌دار', 'سامسونگ'], isNew: true, isFlashSale: false, categoryId: catMobile!.id, brandId: brandSamsung!.id, rating: 4.8, reviewCount: 95,
    },
    {
      title: 'شیائومی ۱۴T Pro', slug: 'xiaomi-14t-pro', description: 'قدرت بی‌نظیر با تراشه Snapdragon 8 Gen 3، نمایشگر AMOLED 144Hz و شارژ ۱۲۰ وات.',
      price: 42500000, discountPercentage: 12, stock: 35, sku: 'XMI-14T-P-003', thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80'],
      tags: ['جدید', 'پرچم‌دار'], isNew: true, isFlashSale: false, categoryId: catMobile!.id, brandId: brandXiaomi!.id, rating: 4.7, reviewCount: 203,
    },
    {
      title: 'مک‌بوک پرو M3', slug: 'macbook-pro-m3', description: 'لپ‌تاپ حرفه‌ای اپل با تراشه Apple M3 Pro، نمایشگر Liquid Retina XDR و عمر باتری طولانی.',
      price: 128000000, discountPercentage: 3, stock: 8, sku: 'APL-MBP-M3-004', thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80'],
      tags: ['جدید', 'لپ‌تاپ', 'اپل'], isNew: true, isFlashSale: false, categoryId: catLaptop!.id, brandId: brandApple!.id, rating: 4.9, reviewCount: 64,
    },
    {
      title: 'ایسوس ROG G14', slug: 'asus-rog-g14', description: 'لپ‌تاپ گیمینگ فوق‌العاده با پردازنده AMD Ryzen 9، کارت گرافیک RTX 4070 و نمایشگر 165Hz.',
      price: 98500000, discountPercentage: 7, stock: 12, sku: 'ASU-ROG-G14-005', thumbnail: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',
      images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80', 'https://images.unsplash.com/photo-1593642532400-2682810b89ca?w=800&q=80'],
      tags: ['گیمینگ', 'لپ‌تاپ', 'ایسوس'], isNew: false, isFlashSale: true, categoryId: catLaptop!.id, brandId: brandAsus!.id, rating: 4.6, reviewCount: 42,
    },
    {
      title: 'سونی WH-1000XM5', slug: 'sony-wh-1000xm5', description: 'بهترین هدفون نویزکنسلینگ با صدای Hi-Res، عمر باتری ۳۰ ساعت و طراحی فوق‌العاده راحت.',
      price: 22400000, discountPercentage: 15, stock: 28, sku: 'SON-WH-1000XM5-006', thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 'https://images.unsplash.com/photo-1585298723682-7115561d661e?w=800&q=80'],
      tags: ['صوتی', 'هدفون', 'سونی'], isNew: false, isFlashSale: false, categoryId: catAudio!.id, brandId: brandSony!.id, rating: 4.8, reviewCount: 312,
    },
    {
      title: 'ال‌جی OLED C3', slug: 'lg-oled-c3', description: 'تلویزیون ۴K OLED با پردازنده α9 Gen 6 AI، نرخ تازه‌سازی ۱۲۰Hz و سیستم صوتی Dolby Atmos.',
      price: 98500000, discountPercentage: 10, stock: 5, sku: 'LG-OLED-C3-007', thumbnail: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80',
      images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'],
      tags: ['تلویزیون', 'OLED', 'ال‌جی'], isNew: false, isFlashSale: true, categoryId: catAudio!.id, brandId: brandLG!.id, rating: 4.9, reviewCount: 87,
    },
    {
      title: 'ربات جاروبرقی شیائومی', slug: 'xiaomi-robot-vacuum', description: 'جاروبرقی هوشمند با نقشه‌برداری LiDAR، مکش قدرتمند ۵۰۰۰Pa و شارژ خودکار.',
      price: 28500000, discountPercentage: 20, stock: 40, sku: 'XMI-RV-001-008', thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
      images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80'],
      tags: ['خانه', 'ربات', 'شیائومی'], isNew: false, isFlashSale: false, categoryId: catKitchen!.id, brandId: brandXiaomi!.id, rating: 4.5, reviewCount: 156,
    },
    {
      title: 'مخلوط‌کن بوش', slug: 'bosch-blender', description: 'مخلوط‌کن حرفه‌ای بوش با قدرت ۱۲۰۰ وات، تیغه‌های استیل ضدزنگ و ۵ برنامه خودکار.',
      price: 12800000, discountPercentage: 18, stock: 18, sku: 'BOS-BL-1200-009', thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
      images: ['https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80'],
      tags: ['آشپزخانه', 'بوش'], isNew: false, isFlashSale: true, categoryId: catKitchen!.id, brandId: brandBosch!.id, rating: 4.4, reviewCount: 89,
    },
    {
      title: 'نایکی پگاسوس ۴۰', slug: 'nike-pegasus-40', description: 'کفش دویدن حرفه‌ای با فوم React و طراحی سبک برای عملکرد بهتر در هر مسافت.',
      price: 9850000, discountPercentage: 10, stock: 60, sku: 'NKE-PEG-40-010', thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80'],
      tags: ['ورزش', 'کفش', 'نایکی'], isNew: false, isFlashSale: false, categoryId: catSport!.id, brandId: brandNike!.id, rating: 4.7, reviewCount: 420,
    },
    {
      title: 'آدیداس اولترابوست', slug: 'adidas-ultraboost', description: 'کفش ورزشی با فناوری Boost برای بازگشت انرژی و راحتی بی‌نظیر در طول روز.',
      price: 12500000, discountPercentage: 15, stock: 25, sku: 'ADI-UB-001-011', thumbnail: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
      images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'],
      tags: ['ورزش', 'کفش', 'آدیداس'], isNew: true, isFlashSale: true, categoryId: catSport!.id, brandId: brandAdidas!.id, rating: 4.8, reviewCount: 275,
    },
    {
      title: 'تی‌شرت لومینا', slug: 'lumina-tshirt', description: 'تی‌شرت پنبه‌ای ۱۰۰٪ با طراحی مینیمال و چاپ باکیفیت، مناسب برای استفاده روزانه.',
      price: 850000, discountPercentage: 0, stock: 200, sku: 'LUM-TSH-001-012', thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80'],
      tags: ['پوشاک', 'تی‌شرت', 'لومینا'], isNew: false, isFlashSale: false, categoryId: catFashion!.id, brandId: brandLumina!.id, rating: 4.3, reviewCount: 34,
    },
    {
      title: 'مرطوب‌کننده لومینا', slug: 'lumina-moisturizer', description: 'مرطوب‌کننده پوست با ترکیبات طبیعی، بدون چربی و مناسب برای انواع پوست.',
      price: 1200000, discountPercentage: 8, stock: 120, sku: 'LUM-MST-001-013', thumbnail: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80',
      images: ['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80'],
      tags: ['زیبایی', 'پوست', 'لومینا'], isNew: false, isFlashSale: true, categoryId: catBeauty!.id, brandId: brandLumina!.id, rating: 4.6, reviewCount: 78,
    },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        price: p.price,
        discountPercentage: p.discountPercentage,
        stock: p.stock,
        sku: p.sku,
        thumbnail: p.thumbnail,
        images: p.images,
        tags: p.tags,
        rating: p.rating,
        reviewCount: p.reviewCount,
        isNew: p.isNew,
        isFlashSale: p.isFlashSale,
        isActive: true,
        categoryId: p.categoryId,
        brandId: p.brandId,
      },
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
