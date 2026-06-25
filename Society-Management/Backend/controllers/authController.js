import { authService } from '../services/authService.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
};

export const register = asyncHandler(async (req, res) => {
  const isCreatorAdmin = req.user?.role === 'Admin';
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  const user = await authService.registerUser(req.body, isCreatorAdmin, auditMeta);

  return ApiResponse.success(
    res,
    'Registration successful. Please check your email to verify your account.',
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    201
  );
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, token } = req.query;
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  await authService.verifyEmail(email, token, auditMeta);

  return ApiResponse.success(res, 'Email verified successfully. You can now log in.');
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  const result = await authService.loginUser(email, password, auditMeta);

  setRefreshTokenCookie(res, result.refreshToken);

  return ApiResponse.success(res, 'Logged in successfully', {
    user: result.user,
    accessToken: result.accessToken,
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const plainRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  const result = await authService.rotateTokens(plainRefreshToken, auditMeta);

  setRefreshTokenCookie(res, result.refreshToken);

  return ApiResponse.success(res, 'Token refreshed successfully', {
    accessToken: result.accessToken,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const plainRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  await authService.logoutSession(plainRefreshToken, auditMeta);

  res.clearCookie('refreshToken');

  return ApiResponse.success(res, 'Logged out successfully');
});

export const logoutAll = asyncHandler(async (req, res) => {
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  await authService.logoutAllSessions(req.user._id, auditMeta);

  res.clearCookie('refreshToken');

  return ApiResponse.success(res, 'Logged out from all devices successfully');
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  await authService.forgotPassword(email, auditMeta);

  return ApiResponse.success(res, 'OTP sent successfully. Please check your email inbox.');
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  const verifiedToken = await authService.verifyOtp(email, otp, auditMeta);

  return ApiResponse.success(res, 'OTP verified successfully.', { verifiedToken });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { verifiedToken, password } = req.body;
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  await authService.resetPassword(verifiedToken, password, auditMeta);

  return ApiResponse.success(res, 'Password reset successful. All other sessions have been logged out.');
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  await authService.changePassword(req.user._id, currentPassword, newPassword, auditMeta);

  return ApiResponse.success(res, 'Password updated successfully. All other sessions have been logged out.');
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const auditMeta = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  const updatedUser = await authService.updateProfile(req.user._id, { name, phone }, auditMeta);

  return ApiResponse.success(res, 'Profile updated successfully.', updatedUser);
});
