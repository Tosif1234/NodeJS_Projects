import mongoose from 'mongoose';
import softDeletePlugin from '../utils/softDeletePlugin.js';

const familyMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Family member name is required'],
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  age: {
    type: Number,
    min: 0,
    max: 120,
  },
  relation: {
    type: String,
    required: [true, 'Relation is required'],
    trim: true,
  },
  isEmergencyContact: {
    type: Boolean,
    default: false,
  },
});

const vehicleSchema = new mongoose.Schema({
  vehicleType: {
    type: String,
    enum: ['Car', 'Bike', 'EV', 'Other'],
    required: [true, 'Vehicle type is required'],
  },
  vehicleName: {
    type: String,
    required: [true, 'Vehicle name/model is required'],
    trim: true,
  },
  licensePlate: {
    type: String,
    required: [true, 'License plate number is required'],
    trim: true,
    uppercase: true,
  },
});

const residentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required'],
      unique: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    flatNumber: {
      type: String,
      required: [true, 'Flat/House number is required'],
      trim: true,
    },
    block: {
      type: String,
      required: [true, 'Block/Tower name is required'],
      trim: true,
    },
    floor: {
      type: String,
      trim: true,
      default: '',
    },
    streetAddress: {
      type: String,
      trim: true,
      default: '',
    },
    occupancyType: {
      type: String,
      enum: ['Owner', 'Tenant'],
      required: [true, 'Occupancy type (Owner/Tenant) is required'],
    },
    familyMembers: [familyMemberSchema],
    vehicles: [vehicleSchema],
  },
  {
    timestamps: true,
  }
);

residentProfileSchema.plugin(softDeletePlugin);

residentProfileSchema.index({ flatNumber: 1, block: 1 });
residentProfileSchema.index({ 'vehicles.licensePlate': 1 });

const ResidentProfile = mongoose.model('ResidentProfile', residentProfileSchema);

export default ResidentProfile;
