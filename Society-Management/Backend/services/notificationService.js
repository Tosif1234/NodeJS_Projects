import Notification from '../models/Notification.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import sendEmail from '../utils/sendEmail.js';

export const notificationService = {
  getUserNotifications: async (userId, paginationOptions = {}) => {
    const { page = 1, limit = 20 } = paginationOptions;
    const skipIndex = (page - 1) * limit;

    const notifications = await Notification.find({ recipient: userId })
      .skip(skipIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalCount = await Notification.countDocuments({ recipient: userId });

    return {
      notifications,
      meta: {
        totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  },

  getUnreadCount: async (userId) => {
    const count = await Notification.countDocuments({ recipient: userId, isRead: false });
    return { unreadCount: count };
  },

  markAsRead: async (notificationId, userId) => {
    const notification = await Notification.findOne({ _id: notificationId, recipient: userId });
    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    notification.isRead = true;
    await notification.save();
    return notification;
  },

  markAllAsRead: async (userId) => {
    await Notification.updateMany({ recipient: userId, isRead: false }, { $set: { isRead: true } });
    return { success: true };
  },

  updatePreferences: async (userId, preferences) => {
    const { email, inApp } = preferences;

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (email !== undefined) user.notificationPreferences.email = email;
    if (inApp !== undefined) user.notificationPreferences.inApp = inApp;

    await user.save();
    return user.notificationPreferences;
  },

  createNotification: async ({ recipient, title, message, type, emailSubject = '', emailBody = '' }) => {
    const user = await User.findById(recipient);
    if (!user || user.isDeleted) return null;

    let inAppResult = null;

    if (user.notificationPreferences.inApp) {
      inAppResult = await Notification.create({
        recipient,
        title,
        message,
        type,
      });
    }

    if (user.notificationPreferences.email) {
      const subject = emailSubject || title;
      const body = emailBody || message;

      try {
        await sendEmail({
          email: user.email,
          subject,
          message: body,
          html: `<p>${body}</p>`,
        });
      } catch (err) {
        console.error(`Email notification failed for user ${user.email}:`, err.message);
      }
    }

    return inAppResult;
  },

  createBulkRoleNotification: async (role, title, message, type) => {
    const users = await User.find({ role, status: 'Approved', isDeleted: { $ne: true } });

        let createdCount = 0;
    for (const u of users) {
      await notificationService.createNotification({
        recipient: u._id,
        title,
        message,
        type,
      });
      createdCount++;
    }

    return { createdCount };
  },
};
