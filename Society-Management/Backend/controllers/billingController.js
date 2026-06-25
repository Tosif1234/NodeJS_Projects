import { billingService } from '../services/billingService.js';
import ResidentProfile from '../models/ResidentProfile.js';
import { createInvoicePDF } from '../utils/pdfGenerator.js';
import ApiResponse from '../utils/apiResponse.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ROLES } from '../constants/roles.js';

export const createBill = asyncHandler(async (req, res) => {
  const bill = await billingService.generateBill(req.body, req.user.id);

  const io = req.app.get('io');
  if (io) io.emit('bill_updated');

  return ApiResponse.success(res, 'Maintenance bill generated successfully', bill, 201);
});

export const createBillsBulk = asyncHandler(async (req, res) => {
  const result = await billingService.generateBillsBulk(req.body, req.user.id);

  const io = req.app.get('io');
  if (io) io.emit('bill_updated');

  return ApiResponse.success(
    res,
    `Bulk bills generation completed. Created: ${result.createdCount}, Skipped: ${result.skippedCount}`,
    result
  );
});

export const recordPayment = asyncHandler(async (req, res) => {
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  const bill = await billingService.getBillById(req.params.id);

  const isAdmin = req.user.role === ROLES.ADMIN;
  const isMaintenance = req.user.role === ROLES.MAINTENANCE_STAFF;
  const isResidentOwner = bill.resident._id.toString() === req.user.id;

  if (!isAdmin && !isMaintenance && !isResidentOwner) {
    throw new AppError('You are not authorized to record payment for this maintenance bill', 403);
  }

  const updatedBill = await billingService.recordBillPayment(
    req.params.id,
    req.body,
    req.user.id,
    auditMeta
  );

  const io = req.app.get('io');
  if (io) io.emit('bill_updated');

  return ApiResponse.success(res, 'Payment recorded successfully', updatedBill);
});

export const runLateFeeCheck = asyncHandler(async (req, res) => {
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  const result = await billingService.runLateFeeCheck(req.body, req.user.id, auditMeta);

  return ApiResponse.success(
    res,
    `Late fee check completed. Applied penalties to ${result.updatedCount} overdue bills.`,
    result
  );
});

export const getResidentBills = asyncHandler(async (req, res) => {
  const data = await billingService.getResidentBills(req.user.id);

  return ApiResponse.success(res, 'Resident bills list retrieved successfully', data.bills, 200, null, {
    totalPendingAmount: data.totalPendingAmount,
  });
});

export const getAdminBillingDashboard = asyncHandler(async (req, res) => {
  const data = await billingService.getAdminBillingDashboard(req.query);

  return ApiResponse.success(res, 'Admin billing list retrieved successfully', {
    bills: data.bills,
    totalRevenue: data.statistics.totalRevenue,
    pendingAmount: data.statistics.pendingAmount,
    collectionRate: data.statistics.collectionRatePercent,
    overdueCount: data.statistics.overdueCount,
    revenueTrends: [],
  });
});

export const downloadInvoicePDF = asyncHandler(async (req, res) => {
  const bill = await billingService.getBillById(req.params.id);

  const isAdmin = req.user.role === ROLES.ADMIN;
  const isResidentOwner = bill.resident._id.toString() === req.user.id;

  if (!isAdmin && !isResidentOwner) {
    throw new AppError('You are not authorized to download this invoice PDF', 403);
  }

  const residentDetails = await ResidentProfile.findOne({ user: bill.resident._id }).populate('user', 'name phone');
  if (!residentDetails) {
    throw new AppError('Associated resident profile details not found', 404);
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${bill.invoiceNumber}.pdf`);

  const doc = createInvoicePDF(bill, residentDetails);
  doc.pipe(res);
});

export const updateBill = asyncHandler(async (req, res) => {
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  const updatedBill = await billingService.updateBill(
    req.params.id,
    req.body,
    req.user.id,
    auditMeta
  );

  const io = req.app.get('io');
  if (io) io.emit('bill_updated');

  return ApiResponse.success(res, 'Maintenance bill updated successfully', updatedBill);
});

export const deleteBill = asyncHandler(async (req, res) => {
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  await billingService.deleteBill(req.params.id, req.user.id, auditMeta);

  const io = req.app.get('io');
  if (io) io.emit('bill_updated');

  return ApiResponse.success(res, 'Maintenance bill deleted successfully', null);
});
