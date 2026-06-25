import express from 'express';
import {
  createBooking,
  checkAvailability,
  approveOrRejectBooking,
  cancelBooking,
  getResidentBookings,
  getAdminBookings,
  getFacilityUsageAnalytics,
  updateBooking,
  deleteBooking,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
  createBookingValidator,
  approveOrRejectBookingValidator,
} from '../validators/bookingValidator.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(protect);

router.get('/resident', requireRole(ROLES.RESIDENT), getResidentBookings);
router.get('/admin', requireRole(ROLES.ADMIN), getAdminBookings);
router.get('/admin/analytics', requireRole(ROLES.ADMIN), getFacilityUsageAnalytics);
router.put('/:id', requireRole(ROLES.ADMIN), updateBooking);
router.delete('/:id', requireRole(ROLES.ADMIN), deleteBooking);

router.get('/check-availability', checkAvailability);

router.post('/', requireRole(ROLES.RESIDENT, ROLES.ADMIN), createBookingValidator, createBooking);
router.put('/:id/status', requireRole(ROLES.ADMIN), approveOrRejectBookingValidator, approveOrRejectBooking);
router.put('/:id/cancel', cancelBooking);

export default router;
