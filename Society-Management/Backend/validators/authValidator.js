import { body, query } from 'express-validator';
import validateRequest from '../middleware/validateMiddleware.js';
import { ROLES } from '../constants/roles.js';

export const registerValidator = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim()
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),

  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .trim(),

  body('password')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),

  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .trim()
    .matches(/^\+?[1-9]\d{9,14}$/)
    .withMessage('Please enter a valid phone number (minimum 10 digits)'),

  body('role')
    .isIn(Object.values(ROLES))
    .withMessage(`Role must be one of: ${Object.values(ROLES).join(', ')}`),

  validateRequest,
];

export const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .trim(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  validateRequest,
];

export const verifyEmailValidator = [
  query('email')
    .isEmail()
    .withMessage('Please provide a valid email to verify')
    .normalizeEmail()
    .trim(),

  query('token')
    .notEmpty()
    .withMessage('Verification token is required')
    .trim(),

  validateRequest,
];

export const forgotPasswordValidator = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .trim(),

  validateRequest,
];

export const verifyOtpValidator = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail()
    .trim(),

  body('otp')
    .notEmpty()
    .withMessage('OTP is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers'),

  validateRequest,
];

export const resetPasswordValidator = [
  body('verifiedToken')
    .notEmpty()
    .withMessage('Verified token is required')
    .trim(),

  body('password')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),

  validateRequest,
];
