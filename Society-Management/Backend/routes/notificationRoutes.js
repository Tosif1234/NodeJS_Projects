import express from 'express';
import {
  getFeed,
  getUnreadCount,
  markRead,
  markAllRead,
  updatePreferences,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { updatePreferencesValidator } from '../validators/notificationValidator.js';

const router = express.Router();

router.use(protect);

router.get('/', getFeed);
router.get('/unread-count', getUnreadCount);
router.put('/read-all', markAllRead);
router.put('/:id/read', markRead);
router.put('/preferences', updatePreferencesValidator, updatePreferences);

export default router;
