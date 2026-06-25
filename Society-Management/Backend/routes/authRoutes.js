import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  register,
  verifyEmail,
  login,
  refreshToken,
  logout,
  logoutAll,
  forgotPassword,
  verifyOtp,
  resetPassword,
  changePassword,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  registerValidator,
  loginValidator,
  verifyEmailValidator,
  forgotPasswordValidator,
  verifyOtpValidator,
  resetPasswordValidator,
} from '../validators/authValidator.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1' || process.env.NODE_ENV === 'test',
});

router.post('/register', authLimiter, registerValidator, register);
router.post('/login', authLimiter, loginValidator, login);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', authLimiter, forgotPasswordValidator, forgotPassword);
router.post('/verify-otp', authLimiter, verifyOtpValidator, verifyOtp);
router.post('/reset-password', authLimiter, resetPasswordValidator, resetPassword);
router.get('/verify-email', verifyEmailValidator, verifyEmail);

router.post('/logout', protect, logout);
router.post('/logout-all', protect, logoutAll);
router.post('/change-password', protect, changePassword); 
router.put('/profile', protect, updateProfile); 

export default router;
