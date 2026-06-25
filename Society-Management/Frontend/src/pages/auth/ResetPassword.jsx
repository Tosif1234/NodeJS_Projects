import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import { Building2, KeyRound, CheckCircle2 } from 'lucide-react';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const verifiedToken = location.state?.verifiedToken;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Redirect if no verifiedToken in state (user skipped verify-otp step)
  useEffect(() => {
    if (!verifiedToken) {
      navigate('/forgot-password', { replace: true });
    }
  }, [verifiedToken, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        verifiedToken,
        password: data.password,
      });
      setSuccess(true);
      showToast('Password reset successful! You can now log in.', 'success');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      showToast(
        err.response?.data?.message || 'Password reset failed. Please start over.',
        'error'
      );
      // If verified token expired, send them back to forgot-password
      if (err.response?.status === 400) {
        setTimeout(() => navigate('/forgot-password'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-slate-950">
        <div
          className="bg-white dark:bg-slate-900 rounded-2xl border border-primary-200 dark:border-slate-800 max-w-md w-full p-10 flex flex-col items-center gap-5 text-center"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
        >
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 size={36} className="text-green-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary-900 dark:text-slate-100 mb-1">Password Updated!</h2>
            <p className="text-sm text-primary-500 dark:text-slate-400">Redirecting you to login...</p>
          </div>
          <div className="w-full h-1.5 rounded-full bg-primary-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-accent-600 rounded-full"
              style={{ animation: 'progress 2.5s linear forwards' }}
            />
          </div>
          <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-slate-950">
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl border border-primary-200 dark:border-slate-800 max-w-md w-full p-8 flex flex-col gap-6"
        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-accent-600 p-2.5 rounded-xl text-white shadow-md">
            <Building2 size={20} />
          </div>
          <span className="font-bold text-base tracking-tight text-primary-900 dark:text-slate-100">Smart Society</span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center">✓</div>
            <span className="text-xs font-semibold text-green-600 dark:text-green-500">Sent</span>
          </div>
          <div className="flex-1 h-px bg-green-400 dark:bg-green-500" />
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center">✓</div>
            <span className="text-xs font-semibold text-green-600 dark:text-green-500">Verified</span>
          </div>
          <div className="flex-1 h-px bg-accent-400" />
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-accent-600 text-white text-xs font-bold flex items-center justify-center">3</div>
            <span className="text-xs font-semibold text-accent-600">New Password</span>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <KeyRound size={20} className="text-accent-600" />
            <h2 className="text-xl font-bold text-primary-900 dark:text-slate-100">Set new password</h2>
          </div>
          <p className="text-sm text-primary-500 dark:text-slate-400 leading-relaxed">
            Choose a strong password. It must be at least 8 characters and include uppercase, lowercase, number, and symbol.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'New password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: 'Must include uppercase, lowercase, number & special character',
              },
            })}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === watch('password') || 'Passwords do not match',
            })}
          />

          <Button type="submit" loading={loading} fullWidth icon={<KeyRound size={16} />}>
            Reset Password
          </Button>
        </form>

        <p className="text-center text-sm text-primary-500">
          Remember your password?{' '}
          <Link to="/login" className="text-accent-600 hover:text-accent-700 font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
