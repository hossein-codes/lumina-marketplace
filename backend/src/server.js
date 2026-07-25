const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('../config');
const errorMiddleware = require('./middleware/error');

const app = express();

// ==========================================
// Security
// ==========================================
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

// CORS — accept configured origin(s)
const allowedOrigins = (config.cors.origin || 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim());
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // curl / mobile
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Rate limiting — reasonable for a real app
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again later.' },
});
app.use('/api/', limiter);

// Simple sanitization (defense in depth)
app.use((req, res, next) => {
  const sanitize = (s) => (typeof s === 'string' ? s.replace(/<script/gi, '&lt;script') : s);
  const walk = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    for (const k of Object.keys(obj)) {
      if (typeof obj[k] === 'string') obj[k] = sanitize(obj[k]);
      else if (typeof obj[k] === 'object') walk(obj[k]);
    }
  };
  walk(req.body);
  walk(req.query);
  next();
});

// Health
app.get('/api/health', (req, res) =>
  res.json({
    success: true,
    status: 'healthy',
    service: 'lumina-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/addresses', require('./routes/addresses'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/brands', require('./routes/brands'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', require('./routes/admin'));

// 404 + error
app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

if (require.main === module) {
  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`✅ Lumina Backend running on port ${PORT}`);
    console.log(`🌐 Environment: ${config.env}`);
    console.log(`📡 API Base: http://localhost:${PORT}/api`);
    console.log(`🔒 CORS allowed origins: ${allowedOrigins.join(', ')}`);
    console.log(`========================================\n`);
  });
}

module.exports = app;
