const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.list = async (req, res, next) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
    res.json({ success: true, data: addresses });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { label, street, city, province, zipCode, country, isDefault } = req.body;
    if (isDefault) {
      await prisma.address.updateMany({ where: { userId: req.user.id }, data: { isDefault: false } });
    }
    const address = await prisma.address.create({
      data: { userId: req.user.id, label, street, city, province, zipCode, country: country || 'IR', isDefault: !!isDefault },
    });
    res.status(201).json({ success: true, data: address });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const existing = await prisma.address.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ error: 'Address not found.' });
    if (req.body.isDefault) {
      await prisma.address.updateMany({ where: { userId: req.user.id }, data: { isDefault: false } });
    }
    const address = await prisma.address.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: address });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const existing = await prisma.address.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ error: 'Address not found.' });
    await prisma.address.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Address deleted.' });
  } catch (err) { next(err); }
};
