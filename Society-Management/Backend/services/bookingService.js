import FacilityBooking from '../models/FacilityBooking.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { logEvent } from '../utils/auditLogger.js';

export const bookingService = {
  checkAvailability: async (facilityName, bookingDate, startTime, endTime, excludeBookingId = null) => {
    const collision = await FacilityBooking.findOne({
      facilityName,
      bookingDate: new Date(bookingDate),
      status: { $in: ['Approved', 'Pending'] },
      ...(excludeBookingId && { _id: { $ne: excludeBookingId } }),
      $and: [
        { startTime: { $lt: endTime } },
        { endTime: { $gt: startTime } },
      ],
    });

    return !collision;
  },

  createBooking: async (bookingData, bookedByUserId) => {
    const { facilityName, bookingDate, startTime, endTime, notes } = bookingData;

    const isAvailable = await bookingService.checkAvailability(
      facilityName,
      bookingDate,
      startTime,
      endTime
    );

    if (!isAvailable) {
      throw new AppError('The requested facility is already booked or pending approval for this time slot.', 400);
    }

    const booking = await FacilityBooking.create({
      facilityName,
      bookedBy: bookedByUserId,
      bookingDate: new Date(bookingDate),
      startTime,
      endTime,
      notes: notes || '',
      status: 'Pending',
    });

    const user = await User.findById(bookedByUserId);
    const admins = await User.find({ role: 'Admin' }).select('_id');
    for (const admin of admins) {
      await Notification.create({
        recipient: admin._id,
        title: 'New Facility Booking Request',
        message: `${user.name} has requested to book the ${facilityName} on ${new Date(bookingDate).toLocaleDateString()} from ${startTime} to ${endTime}.`,
        type: 'Booking',
      });
    }

    return booking;
  },

  approveOrRejectBooking: async (bookingId, status, adminUserId, auditMeta = {}) => {
    if (!['Approved', 'Rejected'].includes(status)) {
      throw new AppError('Invalid status. Must be Approved or Rejected', 400);
    }

    const booking = await FacilityBooking.findById(bookingId);
    if (!booking) {
      throw new AppError('Booking record not found', 404);
    }

    if (booking.status !== 'Pending') {
      throw new AppError(`Cannot resolve booking. Current status is already ${booking.status}`, 400);
    }

    if (status === 'Approved') {
      const isAvailable = await bookingService.checkAvailability(
        booking.facilityName,
        booking.bookingDate,
        booking.startTime,
        booking.endTime,
        booking._id
      );
      if (!isAvailable) {
        throw new AppError('Cannot approve. Another booking has already been approved for this slot.', 400);
      }
    }

    booking.status = status;
    booking.updatedBy = adminUserId;
    await booking.save();

    await Notification.create({
      recipient: booking.bookedBy,
      title: `Booking Request ${status}`,
      message: `Your request to book the ${booking.facilityName} on ${booking.bookingDate.toLocaleDateString()} has been ${status.toLowerCase()}.`,
      type: 'Booking',
    });

    await logEvent({
      action: 'User Creation', 
      user: adminUserId,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      status: 'Success',
      details: `Facility booking ID: ${booking._id} status updated to ${status} by admin.`,
    });

    return booking;
  },

  cancelBooking: async (bookingId, userId, auditMeta = {}) => {
    const booking = await FacilityBooking.findById(bookingId);
    if (!booking) {
      throw new AppError('Booking record not found', 404);
    }

    const user = await User.findById(userId);

    if (user.role !== 'Admin' && booking.bookedBy.toString() !== userId.toString()) {
      throw new AppError('You do not have permission to cancel this booking', 403);
    }

    if (['Cancelled', 'Completed', 'Rejected'].includes(booking.status)) {
      throw new AppError(`Cannot cancel. Booking is already ${booking.status}`, 400);
    }

    booking.status = 'Cancelled';
    booking.updatedBy = userId;
    await booking.save();

    if (user.role === 'Resident') {
      const admins = await User.find({ role: 'Admin' }).select('_id');
      for (const admin of admins) {
        await Notification.create({
          recipient: admin._id,
          title: 'Facility Booking Cancelled',
          message: `${user.name} has cancelled their booking for ${booking.facilityName} on ${booking.bookingDate.toLocaleDateString()}.`,
          type: 'Booking',
        });
      }
    }

    await logEvent({
      action: 'Logout', 
      user: userId,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      status: 'Success',
      details: `Facility booking ID: ${booking._id} cancelled by user.`,
    });

    return booking;
  },

  getResidentBookings: async (residentUserId) => {
    const bookings = await FacilityBooking.find({ bookedBy: residentUserId }).sort({ bookingDate: -1 });
    return bookings;
  },

  getAdminBookings: async (query) => {
    const { status, facilityName, date } = query;

    const filter = { isDeleted: { $ne: true } };
    if (status) filter.status = status;
    if (facilityName) filter.facilityName = facilityName;
    if (date) filter.bookingDate = new Date(date);

    const bookings = await FacilityBooking.find(filter)
      .populate('bookedBy', 'name email phone')
      .sort({ bookingDate: -1 });

    const statusOrder = {
      'Pending': 1,
      'Approved': 2,
      'Rejected': 3,
      'Cancelled': 4
    };

    bookings.sort((a, b) => {
      const orderA = statusOrder[a.status] || 99;
      const orderB = statusOrder[b.status] || 99;
      if (orderA !== orderB) return orderA - orderB;
      return b.bookingDate - a.bookingDate;
    });

    return bookings;
  },

  getFacilityUsageAnalytics: async () => {
    const facilityCounts = await FacilityBooking.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: '$facilityName', totalBookings: { $sum: 1 } } },
    ]);

    const statusCounts = await FacilityBooking.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    return {
      facilityCounts,
      statusCounts,
    };
  },

  updateBooking: async (bookingId, updateData, adminUserId, auditMeta = {}) => {
    const booking = await FacilityBooking.findById(bookingId);
    if (!booking) {
      throw new AppError('Booking record not found', 404);
    }

    const { facilityName, bookingDate, startTime, endTime, status, notes } = updateData;

    if (facilityName) booking.facilityName = facilityName;
    if (bookingDate) booking.bookingDate = new Date(bookingDate);
    if (startTime) booking.startTime = startTime;
    if (endTime) booking.endTime = endTime;
    if (status) booking.status = status;
    if (notes !== undefined) booking.notes = notes;

    booking.updatedBy = adminUserId;
    await booking.save();

    await logEvent({
      action: 'Password Change',
      user: adminUserId,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      status: 'Success',
      details: `Facility booking ${booking._id} updated by admin.`,
    });

    return booking;
  },

  deleteBooking: async (bookingId, adminUserId, auditMeta = {}) => {
    const booking = await FacilityBooking.findById(bookingId);
    if (!booking) {
      throw new AppError('Booking record not found', 404);
    }

    booking.isDeleted = true;
    await booking.save();

    await logEvent({
      action: 'Password Change',
      user: adminUserId,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      status: 'Success',
      details: `Facility booking ${booking._id} softly deleted by admin.`,
    });

    return true;
  },
};
