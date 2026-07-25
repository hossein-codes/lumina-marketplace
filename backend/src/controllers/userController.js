const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

exports.getProfile = async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, include: { addresses: true } });
  res.json({ success: true, data: user });
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const user = await prisma.user.update({ where: { id: req.user.id }, data: { firstName, lastName, phone } });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(400).json({ error: 'Current password is incorrect.' });
    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: req.user.id }, data: { password: hashed } });
    res.json({ success: true, message: 'Password updated.' });
  } catch (err) { next(err); }
};
