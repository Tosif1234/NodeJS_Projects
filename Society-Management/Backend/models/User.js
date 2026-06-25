import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES } from '../constants/roles.js';
import softDeletePlugin from '../utils/softDeletePlugin.js';

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  family: {
    type: String,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: [true, 'Role is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Suspended'],
      default: function () {
        return this.role === ROLES.ADMIN ? 'Approved' : 'Pending';
      },
    },
    avatar: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
    otpVerifiedToken: {
      type: String,
      default: null,
    },
    otpVerifiedExpires: {
      type: Date,
      default: null,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
    },
    refreshTokens: [refreshTokenSchema],
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(softDeletePlugin);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

userSchema.methods.resetFailedAttempts = async function () {
  this.failedLoginAttempts = 0;
  this.lockUntil = null;
  return this.save();
};

const User = mongoose.model('User', userSchema);

export default User;
