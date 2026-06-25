import ApiResponse from '../utils/apiResponse.js';

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Resource not found / Invalid ID format';
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map((val) => val.message);
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
    errors = err.keyValue;
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your session has expired. Please log in again.';
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const stack = isProduction ? null : err.stack;

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(err.isOperational === false && isProduction ? { message: 'Something went wrong' } : {}),
    ...(stack && { stack }),
  });
};
