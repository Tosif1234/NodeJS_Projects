import express from 'express';
import {
  createNotice,
  updateNotice,
  publishNotice,
  deleteNotice,
  markRead,
  getResidentFeed,
  getAdminList,
} from '../controllers/noticeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { uploadNoticeAttachment } from '../middleware/uploadMiddleware.js';
import {
  createNoticeValidator,
  updateNoticeValidator,
} from '../validators/noticeValidator.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(protect);

router.get('/feed', getResidentFeed); 
router.get('/admin', requireRole(ROLES.ADMIN), getAdminList);

router.post('/', requireRole(ROLES.ADMIN), uploadNoticeAttachment.single('attachment'), createNoticeValidator, createNotice);
router.put('/:id', requireRole(ROLES.ADMIN), uploadNoticeAttachment.single('attachment'), updateNoticeValidator, updateNotice);
router.put('/:id/publish', requireRole(ROLES.ADMIN), publishNotice);
router.delete('/:id', requireRole(ROLES.ADMIN), deleteNotice);
router.put('/:id/read', markRead);

export default router;
