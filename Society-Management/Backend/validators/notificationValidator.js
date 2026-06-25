import { body } from 'express-validator';
import validateRequest from '../middleware/validateMiddleware.js';

export const updatePreferencesValidator = [
  body('email')
    .optional()
    .isBoolean()
    .withMessage('Email preference must be a boolean value'),

  body('inApp')
    .optional()
    .isBoolean()
    .withMessage('InApp preference must be a boolean value'),

  validateRequest,
];
