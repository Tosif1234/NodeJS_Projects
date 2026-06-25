import { notificationService } from '../services/notificationService.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getFeed = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const paginationOptions = { page, limit };

  const result = await notificationService.getUserNotifications(req.user.id, paginationOptions);

  return ApiResponse.success(
    res,
    'Notifications feed retrieved successfully',
    result.notifications,
    200,
    result.meta
  );
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const result = await notificationService.getUnreadCount(req.user.id);

  return ApiResponse.success(res, 'Unread notification count retrieved', result);
});

export const markRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.id, req.user.id);

  return ApiResponse.success(res, 'Notification marked as read', notification);
});

export const markAllRead = asyncHandler(async (req, res) => {
  await notificationService.markAllAsRead(req.user.id);

  return ApiResponse.success(res, 'All notifications marked as read');
});

export const updatePreferences = asyncHandler(async (req, res) => {
  const preferences = await notificationService.updatePreferences(req.user.id, req.body);

  return ApiResponse.success(res, 'Notification preferences updated successfully', preferences);
});
