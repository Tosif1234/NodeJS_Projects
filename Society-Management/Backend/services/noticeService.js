import Notice from '../models/Notice.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import AppError from '../utils/AppError.js';

export const noticeService = {
  createNotice: async (noticeData, adminUserId) => {
    const { title, content, category, targetRoles, attachmentUrl, publishAt, expiresAt, status = 'Published' } = noticeData;

    const notice = await Notice.create({
      title,
      content,
      category,
      targetRoles: targetRoles || ['Resident', 'Security Staff', 'Maintenance Staff'],
      attachmentUrl: attachmentUrl || '',
      status,
      publishAt: publishAt ? new Date(publishAt) : new Date(),
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdBy: adminUserId,
    });

    if (status === 'Published') {
      await noticeService.notifyTargetRoles(notice);
    }

    return notice;
  },

  notifyTargetRoles: async (notice) => {
    const targetUsers = await User.find({
      role: { $in: notice.targetRoles },
      status: 'Approved',
      isDeleted: { $ne: true },
    }).select('_id');

    for (const targetUser of targetUsers) {
      await Notification.create({
        recipient: targetUser._id,
        title: `New Notice: ${notice.title}`,
        message: `A new notice has been published in "${notice.category}": "${notice.title}"`,
        type: 'Notice',
      });
    }
  },

  updateNotice: async (noticeId, updateData, adminUserId) => {
    const notice = await Notice.findById(noticeId);
    if (!notice) {
      throw new AppError('Notice not found', 404);
    }

    const previousStatus = notice.status;

    const allowedFields = ['title', 'content', 'category', 'targetRoles', 'attachmentUrl', 'status', 'publishAt', 'expiresAt'];
    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        notice[field] = updateData[field];
      }
    });

    notice.updatedBy = adminUserId;
    await notice.save();

    if (previousStatus !== 'Published' && notice.status === 'Published') {
      await noticeService.notifyTargetRoles(notice);
    }

    return notice;
  },

  publishNotice: async (noticeId, adminUserId) => {
    const notice = await Notice.findById(noticeId);
    if (!notice) {
      throw new AppError('Notice not found', 404);
    }

    if (notice.status === 'Published') {
      throw new AppError('Notice is already published', 400);
    }

    notice.status = 'Published';
    notice.publishAt = new Date();
    notice.updatedBy = adminUserId;
    await notice.save();

    await noticeService.notifyTargetRoles(notice);

    return notice;
  },

  deleteNotice: async (noticeId, adminUserId) => {
    const notice = await Notice.findById(noticeId);
    if (!notice) {
      throw new AppError('Notice not found', 404);
    }

    await notice.softDelete(adminUserId);
    return { success: true };
  },

  markNoticeAsRead: async (noticeId, userId) => {
    const notice = await Notice.findOne({
      _id: noticeId,
      status: 'Published',
    });

    if (!notice) {
      throw new AppError('Notice not found or not published', 404);
    }

    if (!notice.readBy.includes(userId)) {
      notice.readBy.push(userId);
      await notice.save();
    }

    return notice;
  },

  listNoticesForUser: async (userId, userRole, query, paginationOptions) => {
    const { category, search } = query;
    const { page = 1, limit = 10 } = paginationOptions;

    const filter = {
      status: 'Published',
      publishAt: { $lte: new Date() },
      targetRoles: userRole,
    };

    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const skipIndex = (page - 1) * limit;

    const noticesRaw = await Notice.find(filter)
      .skip(skipIndex)
      .limit(limit)
      .sort({ publishAt: -1 });

    const totalCount = await Notice.countDocuments(filter);

    const notices = noticesRaw.map((n) => {
      const obj = n.toObject();
      obj.isRead = n.readBy.some((id) => id.toString() === userId.toString());
      delete obj.readBy;
      return obj;
    });

    return {
      notices,
      meta: {
        totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  },

  listNoticesForAdmin: async (query, paginationOptions) => {
    const { status, category, search } = query;
    const { page = 1, limit = 10 } = paginationOptions;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const skipIndex = (page - 1) * limit;

    const notices = await Notice.find(filter)
      .skip(skipIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalCount = await Notice.countDocuments(filter);

    const totalResidents = await User.countDocuments({ role: 'Resident', status: 'Approved', isDeleted: { $ne: true } });

    const noticesWithStats = notices.map((n) => {
      const obj = n.toObject();
      obj.readCount = n.readBy.length;
      obj.readPercentage = totalResidents > 0 ? (n.readBy.length / totalResidents) * 100 : 0;
      return obj;
    });

    return {
      notices: noticesWithStats,
      meta: {
        totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  },
};
