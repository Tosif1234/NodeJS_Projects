import { noticeService } from '../services/noticeService.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createNotice = asyncHandler(async (req, res) => {
  const noticeData = { ...req.body };

  if (typeof noticeData.targetRoles === 'string') {
    try {
      noticeData.targetRoles = JSON.parse(noticeData.targetRoles);
    } catch (e) {
      noticeData.targetRoles = noticeData.targetRoles.split(',').map((r) => r.trim());
    }
  }

  if (req.file) {
    noticeData.attachmentUrl = req.file.path.replace(/\\/g, '/');
  }

  const notice = await noticeService.createNotice(noticeData, req.user.id);

  const io = req.app.get('io');
  if (io) io.emit('notice_updated');

  return ApiResponse.success(res, 'Notice created successfully', notice, 201);
});

export const updateNotice = asyncHandler(async (req, res) => {
  const updateData = { ...req.body };

  if (typeof updateData.targetRoles === 'string') {
    try {
      updateData.targetRoles = JSON.parse(updateData.targetRoles);
    } catch (e) {
      updateData.targetRoles = updateData.targetRoles.split(',').map((r) => r.trim());
    }
  }

  if (req.file) {
    updateData.attachmentUrl = req.file.path.replace(/\\/g, '/');
  }

  const notice = await noticeService.updateNotice(req.params.id, updateData, req.user.id);

  const io = req.app.get('io');
  if (io) io.emit('notice_updated');

  return ApiResponse.success(res, 'Notice updated successfully', notice);
});

export const publishNotice = asyncHandler(async (req, res) => {
  const notice = await noticeService.publishNotice(req.params.id, req.user.id);

  const io = req.app.get('io');
  if (io) io.emit('notice_updated');

  return ApiResponse.success(res, 'Notice published successfully', notice);
});

export const deleteNotice = asyncHandler(async (req, res) => {
  await noticeService.deleteNotice(req.params.id, req.user.id);

  const io = req.app.get('io');
  if (io) io.emit('notice_updated');

  return ApiResponse.success(res, 'Notice deleted successfully');
});

export const markRead = asyncHandler(async (req, res) => {
  const notice = await noticeService.markNoticeAsRead(req.params.id, req.user.id);

  return ApiResponse.success(res, 'Notice marked as read', notice);
});

export const getResidentFeed = asyncHandler(async (req, res) => {
  const { page, limit, ...filters } = req.query;
  const paginationOptions = { page, limit };

  const result = await noticeService.listNoticesForUser(req.user.id, req.user.role, filters, paginationOptions);

  return ApiResponse.success(res, 'Notice feed retrieved successfully', result.notices, 200, result.meta);
});

export const getAdminList = asyncHandler(async (req, res) => {
  const { page, limit, ...filters } = req.query;
  const paginationOptions = { page, limit };

  const result = await noticeService.listNoticesForAdmin(filters, paginationOptions);

  return ApiResponse.success(res, 'Notices list retrieved successfully', result.notices, 200, result.meta);
});
