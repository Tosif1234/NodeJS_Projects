import { body } from 'express-validator';
import validateRequest from '../middleware/validateMiddleware.js';

export const createNoticeValidator = [
  body('title')
    .notEmpty()
    .withMessage('Notice title is required')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  body('content')
    .notEmpty()
    .withMessage('Notice content is required')
    .trim(),

  body('category')
    .isIn(['General', 'Maintenance', 'Event', 'Meeting', 'Emergency'])
    .withMessage('Category must be General, Maintenance, Event, Meeting, or Emergency'),

  body('status')
    .optional()
    .isIn(['Draft', 'Published', 'Scheduled'])
    .withMessage('Status must be Draft, Published, or Scheduled'),

  body('publishAt')
    .optional()
    .isISO8601()
    .withMessage('Publish date must be a valid date format'),

  body('expiresAt')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Expiry date must be a valid date format'),

  validateRequest,
];

export const updateNoticeValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  body('content')
    .optional()
    .trim(),

  body('category')
    .optional()
    .isIn(['General', 'Maintenance', 'Event', 'Meeting', 'Emergency'])
    .withMessage('Category must be General, Maintenance, Event, Meeting, or Emergency'),

  body('status')
    .optional()
    .isIn(['Draft', 'Published', 'Scheduled', 'Expired'])
    .withMessage('Status must be Draft, Published, Scheduled, or Expired'),

  body('publishAt')
    .optional()
    .isISO8601()
    .withMessage('Publish date must be a valid date format'),

  body('expiresAt')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Expiry date must be a valid date format'),

  validateRequest,
];
