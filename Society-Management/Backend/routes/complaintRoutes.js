import express from 'express';
import {
  createComplaint,
  assignComplaint,
  updateComplaintStatus,
  addComment,
  getResidentComplaints,
  getMaintenanceDashboard,
  getAdminComplaints,
  getAdminAnalytics,
  getMaintenanceStaffList,
  updateComplaint,
  deleteComplaint,
} from '../controllers/complaintController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { uploadComplaintImages } from '../middleware/uploadMiddleware.js';
import {
  createComplaintValidator,
  assignComplaintValidator,
  updateStatusValidator,
  commentValidator,
} from '../validators/complaintValidator.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(protect);

router.get('/resident', requireRole(ROLES.RESIDENT), getResidentComplaints);
router.get('/maintenance', requireRole(ROLES.MAINTENANCE_STAFF), getMaintenanceDashboard);
router.get('/admin', requireRole(ROLES.ADMIN), getAdminComplaints);
router.get('/admin/analytics', requireRole(ROLES.ADMIN), getAdminAnalytics);
router.put('/:id', requireRole(ROLES.ADMIN), updateComplaint);
router.delete('/:id', requireRole(ROLES.ADMIN), deleteComplaint);
router.get('/staff', requireRole(ROLES.ADMIN), getMaintenanceStaffList);

router.post('/', requireRole(ROLES.RESIDENT), uploadComplaintImages.array('images', 5), createComplaintValidator, createComplaint);
router.put('/:id/assign', requireRole(ROLES.ADMIN), assignComplaintValidator, assignComplaint);
router.put('/:id/status', updateStatusValidator, updateComplaintStatus);
router.post('/:id/comments', commentValidator, addComment);

export default router;
