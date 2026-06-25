import QRCode from 'qrcode';
import Visitor from '../models/Visitor.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import AppError from '../utils/AppError.js';
import { logEvent } from '../utils/auditLogger.js';

export const visitorService = {
  createVisitorRequest: async (visitorData, recordedByUserId) => {
    const { name, phone, visitorType, purpose, vehicleNumber, hostResident, expectedDuration, photoUrl } = visitorData;

    const resident = await User.findById(hostResident);
    if (!resident) {
      throw new AppError('Host resident not found', 404);
    }
    if (resident.role !== 'Resident') {
      throw new AppError('The selected host is not registered as a Resident', 400);
    }

    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const uniqueVisitorId = `PASS-${dateStr}-${randStr}`;

    let qrCode = '';
    try {
      qrCode = await QRCode.toDataURL(uniqueVisitorId);
    } catch (err) {
      console.error('Failed to generate QR Code:', err.message);
    }

    const visitor = await Visitor.create({
      name,
      phone,
      visitorType,
      purpose,
      vehicleNumber,
      hostResident,
      expectedDuration,
      photoUrl,
      uniqueVisitorId,
      qrCode,
      status: 'Pending',
      recordedBy: recordedByUserId,
    });

    await Notification.create({
      recipient: hostResident,
      title: 'New Visitor Request',
      message: `${name} (${visitorType}) is at the gate. Purpose: ${purpose}. Please approve or reject entry.`,
      type: 'Visitor',
    });

    return visitor;
  },

  updateVisitorStatus: async (visitorId, status, hostResidentUserId, auditMeta = {}) => {
    if (!['Approved', 'Rejected'].includes(status)) {
      throw new AppError('Invalid status. Status must be Approved or Rejected', 400);
    }

    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      throw new AppError('Visitor record not found', 404);
    }

    if (visitor.hostResident.toString() !== hostResidentUserId.toString()) {
      throw new AppError('You do not have permission to approve/reject this visitor', 403);
    }

    if (visitor.status !== 'Pending') {
      throw new AppError(`Cannot change status. Visitor is already '${visitor.status}'`, 400);
    }

    visitor.status = status;
    await visitor.save();

    await Notification.create({
      recipient: visitor.recordedBy, 
      title: `Visitor Request ${status}`,
      message: `Resident approved entry for ${visitor.name} (${visitor.visitorType}). Pass ID: ${visitor.uniqueVisitorId}`,
      type: 'Visitor',
    });

    await logEvent({
      action: 'User Creation', 
      user: hostResidentUserId,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      status: 'Success',
      details: `Visitor ${visitor.name} (${visitor.visitorType}) status updated to ${status}. Pass: ${visitor.uniqueVisitorId}`,
    });

    return visitor;
  },

  recordCheckIn: async (visitorId, securityStaffUserId, auditMeta = {}) => {
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      throw new AppError('Visitor record not found', 404);
    }

    if (visitor.status !== 'Approved') {
      throw new AppError(`Cannot check in. Visitor request status is '${visitor.status}'. Resident approval is required.`, 400);
    }

    visitor.status = 'Checked In';
    visitor.checkIn = new Date();
    visitor.recordedBy = securityStaffUserId; 
    await visitor.save();

    await Notification.create({
      recipient: visitor.hostResident,
      title: 'Visitor Checked In',
      message: `${visitor.name} (${visitor.visitorType}) has checked in at the gate. Check-in time: ${visitor.checkIn.toLocaleTimeString()}`,
      type: 'Visitor',
    });

    await logEvent({
      action: 'Login', 
      user: securityStaffUserId,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      status: 'Success',
      details: `Visitor ${visitor.name} checked in. Pass: ${visitor.uniqueVisitorId}`,
    });

    return visitor;
  },

  recordCheckOut: async (visitorId, securityStaffUserId, auditMeta = {}) => {
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      throw new AppError('Visitor record not found', 404);
    }

    if (visitor.status !== 'Checked In') {
      throw new AppError(`Cannot check out. Visitor current status is '${visitor.status}' (Must be Checked In).`, 400);
    }

    visitor.status = 'Checked Out';
    visitor.checkOut = new Date();
    await visitor.save();

    await Notification.create({
      recipient: visitor.hostResident,
      title: 'Visitor Checked Out',
      message: `${visitor.name} (${visitor.visitorType}) has checked out. Check-out time: ${visitor.checkOut.toLocaleTimeString()}`,
      type: 'Visitor',
    });

    await logEvent({
      action: 'Logout', 
      user: securityStaffUserId,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      status: 'Success',
      details: `Visitor ${visitor.name} checked out. Pass: ${visitor.uniqueVisitorId}`,
    });

    return visitor;
  },

  getSecurityDashboard: async (securityUserId) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const pendingApprovals = await Visitor.find({ status: 'Pending' })
      .populate('hostResident', 'name phone')
      .sort({ createdAt: -1 });

    const activeVisitors = await Visitor.find({ status: 'Checked In' })
      .populate('hostResident', 'name phone')
      .sort({ checkIn: -1 });

    const todaysVisitors = await Visitor.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate('hostResident', 'name phone')
      .sort({ createdAt: -1 });

    const visitorHistory = await Visitor.find({
      status: { $in: ['Checked Out', 'Rejected'] },
    })
      .populate('hostResident', 'name phone')
      .sort({ updatedAt: -1 })
      .limit(20);

    return {
      pendingCount: pendingApprovals.length,
      activeCount: activeVisitors.length,
      todaysCount: todaysVisitors.length,
      pendingApprovals,
      activeVisitors,
      todaysVisitors,
      visitorHistory,
    };
  },

  getResidentVisitors: async (residentUserId) => {
    const activeRequests = await Visitor.find({
      hostResident: residentUserId,
      status: { $in: ['Pending', 'Approved', 'Checked In'] },
    })
      .populate('recordedBy', 'name phone')
      .sort({ createdAt: -1 });

    const history = await Visitor.find({
      hostResident: residentUserId,
      status: { $in: ['Checked Out', 'Rejected'] },
    })
      .populate('recordedBy', 'name phone')
      .sort({ updatedAt: -1 })
      .limit(50);

    return {
      activeRequests,
      history,
    };
  },

  getAdminVisitorLogs: async (query, paginationOptions) => {
    const { search, status, visitorType, startDate, endDate } = query;
    const { page = 1, limit = 10 } = paginationOptions;

    const filter = { isDeleted: { $ne: true } };

    if (status) filter.status = status;
    if (visitorType) filter.visitorType = visitorType;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { uniqueVisitorId: { $regex: search, $options: 'i' } },
      ];
    }

    const skipIndex = (page - 1) * limit;

    const logs = await Visitor.find(filter)
      .populate('hostResident', 'name phone')
      .populate('recordedBy', 'name phone')
      .skip(skipIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalCount = await Visitor.countDocuments(filter);

    const typeAnalytics = await Visitor.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: '$visitorType', count: { $sum: 1 } } },
    ]);

    const statusAnalytics = await Visitor.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    return {
      logs,
      analytics: {
        totalCount,
        types: typeAnalytics,
        statuses: statusAnalytics,
      },
      meta: {
        totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  },

  updateVisitor: async (visitorId, updateData, adminUserId, auditMeta = {}) => {
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      throw new AppError('Visitor record not found', 404);
    }

    const { name, phone, visitorType, purpose, expectedDuration, status, hostResident } = updateData;

    if (name) visitor.name = name;
    if (phone) visitor.phone = phone;
    if (visitorType) visitor.visitorType = visitorType;
    if (purpose) visitor.purpose = purpose;
    if (expectedDuration) visitor.expectedDuration = expectedDuration;
    if (status) visitor.status = status;
    if (hostResident) visitor.hostResident = hostResident;

    await visitor.save();

    await logEvent({
      action: 'Password Change',
      user: adminUserId,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      status: 'Success',
      details: `Visitor ${visitor.name} updated by admin.`,
    });

    return visitor;
  },

  deleteVisitor: async (visitorId, adminUserId, auditMeta = {}) => {
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      throw new AppError('Visitor record not found', 404);
    }

    visitor.isDeleted = true;
    await visitor.save();

    await logEvent({
      action: 'Password Change',
      user: adminUserId,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      status: 'Success',
      details: `Visitor ${visitor.name} softly deleted by admin.`,
    });

    return true;
  },
};
