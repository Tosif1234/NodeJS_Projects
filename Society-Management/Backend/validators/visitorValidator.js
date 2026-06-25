import { body, param } from 'express-validator';
import validateRequest from '../middleware/validateMiddleware.js';

export const createVisitorValidator = [
  body('name')
    .notEmpty()
    .withMessage('Visitor name is required')
    .trim(),

  body('phone')
    .notEmpty()
    .withMessage('Visitor phone number is required')
    .trim()
    .matches(/^\+?[1-9]\d{9,14}$/)
    .withMessage('Please enter a valid phone number (minimum 10 digits)'),

  body('visitorType')
    .isIn(['Guest', 'Delivery', 'Maid', 'Driver', 'Vendor', 'Other'])
    .withMessage('Visitor type must be: Guest, Delivery, Maid, Driver, Vendor, or Other'),

  body('purpose')
    .notEmpty()
    .withMessage('Purpose of visit is required')
    .trim(),

  body('hostResident')
    .notEmpty()
    .withMessage('Host resident ID is required')
    .isMongoId()
    .withMessage('Invalid resident ID format'),

  body('expectedDuration')
    .optional()
    .trim(),

  body('vehicleNumber')
    .optional()
    .trim()
    .toUpperCase(),

  validateRequest,
];

export const updateStatusValidator = [
  body('status')
    .isIn(['Approved', 'Rejected'])
    .withMessage('Status must be either Approved or Rejected'),

  validateRequest,
];
