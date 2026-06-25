import mongoose from 'mongoose';
import softDeletePlugin from '../utils/softDeletePlugin.js';

const facilityBookingSchema = new mongoose.Schema(
  {
    facilityName: {
      type: String,
      enum: ['Club House', 'Gym', 'Community Hall', 'Swimming Pool', 'Sports Court', 'Garden Area'],
      required: [true, 'Facility name is required'],
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking user reference is required'],
    },
    bookingDate: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format for start time'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format for end time'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

facilityBookingSchema.plugin(softDeletePlugin);

facilityBookingSchema.index({ facilityName: 1, bookingDate: 1, status: 1 });

const FacilityBooking = mongoose.model('FacilityBooking', facilityBookingSchema);

export default FacilityBooking;
