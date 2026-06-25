import express from 'express';
import {
  createVisitor,
  updateStatus,
  checkIn,
  checkOut,
  getSecurityDashboard,
  getResidentVisitors,
  getAdminVisitorLogs,
  updateVisitor,
  deleteVisitor,
} from '../controllers/visitorController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { uploadVisitorPhoto } from '../middleware/uploadMiddleware.js';
import {
  createVisitorValidator,
  updateStatusValidator,
} from '../validators/visitorValidator.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(protect);

router.get('/security-dashboard', requireRole(ROLES.SECURITY_STAFF, ROLES.ADMIN), getSecurityDashboard);
router.get('/resident-log', requireRole(ROLES.RESIDENT), getResidentVisitors);
router.get('/admin-log', requireRole(ROLES.ADMIN), getAdminVisitorLogs);
router.put('/:id', requireRole(ROLES.ADMIN), updateVisitor);
router.delete('/:id', requireRole(ROLES.ADMIN), deleteVisitor);

router.post('/', requireRole(ROLES.SECURITY_STAFF, ROLES.ADMIN, ROLES.RESIDENT), uploadVisitorPhoto.single('photo'), createVisitorValidator, createVisitor);
router.put('/:id/status', requireRole(ROLES.RESIDENT), updateStatusValidator, updateStatus);
router.put('/:id/check-in', requireRole(ROLES.SECURITY_STAFF, ROLES.ADMIN), checkIn);
router.put('/:id/check-out', requireRole(ROLES.SECURITY_STAFF, ROLES.ADMIN), checkOut);

export default router;
