import { body } from 'express-validator';
import validateRequest from '../middleware/validateMiddleware.js';

export const createProfileValidator = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid User ID format'),

  body('flatNumber')
    .notEmpty()
    .withMessage('Flat/House number is required')
    .trim(),

  body('block')
    .notEmpty()
    .withMessage('Block/Tower name is required')
    .trim(),

  body('floor')
    .optional()
    .trim(),

  body('streetAddress')
    .optional()
    .trim(),

  body('occupancyType')
    .isIn(['Owner', 'Tenant'])
    .withMessage('Occupancy type must be either Owner or Tenant'),

  validateRequest,
];

export const updateProfileValidator = [
  body('flatNumber')
    .optional()
    .trim(),

  body('block')
    .optional()
    .trim(),

  body('floor')
    .optional()
    .trim(),

  body('streetAddress')
    .optional()
    .trim(),

  body('occupancyType')
    .optional()
    .isIn(['Owner', 'Tenant'])
    .withMessage('Occupancy type must be either Owner or Tenant'),

  validateRequest,
];

export const familyMemberValidator = [
  body('name')
    .notEmpty()
    .withMessage('Family member name is required')
    .trim(),

  body('relation')
    .notEmpty()
    .withMessage('Relation is required')
    .trim(),

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^\+?[1-9]\d{9,14}$/)
    .withMessage('Please enter a valid phone number (minimum 10 digits)'),

  body('isEmergencyContact')
    .optional()
    .isBoolean()
    .withMessage('isEmergencyContact must be a boolean'),

  body('age')
    .optional()
    .isInt({ min: 0, max: 120 })
    .withMessage('Age must be a valid number between 0 and 120'),

  validateRequest,
];

export const vehicleValidator = [
  body('vehicleType')
    .isIn(['Car', 'Bike', 'EV', 'Other'])
    .withMessage('Vehicle type must be Car, Bike, EV, or Other'),

  body('vehicleName')
    .notEmpty()
    .withMessage('Vehicle name/model is required')
    .trim(),

  body('licensePlate')
    .notEmpty()
    .withMessage('License plate number is required')
    .trim()
    .toUpperCase()
    .matches(/^[A-Z0-9\s\-]{4,15}$/)
    .withMessage('Please enter a valid license plate number (alphanumeric, 4 to 15 characters)'),

  validateRequest,
];
