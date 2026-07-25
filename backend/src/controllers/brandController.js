const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.list = async (req, res, next) => {
  try {
    const brands = await prisma.brand.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: brands });
  } catch (err) { next(err); }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const brand = await prisma.brand.findUnique({ where: { slug: req.params.slug } });
    if (!brand) return res.status(404).json({ error: 'Brand not found.' });
    res.json({ success: true, data: brand });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const brand = await prisma.brand.create({ data: req.body });
    res.status(201).json({ success: true, data: brand });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const brand = await prisma.brand.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: brand });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await prisma.brand.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Brand deleted.' });
  } catch (err) { next(err); }
};
