import mongoose from 'mongoose';
import softDeletePlugin from '../utils/softDeletePlugin.js';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Visitor', 'Complaint', 'Bill', 'Booking', 'Notice', 'Poll', 'General'],
      required: [true, 'Notification type is required'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.plugin(softDeletePlugin);

notificationSchema.index({ recipient: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
