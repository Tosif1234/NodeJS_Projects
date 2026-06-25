import { complaintService } from '../services/complaintService.js';
import ApiResponse from '../utils/apiResponse.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ROLES } from '../constants/roles.js';
import User from '../models/User.js';

export const createComplaint = asyncHandler(async (req, res) => {
  const complaintData = { ...req.body };

  if (req.files && req.files.length > 0) {
    complaintData.images = req.files.map((file) => file.path.replace(/\\/g, '/'));
  }

  const complaint = await complaintService.createComplaint(complaintData, req.user.id);

  return ApiResponse.success(res, 'Complaint registered successfully', complaint, 201);
});

export const assignComplaint = asyncHandler(async (req, res) => {
  const { assignedTo } = req.body;
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  const complaint = await complaintService.assignComplaint(
    req.params.id,
    assignedTo,
    req.user.id,
    auditMeta
  );

  const io = req.app.get('io');
  if (io) io.emit('complaint_updated', { complaintId: complaint._id });

  return ApiResponse.success(res, 'Complaint assigned to staff successfully', complaint);
});

export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status, notes, completionNotes } = req.body;
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  const queryResult = await complaintService.getAdminComplaints({ _id: req.params.id }, { page: 1, limit: 1 });
  const complaint = queryResult.complaints[0];

    if (!complaint) {
    throw new AppError('Complaint not found', 404);
  }

  const isAdmin = req.user.role === ROLES.ADMIN;
  const isAssignedStaff = complaint.assignedTo && complaint.assignedTo._id.toString() === req.user.id;
  const isRaiser = complaint.raisedBy._id.toString() === req.user.id;

  if (!isAdmin && !isAssignedStaff && !isRaiser) {
    throw new AppError('You are not authorized to update this complaint', 403);
  }

  if (req.user.role === ROLES.RESIDENT && status !== 'Closed') {
    throw new AppError('Residents are only allowed to close resolved complaints', 403);
  }

  const updatedComplaint = await complaintService.updateComplaintStatus(
    req.params.id,
    status,
    notes,
    req.user.id,
    completionNotes,
    auditMeta
  );

  const io = req.app.get('io');
  if (io) io.emit('complaint_updated', { complaintId: updatedComplaint._id });

  return ApiResponse.success(res, `Complaint status updated to ${status} successfully`, updatedComplaint);
});

export const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;

  const queryResult = await complaintService.getAdminComplaints({ _id: req.params.id }, { page: 1, limit: 1 });
  const complaint = queryResult.complaints[0];

  if (!complaint) {
    throw new AppError('Complaint not found', 404);
  }

  const isAdmin = req.user.role === ROLES.ADMIN;
  const isAssignedStaff = complaint.assignedTo && complaint.assignedTo._id.toString() === req.user.id;
  const isRaiser = complaint.raisedBy._id.toString() === req.user.id;

  if (!isAdmin && !isAssignedStaff && !isRaiser) {
    throw new AppError('You are not authorized to post comments on this complaint', 403);
  }

  const comments = await complaintService.addComment(req.params.id, req.user.id, text);

  const io = req.app.get('io');
  if (io) io.emit('complaint_updated', { complaintId: req.params.id });

  return ApiResponse.success(res, 'Comment posted successfully', comments, 201);
});

export const getResidentComplaints = asyncHandler(async (req, res) => {
  const { page, limit, ...filters } = req.query;
  const paginationOptions = { page, limit };

  const result = await complaintService.getResidentComplaints(req.user.id, filters, paginationOptions);

  return ApiResponse.success(res, 'Complaints list retrieved successfully', result.complaints, 200, result.meta);
});

export const getMaintenanceDashboard = asyncHandler(async (req, res) => {
  const worklist = await complaintService.getMaintenanceWorklist(req.user.id);

  return ApiResponse.success(res, 'Maintenance worklist retrieved successfully', worklist);
});

export const getAdminComplaints = asyncHandler(async (req, res) => {
  const { page, limit, ...filters } = req.query;
  const paginationOptions = { page, limit };

  const result = await complaintService.getAdminComplaints(filters, paginationOptions);

  return ApiResponse.success(res, 'Admin complaints list retrieved successfully', result.complaints, 200, result.meta);
});

export const getAdminAnalytics = asyncHandler(async (req, res) => {
  const analytics = await complaintService.getAdminAnalytics();

  return ApiResponse.success(res, 'Complaint reports and analytics retrieved successfully', analytics);
});

export const updateComplaint = asyncHandler(async (req, res) => {
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  const updatedComplaint = await complaintService.updateComplaint(
    req.params.id,
    req.body,
    req.user.id,
    auditMeta
  );

  const io = req.app.get('io');
  if (io) io.emit('complaint_updated');

  return ApiResponse.success(res, 'Complaint updated successfully', updatedComplaint);
});

export const deleteComplaint = asyncHandler(async (req, res) => {
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  await complaintService.deleteComplaint(req.params.id, req.user.id, auditMeta);

  const io = req.app.get('io');
  if (io) io.emit('complaint_updated');

  return ApiResponse.success(res, 'Complaint deleted successfully', null);
});

export const getMaintenanceStaffList = asyncHandler(async (req, res) => {
  const staff = await User.find({ role: ROLES.MAINTENANCE_STAFF, status: 'Approved' }).select('name _id role');
  return ApiResponse.success(res, 'Maintenance staff list retrieved successfully', staff);
});
