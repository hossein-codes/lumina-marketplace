const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const config = require('../../config');

const prisma = new PrismaClient();

exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashed, firstName, lastName, phone },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    res.status(201).json({ success: true, user, token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials or account deactivated.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    res.json({ success: true, token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
