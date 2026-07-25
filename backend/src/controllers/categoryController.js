const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.list = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: { children: true, _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: categories });
  } catch (err) { next(err); }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: { children: true, parent: true },
    });
    if (!category) return res.status(404).json({ error: 'Category not found.' });
    res.json({ success: true, data: category });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, slug, description, image, parentId } = req.body;
    const category = await prisma.category.create({ data: { name, slug, description, image, parentId: parentId || null } });
    res.status(201).json({ success: true, data: category });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const category = await prisma.category.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: category });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Category deleted.' });
  } catch (err) { next(err); }
};
