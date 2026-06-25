import express from 'express';
import {
  createPoll,
  votePoll,
  getDetails,
  listPolls,
  deletePoll,
  getAnalytics,
} from '../controllers/pollController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
  createPollValidator,
  votePollValidator,
} from '../validators/pollValidator.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(protect);

router.get('/', listPolls);
router.post('/', requireRole(ROLES.ADMIN), createPollValidator, createPoll);
router.get('/:id', getDetails);
router.post('/:id/vote', requireRole(ROLES.RESIDENT), votePollValidator, votePoll);
router.delete('/:id', requireRole(ROLES.ADMIN), deletePoll);
router.get('/:id/analytics', requireRole(ROLES.ADMIN), getAnalytics);

export default router;
