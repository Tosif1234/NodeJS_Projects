import { body } from 'express-validator';
import validateRequest from '../middleware/validateMiddleware.js';

export const createPollValidator = [
  body('question')
    .notEmpty()
    .withMessage('Poll question is required')
    .trim(),

  body('options')
    .isArray({ min: 2 })
    .withMessage('A poll must contain at least 2 options'),

  body('options.*')
    .notEmpty()
    .withMessage('Option text cannot be empty')
    .trim(),

  body('pollType')
    .optional()
    .isIn(['Single', 'Multiple'])
    .withMessage('Poll type must be Single or Multiple'),

  body('isAnonymous')
    .optional()
    .isBoolean()
    .withMessage('isAnonymous must be a boolean value'),

  body('expiresAt')
    .notEmpty()
    .withMessage('Expiration date is required')
    .isISO8601()
    .withMessage('Expiration must be a valid date format'),

  validateRequest,
];

export const votePollValidator = [
  body('optionIds')
    .isArray({ min: 1 })
    .withMessage('You must select at least one option to vote'),

  body('optionIds.*')
    .isMongoId()
    .withMessage('Invalid option ID format'),

  validateRequest,
];
