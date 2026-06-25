import AppError from '../utils/AppError.js';
import { ROLE_PERMISSIONS } from '../constants/roles.js';

export const requirePermission = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];

    const hasAllPermissions = requiredPermissions.every((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasAllPermissions) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};

export default requirePermission;
