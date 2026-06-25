import { visitorService } from '../services/visitorService.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createVisitor = asyncHandler(async (req, res) => {
  const visitorData = { ...req.body };

  if (req.file) {
    visitorData.photoUrl = req.file.path.replace(/\\/g, '/');
  }

  const visitor = await visitorService.createVisitorRequest(visitorData, req.user.id);

  return ApiResponse.success(res, 'Visitor entry request registered successfully', visitor, 201);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  const visitor = await visitorService.updateVisitorStatus(
    req.params.id,
    status,
    req.user.id,
    auditMeta
  );

  return ApiResponse.success(res, `Visitor entry request has been ${status.toLowerCase()}`, visitor);
});

export const checkIn = asyncHandler(async (req, res) => {
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  const visitor = await visitorService.recordCheckIn(req.params.id, req.user.id, auditMeta);

  return ApiResponse.success(res, 'Visitor check-in logged successfully', visitor);
});

export const checkOut = asyncHandler(async (req, res) => {
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  const visitor = await visitorService.recordCheckOut(req.params.id, req.user.id, auditMeta);

  return ApiResponse.success(res, 'Visitor check-out logged successfully', visitor);
});

export const getSecurityDashboard = asyncHandler(async (req, res) => {
  const dashboardData = await visitorService.getSecurityDashboard(req.user.id);

  return ApiResponse.success(res, 'Security visitor stats retrieved successfully', dashboardData);
});

export const getResidentVisitors = asyncHandler(async (req, res) => {
  const data = await visitorService.getResidentVisitors(req.user.id);

  return ApiResponse.success(res, 'Resident visitor logs retrieved successfully', data);
});

export const getAdminVisitorLogs = asyncHandler(async (req, res) => {
  const { page, limit, ...filters } = req.query;
  const paginationOptions = { page, limit };

  const result = await visitorService.getAdminVisitorLogs(filters, paginationOptions);

  return ApiResponse.success(
    res,
    'Admin visitor logs retrieved successfully',
    result.logs,
    200,
    result.meta,
    { analytics: result.analytics }
  );
});

export const updateVisitor = asyncHandler(async (req, res) => {
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  const updatedVisitor = await visitorService.updateVisitor(
    req.params.id,
    req.body,
    req.user.id,
    auditMeta
  );

  const io = req.app.get('io');
  if (io) io.emit('visitor_updated');

  return ApiResponse.success(res, 'Visitor updated successfully', updatedVisitor);
});

export const deleteVisitor = asyncHandler(async (req, res) => {
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  await visitorService.deleteVisitor(req.params.id, req.user.id, auditMeta);

  const io = req.app.get('io');
  if (io) io.emit('visitor_updated');

  return ApiResponse.success(res, 'Visitor deleted successfully', null);
});
