import express from 'express';
import {
  createBill,
  createBillsBulk,
  recordPayment,
  runLateFeeCheck,
  getResidentBills,
  getAdminBillingDashboard,
  downloadInvoicePDF,
  updateBill,
  deleteBill,
} from '../controllers/billingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
  createBillValidator,
  createBillsBulkValidator,
  recordPaymentValidator,
  updateBillValidator,
} from '../validators/billingValidator.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(protect);

router.get('/resident', requireRole(ROLES.RESIDENT), getResidentBills);
router.get('/admin', requireRole(ROLES.ADMIN), getAdminBillingDashboard);
router.get('/:id/invoice-pdf', downloadInvoicePDF);

router.post('/', requireRole(ROLES.ADMIN), createBillValidator, createBill);
router.post('/bulk', requireRole(ROLES.ADMIN), createBillsBulkValidator, createBillsBulk);
router.put('/:id', requireRole(ROLES.ADMIN), updateBillValidator, updateBill);
router.delete('/:id', requireRole(ROLES.ADMIN), deleteBill);
router.put('/:id/pay', requireRole(ROLES.ADMIN, ROLES.MAINTENANCE_STAFF, ROLES.RESIDENT), recordPaymentValidator, recordPayment);
router.post('/late-fee-check', requireRole(ROLES.ADMIN), runLateFeeCheck);

export default router;
