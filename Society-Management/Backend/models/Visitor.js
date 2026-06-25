import mongoose from 'mongoose';
import softDeletePlugin from '../utils/softDeletePlugin.js';

const visitorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Visitor name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Visitor phone number is required'],
      trim: true,
    },
    visitorType: {
      type: String,
      enum: ['Guest', 'Delivery', 'Maid', 'Driver', 'Vendor', 'Other'],
      required: [true, 'Visitor type is required'],
    },
    photoUrl: {
      type: String,
      default: '',
    },
    purpose: {
      type: String,
      required: [true, 'Purpose of visit is required'],
      trim: true,
    },
    vehicleNumber: {
      type: String,
      trim: true,
      default: '',
    },
    hostResident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Host resident reference is required'],
    },
    expectedDuration: {
      type: String, 
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Checked In', 'Checked Out'],
      default: 'Pending',
    },
    checkIn: {
      type: Date,
      default: null,
    },
    checkOut: {
      type: Date,
      default: null,
    },
    uniqueVisitorId: {
      type: String,
      required: true,
      unique: true,
    },
    qrCode: {
      type: String, 
      default: '',
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Security staff record entry is required'],
    },
  },
  {
    timestamps: true,
  }
);

visitorSchema.plugin(softDeletePlugin);

visitorSchema.index({ hostResident: 1, status: 1 });
visitorSchema.index({ status: 1, checkIn: 1 });

const Visitor = mongoose.model('Visitor', visitorSchema);

export default Visitor;
