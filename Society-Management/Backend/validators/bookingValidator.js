import { body } from 'express-validator';
import validateRequest from '../middleware/validateMiddleware.js';

export const createBookingValidator = [
  body('facilityName')
    .isIn(['Club House', 'Gym', 'Community Hall', 'Swimming Pool', 'Sports Court', 'Garden Area'])
    .withMessage('Facility name must be: Club House, Gym, Community Hall, Swimming Pool, Sports Court, or Garden Area'),

  body('bookingDate')
    .notEmpty()
    .withMessage('Booking date is required')
    .isISO8601()
    .withMessage('Booking date must be a valid date format (YYYY-MM-DD)'),

  body('startTime')
    .matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in 24-hour HH:MM format'),

  body('endTime')
    .matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in 24-hour HH:MM format'),

  validateRequest,
];

export const approveOrRejectBookingValidator = [
  body('status')
    .isIn(['Approved', 'Rejected'])
    .withMessage('Status must be either Approved or Rejected'),

  validateRequest,
];
