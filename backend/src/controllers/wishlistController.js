const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getWishlist = async (req, res, next) => {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
};

exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const item = await prisma.wishlistItem.upsert({
      where: { userId_productId: { userId: req.user.id, productId } },
      update: {},
      create: { userId: req.user.id, productId },
      include: { product: true },
    });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    await prisma.wishlistItem.delete({
      where: { userId_productId: { userId: req.user.id, productId: req.params.productId } },
    });
    res.json({ success: true, message: 'Removed from wishlist.' });
  } catch (err) { next(err); }
};
