const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be between 1 and 5.' });

    const review = await prisma.review.create({
      data: { userId: req.user.id, productId, rating: parseInt(rating), comment },
      include: { user: { select: { firstName: true, lastName: true } }, product: true },
    });

    // Update product average rating
    const reviews = await prisma.review.findMany({ where: { productId }, select: { rating: true } });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await prisma.product.update({ where: { id: productId }, data: { rating: avg, reviewCount: reviews.length } });

    res.status(201).json({ success: true, data: review });
  } catch (err) { next(err); }
};

exports.getReviewsByProduct = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: req.params.productId },
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: reviews });
  } catch (err) { next(err); }
};

exports.getMyReviews = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });
    res.json({ success: true, data: reviews });
  } catch (err) { next(err); }
};
