const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, brand, search, sort = 'createdAt' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { isActive: true };
    if (category) where.category = { slug: category };
    if (brand) where.brand = { slug: brand };
    if (search) where.title = { contains: search, mode: 'insensitive' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { brand: true, category: true, reviews: true },
        skip,
        take: parseInt(limit),
        orderBy: { [sort]: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({ success: true, data: products, meta: { page: parseInt(page), limit: parseInt(limit), total } });
  } catch (err) { next(err); }
};

exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: { brand: true, category: true, reviews: { include: { user: { select: { firstName: true } } } } },
    });
    if (!product || !product.isActive) return res.status(404).json({ error: 'Product not found.' });
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
};

exports.createProduct = async (req, res, next) => {
  try {
    const data = { ...req.body, price: parseFloat(req.body.price), discountPercentage: req.body.discountPercentage ? parseFloat(req.body.discountPercentage) : null, stock: parseInt(req.body.stock) || 0 };
    const product = await prisma.product.create({ data, include: { brand: true, category: true } });
    res.status(201).json({ success: true, data: product });
  } catch (err) { next(err); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.update({ where: { id: req.params.id }, data: req.body, include: { brand: true, category: true } });
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await prisma.product.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ success: true, message: 'Product deactivated.' });
  } catch (err) { next(err); }
};
