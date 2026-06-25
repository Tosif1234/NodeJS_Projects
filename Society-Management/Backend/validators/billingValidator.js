import { body } from 'express-validator';
import validateRequest from '../middleware/validateMiddleware.js';

export const createBillValidator = [
  body('resident')
    .notEmpty()
    .withMessage('Resident ID is required')
    .isMongoId()
    .withMessage('Invalid resident user ID format'),

  body('month')
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be an integer between 1 and 12'),

  body('year')
    .isInt({ min: 2020 })
    .withMessage('Year must be a valid integer greater than or equal to 2020'),

  body('maintenanceCharges')
    .isFloat({ min: 0 })
    .withMessage('Maintenance charges must be a number greater than or equal to 0'),

  body('waterCharges')
    .isFloat({ min: 0 })
    .withMessage('Water charges must be a number greater than or equal to 0'),

  body('parkingCharges')
    .isFloat({ min: 0 })
    .withMessage('Parking charges must be a number greater than or equal to 0'),

  body('electricityCommonCharges')
    .isFloat({ min: 0 })
    .withMessage('Electricity common charges must be a number greater than or equal to 0'),

  body('penalties')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Penalties must be a number greater than or equal to 0'),

  body('otherCharges')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Other charges must be a number greater than or equal to 0'),

  body('dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Due date must be a valid ISO8601 date format'),

  validateRequest,
];

export const createBillsBulkValidator = [
  body('month')
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be an integer between 1 and 12'),

  body('year')
    .isInt({ min: 2020 })
    .withMessage('Year must be a valid integer greater than or equal to 2020'),

  body('maintenanceCharges')
    .isFloat({ min: 0 })
    .withMessage('Maintenance charges must be a number greater than or equal to 0'),

  body('waterCharges')
    .isFloat({ min: 0 })
    .withMessage('Water charges must be a number greater than or equal to 0'),

  body('parkingCharges')
    .isFloat({ min: 0 })
    .withMessage('Parking charges must be a number greater than or equal to 0'),

  body('electricityCommonCharges')
    .isFloat({ min: 0 })
    .withMessage('Electricity common charges must be a number greater than or equal to 0'),

  body('otherCharges')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Other charges must be a number greater than or equal to 0'),

  body('dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Due date must be a valid ISO8601 date format'),

  validateRequest,
];

export const recordPaymentValidator = [
  body('paidAmount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Paid amount must be greater than 0'),

  body('amountPaid')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount paid must be greater than 0'),

  body().custom((value) => {
    if (value.paidAmount === undefined && value.amountPaid === undefined) {
      throw new Error('Either paidAmount or amountPaid is required');
    }
    return true;
  }),

  body().custom((value) => {
    const method = value.paymentDetails?.paymentMethod || value.paymentMethod;
    const allowed = ['Card', 'UPI', 'Net Banking', 'Cash'];
    if (!method || !allowed.includes(method)) {
      throw new Error('Payment method must be Card, UPI, Net Banking, or Cash');
    }
    const txn = value.paymentDetails?.transactionId || value.transactionId;
    if (!txn || txn.trim() === '') {
      throw new Error('Transaction reference ID is required');
    }
    return true;
  }),

  validateRequest,
];

export const updateBillValidator = [
  body('maintenanceCharges')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maintenance charges must be a number greater than or equal to 0'),

  body('waterCharges')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Water charges must be a number greater than or equal to 0'),

  body('parkingCharges')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Parking charges must be a number greater than or equal to 0'),

  body('electricityCommonCharges')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Electricity common charges must be a number greater than or equal to 0'),

  body('penalties')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Penalties must be a number greater than or equal to 0'),

  body('otherCharges')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Other charges must be a number greater than or equal to 0'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO8601 date format'),

  validateRequest,
];
