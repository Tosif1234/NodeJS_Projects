import AppError from '../utils/AppError.js';

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(`Role '${req.user.role}' is not authorized to access this resource`, 403));
    }

    next();
  };
};

export default requireRole;
