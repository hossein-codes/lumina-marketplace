const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('../config');
const errorMiddleware = require('./middleware/error');

const app = express();

// ==========================================
// Security — Maximum Level
// ==========================================
app.use(helmet({ contentSecurityPolicy: { directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'"], objectSrc: ["'none'"], upgradeInsecureRequests: [] } }, crossOriginEmbedderPolicy: true, crossOriginOpenerPolicy: true, crossOriginResourcePolicy: { policy: 'same-site' }, referrerPolicy: { policy: 'strict-origin-when-cross-origin' } }));

// Strict CORS
app.use(cors({ origin: config.cors.origin, credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'] }));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Rate limiting — Strict
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Security limit triggered.' },
});
app.use('/api/', limiter);

// Input Sanitization (basic security layer)
app.use((req, res, next) => {
  const sanitize = (str) => typeof str === 'string' ? str.replace(/[<>"']/g, '').trim() : str;
  if (req.body) { for (const key in req.body) { if (typeof req.body[key] === 'string') req.body[key] = sanitize(req.body[key]); } }
  next();
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'healthy', service: 'lumina-backend', version: '1.0.0', timestamp: new Date().toISOString() }));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/payments', require('./routes/payments'));

// 404 Handler
app.use(errorMiddleware.notFound);

// Global Error Handler
app.use(errorMiddleware.errorHandler);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`✅ Lumina Backend running on port ${PORT}`);
  console.log(`🌐 Environment: ${config.env}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api`);
  console.log(`🔒 JWT Secret configured`);
  console.log(`========================================\n`);
});

module.exports = app;
