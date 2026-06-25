import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import AppError from '../utils/AppError.js';
import { logEvent } from '../utils/auditLogger.js';

const SLA_LIMITS = {
  Critical: 2 * 60,
  High: 4 * 60,
  Medium: 24 * 60,
  Low: 48 * 60,
};

export const complaintService = {
  createComplaint: async (complaintData, raisedByUserId) => {
    const { title, description, category, priority, images } = complaintData;

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority: priority || 'Medium',
      images: images || [],
      raisedBy: raisedByUserId,
      status: 'Open',
      timeline: [
        {
          status: 'Open',
          changedBy: raisedByUserId,
          notes: 'Complaint registered in system.',
        },
      ],
    });

    const admins = await User.find({ role: 'Admin' }).select('_id');
    for (const admin of admins) {
      await Notification.create({
        recipient: admin._id,
        title: 'New Complaint Registered',
        message: `New ${category} complaint: "${title}" has been submitted. Priority: ${priority || 'Medium'}`,
        type: 'Complaint',
      });
    }

    return complaint;
  },

  assignComplaint: async (complaintId, assignedToStaffId, adminUserId, auditMeta = {}) => {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      throw new AppError('Complaint not found', 404);
    }

    const staff = await User.findById(assignedToStaffId);
    if (!staff || staff.role !== 'Maintenance Staff') {
      throw new AppError('Assigned user must be registered as Maintenance Staff', 400);
    }

    const previousStatus = complaint.status;
    complaint.assignedTo = assignedToStaffId;
    complaint.status = 'Assigned';

    const assignedAt = new Date();
    complaint.sla.assignedAt = assignedAt;
    complaint.sla.responseDuration = Math.round((assignedAt - complaint.createdAt) / (60 * 1000)); 

    complaint.timeline.push({
      status: 'Assigned',
      changedBy: adminUserId,
      notes: `Complaint assigned to staff: ${staff.name}`,
    });

    await complaint.save();

    await Notification.create({
      recipient: assignedToStaffId,
      title: 'New Complaint Assigned',
      message: `You have been assigned a complaint: "${complaint.title}" (Priority: ${complaint.priority})`,
      type: 'Complaint',
    });

    await Notification.create({
      recipient: complaint.raisedBy,
      title: 'Complaint Assigned',
      message: `Your complaint "${complaint.title}" has been assigned to ${staff.name} for investigation.`,
      type: 'Complaint',
    });

    await logEvent({
      action: 'User Creation', 
      user: adminUserId,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      status: 'Success',
      details: `Complaint "${complaint.title}" assigned to staff ${staff.name}. Status: Assigned`,
    });

    return complaint;
  },

  updateComplaintStatus: async (complaintId, status, notes, updatedByUserId, completionNotes = '', auditMeta = {}) => {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      throw new AppError('Complaint not found', 404);
    }

    const previousStatus = complaint.status;

    const validTransitions = {
      Open: ['Assigned', 'Closed'],
      Assigned: ['In Progress', 'Resolved'],
      'In Progress': ['Resolved'],
      Resolved: ['Closed'],
      Closed: [],
    };

    if (previousStatus !== status && !validTransitions[previousStatus].includes(status)) {
      throw new AppError(`Invalid status transition from '${previousStatus}' to '${status}'`, 400);
    }

    complaint.status = status;

    if (status === 'Resolved') {
      const resolvedAt = new Date();
      complaint.sla.resolvedAt = resolvedAt;
      complaint.completionNotes = completionNotes || '';

      if (complaint.sla.assignedAt) {
        const resolutionDuration = Math.round((resolvedAt - complaint.sla.assignedAt) / (60 * 1000));
        complaint.sla.resolutionDuration = resolutionDuration;

        const threshold = SLA_LIMITS[complaint.priority] || 24 * 60; 
        if (resolutionDuration > threshold) {
          complaint.sla.isOverdue = true;
        }
      }
    }

    if (status === 'Closed') {
      complaint.sla.closedAt = new Date();
    }

    complaint.timeline.push({
      status,
      changedBy: updatedByUserId,
      notes: notes || `Status updated from ${previousStatus} to ${status}.`,
    });

    await complaint.save();

    const updater = await User.findById(updatedByUserId);

    if (updater.role !== 'Resident') {
      await Notification.create({
        recipient: complaint.raisedBy,
        title: `Complaint Status Updated: ${status}`,
        message: `Your complaint "${complaint.title}" status has been updated to "${status}". Note: ${notes || 'None'}`,
        type: 'Complaint',
      });
    }

    if (status === 'Resolved') {
      const admins = await User.find({ role: 'Admin' }).select('_id');
      for (const admin of admins) {
        await Notification.create({
          recipient: admin._id,
          title: 'Complaint Resolved',
          message: `Complaint "${complaint.title}" has been resolved by staff. Resolution Note: ${completionNotes}`,
          type: 'Complaint',
        });
      }
    }

    await logEvent({
      action: 'Password Change', 
      user: updatedByUserId,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      status: 'Success',
      details: `Complaint ID: ${complaint._id} status transitioned from ${previousStatus} to ${status}`,
    });

    return complaint;
  },

  addComment: async (complaintId, authorId, text) => {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      throw new AppError('Complaint not found', 404);
    }

    complaint.comments.push({
      author: authorId,
      text,
    });

    await complaint.save();

        await complaint.populate('comments.author', 'name');

    const author = await User.findById(authorId);
    const recipient = author.role === 'Resident' 
      ? (complaint.assignedTo || (await User.findOne({ role: 'Admin' }))._id)
      : complaint.raisedBy;

    await Notification.create({
      recipient,
      title: 'New Comment on Complaint',
      message: `${author.name} commented on complaint: "${complaint.title}"`,
      type: 'Complaint',
    });

    return complaint;
  },

  getResidentComplaints: async (residentUserId, query, paginationOptions) => {
    const { status, category, search } = query;
    const { page = 1, limit = 10 } = paginationOptions;

    const filter = { raisedBy: residentUserId };

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skipIndex = (page - 1) * limit;

    const complaints = await Complaint.find(filter)
      .populate('assignedTo', 'name phone avatar')
      .populate('comments.author', 'name')
      .skip(skipIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalCount = await Complaint.countDocuments(filter);

    return {
      complaints,
      meta: {
        totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  },

  getMaintenanceWorklist: async (staffUserId) => {
    const active = await Complaint.find({
      assignedTo: staffUserId,
      status: { $in: ['Assigned', 'In Progress'] },
    })
      .populate('raisedBy', 'name phone')
      .populate('comments.author', 'name')
      .sort({ priority: 1, createdAt: 1 });

    const resolved = await Complaint.find({
      assignedTo: staffUserId,
      status: { $in: ['Resolved', 'Closed'] },
    })
      .populate('raisedBy', 'name phone')
      .populate('comments.author', 'name')
      .sort({ updatedAt: -1 })
      .limit(20);

    return {
      activeWork: active,
      resolvedWork: resolved,
    };
  },

  getAdminComplaints: async (query, paginationOptions) => {
    const { status, category, priority, assignedTo, search } = query;
    const { page = 1, limit = 10 } = paginationOptions;

    const filter = { isDeleted: { $ne: true } };

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skipIndex = (page - 1) * limit;

    const complaints = await Complaint.find(filter)
      .populate('raisedBy', 'name phone')
      .populate('assignedTo', 'name phone')
      .populate('comments.author', 'name')
      .skip(skipIndex)
      .limit(limit)
      .sort({ assignedTo: 1, createdAt: -1 });

    const totalCount = await Complaint.countDocuments(filter);

    return {
      complaints,
      meta: {
        totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  },

  getAdminAnalytics: async () => {
    const statusReport = await Complaint.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const categoryReport = await Complaint.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const resolutionStats = await Complaint.aggregate([
      { $match: { isDeleted: { $ne: true }, 'sla.resolvedAt': { $ne: null } } },
      {
        $group: {
          _id: null,
          avgResolutionTimeMinutes: { $avg: '$sla.resolutionDuration' },
          totalResolved: { $sum: 1 },
          overdueCount: { $sum: { $cond: [{ $eq: ['$sla.isOverdue', true] }, 1, 0] } },
        },
      },
    ]);

    const staffPerformance = await Complaint.aggregate([
      { $match: { isDeleted: { $ne: true }, assignedTo: { $ne: null } } },
      {
        $group: {
          _id: '$assignedTo',
          assignedCount: { $sum: 1 },
          resolvedCount: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } },
          avgResolutionTimeMinutes: { $avg: '$sla.resolutionDuration' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'staffDetails',
        },
      },
      { $unwind: '$staffDetails' },
      {
        $project: {
          staffId: '$_id',
          name: '$staffDetails.name',
          email: '$staffDetails.email',
          assignedCount: 1,
          resolvedCount: 1,
          avgResolutionTimeMinutes: 1,
        },
      },
    ]);

    const monthlyTrends = await Complaint.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
    ]);

    return {
      statusReport,
      categoryReport,
      resolutionStats: resolutionStats[0] || {
        avgResolutionTimeMinutes: 0,
        totalResolved: 0,
        overdueCount: 0,
      },
      staffPerformance,
      monthlyTrends,
    };
  },

  updateComplaint: async (complaintId, updateData, adminUserId, auditMeta = {}) => {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      throw new AppError('Complaint not found', 404);
    }

    const { title, description, category, priority, status } = updateData;

    if (title) complaint.title = title;
    if (description) complaint.description = description;
    if (category) complaint.category = category;
    if (priority) complaint.priority = priority;

    if (status && status !== complaint.status) {
       return await complaintService.updateComplaintStatus(complaintId, status, "Status updated by admin via edit", adminUserId, "", auditMeta);
    }

    await complaint.save();

    await logEvent({
      action: 'Password Change', 
      user: adminUserId,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      status: 'Success',
      details: `Complaint ${complaint._id} updated by admin.`,
    });

    return complaint;
  },

  deleteComplaint: async (complaintId, adminUserId, auditMeta = {}) => {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      throw new AppError('Complaint not found', 404);
    }

    complaint.isDeleted = true;
    await complaint.save();

    await logEvent({
      action: 'Password Change',
      user: adminUserId,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      status: 'Success',
      details: `Complaint ${complaint._id} softly deleted by admin.`,
    });

    return true;
  },
};
