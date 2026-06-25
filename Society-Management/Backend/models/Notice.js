import mongoose from 'mongoose';
import softDeletePlugin from '../utils/softDeletePlugin.js';

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Notice title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Notice content is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['General', 'Maintenance', 'Event', 'Meeting', 'Emergency'],
      required: [true, 'Notice category is required'],
    },
    targetRoles: {
      type: [String],
      enum: ['Resident', 'Security Staff', 'Maintenance Staff'],
      default: ['Resident', 'Security Staff', 'Maintenance Staff'],
    },
    attachmentUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Scheduled', 'Expired'],
      default: 'Draft',
    },
    publishAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

noticeSchema.plugin(softDeletePlugin);

noticeSchema.index({ status: 1, publishAt: 1 });

const Notice = mongoose.model('Notice', noticeSchema);

export default Notice;
