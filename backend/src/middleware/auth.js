const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const config = require('../config');

const prisma = new PrismaClient();

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId, isActive: true },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token or user deactivated.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated.' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access forbidden. Insufficient privileges.' });
    }
    next();
  };
};
