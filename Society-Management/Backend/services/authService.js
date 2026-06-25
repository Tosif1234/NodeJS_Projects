import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import sendEmail from '../utils/sendEmail.js';
import { logEvent } from '../utils/auditLogger.js';
import { ROLES } from '../constants/roles.js';

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

const generateRefreshTokenData = (tokenFamily = null) => {
  const plainToken = crypto.randomBytes(40).toString('hex');
  const hashedToken = hashToken(plainToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 
  const family = tokenFamily || crypto.randomUUID();

  return {
    plainToken,
    hashedToken,
    expiresAt,
    family,
  };
};

export const authService = {
  registerUser: async (userData, isCreatorAdmin = false, auditMeta = {}) => {
    const { name, email, password, phone, role } = userData;

    if (!isCreatorAdmin && role !== ROLES.RESIDENT) {
      throw new AppError('Public registration is only allowed for Resident role', 400);
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new AppError('Email address already registered', 400);
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = hashToken(verificationToken);
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); 

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role,
      emailVerificationToken: hashedVerificationToken,
      emailVerificationExpires: verificationExpires,
    });

    await logEvent({
      action: 'User Creation',
      user: user._id,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      status: 'Success',
      details: `User registered successfully. Role: ${role}. Created by ${isCreatorAdmin ? 'Admin' : 'Public'}`,
    });

    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}&email=${email}`;
    const message = `Welcome to Smart Society Management System. Please verify your email by clicking the link: \n\n ${verificationUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify your Smart Society Account',
        message,
        html: `<p>Please click the following link to verify your account:</p><a href="${verificationUrl}">${verificationUrl}</a>`,
      });
    } catch (err) {
      console.error('Email verification sending failed:', err.message);
    }

    return user;
  },

  verifyEmail: async (email, plainToken, auditMeta = {}) => {
    const hashedInputToken = hashToken(plainToken);

    const user = await User.findOne({
      email,
      emailVerificationToken: hashedInputToken,
    });

    if (!user) {
      throw new AppError('Invalid email or verification token', 400);
    }

    if (user.emailVerificationExpires < Date.now()) {
      throw new AppError('Verification token expired', 400);
    }

    user.isVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    await logEvent({
      action: 'User Creation', 
      user: user._id,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      status: 'Success',
      details: 'Email verification completed.',
    });

    return user;
  },

  loginUser: async (email, password, auditMeta = {}) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (user.isLocked()) {
      const lockRemainingMinutes = Math.ceil((user.lockUntil - Date.now()) / 60000);

            await logEvent({
        action: 'Failed Login Attempt',
        user: user._id,
        ipAddress: auditMeta.ipAddress,
        userAgent: auditMeta.userAgent,
        status: 'Failure',
        details: 'Attempted login while account locked.',
      });

      throw new AppError(`Account is temporarily locked due to multiple failed login attempts. Try again in ${lockRemainingMinutes} minute(s).`, 403);
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      user.failedLoginAttempts += 1;
      let isLockedNow = false;

      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); 
        isLockedNow = true;
      }
      await user.save();

      await logEvent({
        action: 'Failed Login Attempt',
        user: user._id,
        ipAddress: auditMeta.ipAddress,
        userAgent: auditMeta.userAgent,
        status: 'Failure',
        details: `Invalid password. Attempt #${user.failedLoginAttempts}.${isLockedNow ? ' Account locked for 15 minutes.' : ''}`,
      });

      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isVerified) {
      await logEvent({
        action: 'Failed Login Attempt',
        user: user._id,
        ipAddress: auditMeta.ipAddress,
        userAgent: auditMeta.userAgent,
        status: 'Failure',
        details: 'Attempted login with unverified email.',
      });
      throw new AppError('Please verify your email address before logging in.', 403);
    }

    if (user.status !== 'Approved') {
      await logEvent({
        action: 'Failed Login Attempt',
        user: user._id,
        ipAddress: auditMeta.ipAddress,
        userAgent: auditMeta.userAgent,
        status: 'Failure',
        details: `Attempted login while status is ${user.status}`,
      });
      throw new AppError(`Your account is not active. Status: ${user.status}`, 403);
    }

    await user.resetFailedAttempts();

    const tokenData = generateRefreshTokenData();

    user.refreshTokens.push({
      token: tokenData.hashedToken,
      expiresAt: tokenData.expiresAt,
      family: tokenData.family,
    });

    if (user.refreshTokens.length > 20) {
      user.refreshTokens.shift();
    }

    await user.save();

    await logEvent({
      action: 'Login',
      user: user._id,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      status: 'Success',
      details: 'User logged in successfully.',
    });

    const accessToken = generateAccessToken(user);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        status: user.status,
      },
      accessToken,
      refreshToken: tokenData.plainToken,
    };
  },

  rotateTokens: async (plainRefreshToken, auditMeta = {}) => {
    const hashedInputToken = hashToken(plainRefreshToken);

    const user = await User.findOne({
      'refreshTokens.token': hashedInputToken,
    });

    if (!user) {
      throw new AppError('Invalid or expired refresh token', 403);
    }

    const tokenObj = user.refreshTokens.find((rt) => rt.token === hashedInputToken);

    if (tokenObj.used) {
      user.refreshTokens = [];
      await user.save();

      await logEvent({
        action: 'Failed Login Attempt',
        user: user._id,
        ipAddress: auditMeta.ipAddress,
        userAgent: auditMeta.userAgent,
        status: 'Failure',
        details: 'Refresh token reuse detected. Revoking all sessions.',
      });

      throw new AppError('Security breach: session revoked. Please login again.', 403);
    }

    if (tokenObj.expiresAt < Date.now()) {
      user.refreshTokens = user.refreshTokens.filter((rt) => rt.token !== hashedInputToken);
      await user.save();
      throw new AppError('Session expired. Please login again.', 403);
    }

    tokenObj.used = true;

    const tokenData = generateRefreshTokenData(tokenObj.family);
    user.refreshTokens.push({
      token: tokenData.hashedToken,
      expiresAt: tokenData.expiresAt,
      family: tokenData.family,
    });

    await user.save();

    const accessToken = generateAccessToken(user);

    return {
      accessToken,
      refreshToken: tokenData.plainToken,
    };
  },

  logoutSession: async (plainRefreshToken, auditMeta = {}) => {
    if (!plainRefreshToken) return;

    const hashedInputToken = hashToken(plainRefreshToken);
    const user = await User.findOne({ 'refreshTokens.token': hashedInputToken });

    if (user) {
      const tokenObj = user.refreshTokens.find((rt) => rt.token === hashedInputToken);
      if (tokenObj) {
        user.refreshTokens = user.refreshTokens.filter(
          (rt) => rt.family !== tokenObj.family
        );
        await user.save();

        await logEvent({
          action: 'Logout',
          user: user._id,
          ipAddress: auditMeta.ipAddress,
          userAgent: auditMeta.userAgent,
          status: 'Success',
          details: 'Single device logout complete.',
        });
      }
    }
  },

  logoutAllSessions: async (userId, auditMeta = {}) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.refreshTokens = [];
    await user.save();

    await logEvent({
      action: 'Logout',
      user: user._id,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      status: 'Success',
      details: 'All devices logged out successfully.',
    });
  },

  forgotPassword: async (email, auditMeta = {}) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('No account found with this email address. Please check and try again.', 404);
    }

    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetToken = hashToken(resetToken);

    user.passwordResetToken = hashedResetToken;
    user.passwordResetExpires = new Date(Date.now() + 2 * 60 * 1000); 
    user.otpVerifiedToken = null;
    user.otpVerifiedExpires = null;
    await user.save();

    const message = `You requested a password reset. Your OTP (One Time Password) is:\n\n${resetToken}\n\nThis OTP is valid for 2 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset OTP',
        message,
        html: `<div style="font-family: sans-serif; padding: 20px; color: #1e293b; max-width: 480px;">
          <h3 style="margin-bottom: 8px;">Password Reset Request</h3>
          <p>Please use the following One-Time Password (OTP) to reset your account password:</p>
          <div style="font-size: 32px; font-weight: 800; color: #4f46e5; letter-spacing: 8px; padding: 16px 24px; background-color: #f1f5f9; border-radius: 12px; width: fit-content; margin: 16px 0;">
            ${resetToken}
          </div>
          <p style="color: #ef4444; font-weight: 600;">⚠️ This OTP expires in <strong>2 minutes</strong>.</p>
          <p style="color: #64748b; font-size: 13px;">If you did not request a password reset, please ignore this email.</p>
        </div>`,
      });
    } catch (err) {
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await user.save();
      throw new AppError('Failed to send reset email. Try again later.', 500);
    }
  },

  verifyOtp: async (email, plainOtp, auditMeta = {}) => {
    const hashedOtp = hashToken(plainOtp);

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError('No account found with this email address', 404);
    }

    if (!user.passwordResetToken || !user.passwordResetExpires) {
      throw new AppError('No OTP was requested for this account. Please request a new OTP.', 400);
    }

    if (user.passwordResetExpires < Date.now()) {
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await user.save();
      throw new AppError('OTP has expired. Please request a new one.', 400);
    }

    if (user.passwordResetToken !== hashedOtp) {
      throw new AppError('Incorrect OTP. Please check and try again.', 400);
    }

    const verifiedToken = crypto.randomBytes(32).toString('hex');
    const hashedVerifiedToken = hashToken(verifiedToken);

    user.otpVerifiedToken = hashedVerifiedToken;
    user.otpVerifiedExpires = new Date(Date.now() + 5 * 60 * 1000); 
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    await logEvent({
      action: 'Password Reset',
      user: user._id,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      status: 'Success',
      details: 'OTP verified successfully. Verified token issued.',
    });

    return verifiedToken;
  },

  resetPassword: async (verifiedToken, newPassword, auditMeta = {}) => {
    const hashedVerifiedToken = hashToken(verifiedToken);

    const user = await User.findOne({
      otpVerifiedToken: hashedVerifiedToken,
      otpVerifiedExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError('Session expired or invalid. Please verify your OTP again.', 400);
    }

    user.password = newPassword;
    user.otpVerifiedToken = null;
    user.otpVerifiedExpires = null;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    user.refreshTokens = [];

    await user.save();

    await logEvent({
      action: 'Password Reset',
      user: user._id,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      status: 'Success',
      details: 'Password reset completed. All sessions revoked.',
    });
  },

  changePassword: async (userId, currentPassword, newPassword, auditMeta = {}) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      throw new AppError('Incorrect current password', 400);
    }

    user.password = newPassword;
    user.refreshTokens = [];
    await user.save();

    await logEvent({
      action: 'Password Change',
      user: user._id,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      status: 'Success',
      details: 'Password changed successfully. All sessions revoked.',
    });
  },

  updateProfile: async (userId, updateData, auditMeta = {}) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (updateData.name) user.name = updateData.name;
    if (updateData.phone) user.phone = updateData.phone;

        await user.save();

    await logEvent({
      action: 'Profile Update',
      user: user._id,
      ipAddress: auditMeta.ipAddress,
      userAgent: auditMeta.userAgent,
      status: 'Success',
      details: 'User profile updated successfully.',
    });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      status: user.status,
    };
  },
};
