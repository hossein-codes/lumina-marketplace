const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCart = async (req, res, next) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
    });
    res.json({ success: true, data: cart || { items: [] } });
  } catch (err) { next(err); }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    let cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) cart = await prisma.cart.create({ data: { userId: req.user.id } });

    const item = await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      update: { quantity: { increment: parseInt(quantity) } },
      create: { cartId: cart.id, productId, quantity: parseInt(quantity) },
      include: { product: true },
    });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const item = await prisma.cartItem.update({
      where: { id: req.params.itemId, cart: { userId: req.user.id } },
      data: { quantity: parseInt(req.body.quantity) },
    });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    await prisma.cartItem.delete({
      where: { id: req.params.itemId, cart: { userId: req.user.id } },
    });
    res.json({ success: true, message: 'Item removed from cart.' });
  } catch (err) { next(err); }
};

exports.clearCart = async (req, res, next) => {
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    res.json({ success: true, message: 'Cart cleared.' });
  } catch (err) { next(err); }
};
