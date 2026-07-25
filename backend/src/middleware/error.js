exports.errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  console.error(err.stack);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

exports.notFound = (req, res, next) => {
  const error = new Error(`Not Found — ${req.originalUrl}`);
  error.status = 404;
  next(error);
};
