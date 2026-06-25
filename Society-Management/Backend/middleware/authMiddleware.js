import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not authorized to access this route', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError('The user belonging to this token no longer exists', 401));
  }

  if (!user.isVerified) {
    return next(new AppError('Please verify your email address first', 403));
  }

  if (user.status === 'Pending') {
    return next(new AppError('Your registration request is pending admin approval', 403));
  }
  if (user.status === 'Suspended') {
    return next(new AppError('Your account has been suspended', 403));
  }
  if (user.status === 'Rejected') {
    return next(new AppError('Your registration request was rejected', 403));
  }

  req.user = user;
  next();
});

export default protect;
