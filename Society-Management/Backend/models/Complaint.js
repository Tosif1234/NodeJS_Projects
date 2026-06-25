import mongoose from 'mongoose';
import softDeletePlugin from '../utils/softDeletePlugin.js';

const timelineSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Electrical', 'Plumbing', 'Water Supply', 'Cleaning', 'Security', 'Parking', 'Lift Maintenance', 'Other'],
      required: [true, 'Complaint category is required'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference who raised the complaint is required'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, 
    },
    status: {
      type: String,
      enum: ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
    },
    images: {
      type: [String],
      default: [],
    },
    completionNotes: {
      type: String,
      default: '',
    },
    timeline: [timelineSchema],
    comments: [commentSchema],
    sla: {
      assignedAt: { type: Date, default: null },
      resolvedAt: { type: Date, default: null },
      closedAt: { type: Date, default: null },
      responseDuration: { type: Number, default: null }, 
      resolutionDuration: { type: Number, default: null }, 
      isOverdue: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

complaintSchema.plugin(softDeletePlugin);

complaintSchema.index({ status: 1, priority: 1 });
complaintSchema.index({ raisedBy: 1 });
complaintSchema.index({ assignedTo: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
