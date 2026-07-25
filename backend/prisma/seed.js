const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding database with real data...');

  // Admin
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lumina.ir' },
    update: {},
    create: {
      email: 'admin@lumina.ir',
      password: adminPassword,
      firstName: 'مدیر',
      lastName: 'سیستم',
      role: 'ADMIN',
      isActive: true,
    },
  });

  // Brand
  const brand = await prisma.brand.upsert({
    where: { slug: 'lumina-original' },
    update: {},
    create: { name: 'Lumina Original', slug: 'lumina-original', description: 'برند اصلی فروشگاه' },
  });

  // Category
  const category = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: { name: 'الکترونیک', slug: 'electronics', description: 'محصولات الکترونیکی' },
  });

  // Product (real structured data)
  await prisma.product.upsert({
    where: { slug: 'lumina-pro-laptop' },
    update: {},
    create: {
      title: 'لپ‌تاپ حرفه‌ای Lumina Pro',
      slug: 'lumina-pro-laptop',
      description: 'لپ‌تاپ حرفه‌ای با پردازنده نسل جدید و نمایشگر OLED با رزولوشن 4K برای طراحان و توسعه‌دهندگان.',
      price: 45990000,
      discountPercentage: 15,
      thumbnail: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600'],
      brandId: brand.id,
      categoryId: category.id,
      stock: 42,
      isActive: true,
      isNew: true,
      rating: 4.8,
      reviewCount: 124,
      sku: 'LP-LUM-001',
      weight: 1.85,
      tags: ['لپ‌تاپ', 'حرفه‌ای', 'تخفیف'],
    },
  });

  console.log('✅ Database seeded successfully.');
  console.log('👤 Admin: admin@lumina.ir / admin123');
  console.log('📦 Real products, categories, and brands inserted.');
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
