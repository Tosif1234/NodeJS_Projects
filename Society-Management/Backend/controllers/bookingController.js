import { bookingService } from '../services/bookingService.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBooking(req.body, req.user.id);

  return ApiResponse.success(res, 'Facility booking request created successfully', booking, 201);
});

export const checkAvailability = asyncHandler(async (req, res) => {
  const { facilityName, bookingDate, startTime, endTime } = req.query;

  const isAvailable = await bookingService.checkAvailability(
    facilityName,
    bookingDate,
    startTime,
    endTime
  );

  return ApiResponse.success(res, 'Availability status fetched successfully', { isAvailable });
});

export const approveOrRejectBooking = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  const booking = await bookingService.approveOrRejectBooking(
    req.params.id,
    status,
    req.user.id,
    auditMeta
  );

  return ApiResponse.success(res, `Booking request status updated to ${status} successfully`, booking);
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  const booking = await bookingService.cancelBooking(req.params.id, req.user.id, auditMeta);

  return ApiResponse.success(res, 'Booking request cancelled successfully', booking);
});

export const getResidentBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getResidentBookings(req.user.id);

  return ApiResponse.success(res, 'Resident facility bookings list retrieved successfully', bookings);
});

export const getAdminBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getAdminBookings(req.query);

  return ApiResponse.success(res, 'Admin facility bookings list retrieved successfully', bookings);
});

export const getFacilityUsageAnalytics = asyncHandler(async (req, res) => {
  const analytics = await bookingService.getFacilityUsageAnalytics();

  return ApiResponse.success(res, 'Facility usage reports retrieved successfully', analytics);
});

export const updateBooking = asyncHandler(async (req, res) => {
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  const updatedBooking = await bookingService.updateBooking(
    req.params.id,
    req.body,
    req.user.id,
    auditMeta
  );

  const io = req.app.get('io');
  if (io) io.emit('booking_updated');

  return ApiResponse.success(res, 'Booking updated successfully', updatedBooking);
});

export const deleteBooking = asyncHandler(async (req, res) => {
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  await bookingService.deleteBooking(req.params.id, req.user.id, auditMeta);

  const io = req.app.get('io');
  if (io) io.emit('booking_updated');

  return ApiResponse.success(res, 'Booking deleted successfully', null);
});
