import mongoose from 'mongoose';
import softDeletePlugin from '../utils/softDeletePlugin.js';

const paymentDetailsSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    trim: true,
    default: '',
  },
  paymentMethod: {
    type: String,
    enum: ['Card', 'UPI', 'Net Banking', 'Cash'],
    trim: true,
  },
  paidAt: {
    type: Date,
    default: null,
  },
});

const maintenanceBillSchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Resident reference is required'],
    },
    invoiceNumber: {
      type: String,
      required: [true, 'Invoice number is required'],
      unique: true,
      trim: true,
    },
    month: {
      type: Number,
      required: [true, 'Bill month is required'],
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: [true, 'Bill year is required'],
    },
    maintenanceCharges: {
      type: Number,
      required: [true, 'Maintenance charges are required'],
      min: 0,
    },
    waterCharges: {
      type: Number,
      required: [true, 'Water charges are required'],
      min: 0,
    },
    parkingCharges: {
      type: Number,
      required: [true, 'Parking charges are required'],
      min: 0,
    },
    electricityCommonCharges: {
      type: Number,
      required: [true, 'Electricity common charges are required'],
      min: 0,
    },
    penalties: {
      type: Number,
      default: 0,
      min: 0,
    },
    otherCharges: {
      type: Number,
      default: 0,
      min: 0,
    },
    amount: {
      type: Number,
      required: [true, 'Total bill amount is required'],
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Partially Paid', 'Overdue'],
      default: 'Pending',
    },
    paymentDetails: {
      type: paymentDetailsSchema,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

maintenanceBillSchema.plugin(softDeletePlugin);

maintenanceBillSchema.index({ resident: 1, month: 1, year: 1, isDeleted: 1 }, { unique: true });

const MaintenanceBill = mongoose.model('MaintenanceBill', maintenanceBillSchema);

export default MaintenanceBill;
