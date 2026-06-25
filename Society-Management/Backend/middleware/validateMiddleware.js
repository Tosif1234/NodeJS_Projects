import { validationResult } from 'express-validator';
import ApiResponse from '../utils/apiResponse.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = {};
    errors.array().forEach((err) => {
      const field = err.path || err.param;
      formattedErrors[field] = err.msg;
    });

    return ApiResponse.error(res, 'Validation failed', 400, formattedErrors);
  }
  next();
};

export default validateRequest;
