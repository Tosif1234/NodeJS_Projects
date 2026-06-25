import { body } from 'express-validator';
import validateRequest from '../middleware/validateMiddleware.js';

export const createComplaintValidator = [
  body('title')
    .notEmpty()
    .withMessage('Complaint title is required')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  body('description')
    .notEmpty()
    .withMessage('Description of the issue is required')
    .trim(),

  body('category')
    .isIn(['Electrical', 'Plumbing', 'Water Supply', 'Cleaning', 'Security', 'Parking', 'Lift Maintenance', 'Other'])
    .withMessage('Category must be Electrical, Plumbing, Water Supply, Cleaning, Security, Parking, Lift Maintenance, or Other'),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Priority must be Low, Medium, High, or Critical'),

  validateRequest,
];

export const assignComplaintValidator = [
  body('assignedTo')
    .notEmpty()
    .withMessage('Assigned staff user ID is required')
    .isMongoId()
    .withMessage('Invalid staff user ID format'),

  validateRequest,
];

export const updateStatusValidator = [
  body('status')
    .isIn(['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'])
    .withMessage('Invalid status. Status must be: Open, Assigned, In Progress, Resolved, or Closed'),

  body('notes')
    .optional()
    .trim(),

  body('completionNotes')
    .optional()
    .trim(),

  validateRequest,
];

export const commentValidator = [
  body('text')
    .notEmpty()
    .withMessage('Comment text is required')
    .trim(),

  validateRequest,
];
