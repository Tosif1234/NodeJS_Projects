import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import { Building2, Mail, ArrowLeft, AlertCircle } from 'lucide-react';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      await api.post('/auth/forgot-password', data);
      showToast('OTP sent! Check your email inbox.', 'success');
      navigate('/verify-otp', { state: { email: data.email } });
    } catch (err) {
      const msg = err.response?.data?.message || 'Request failed. Try again later.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

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
            <div className="w-7 h-7 rounded-full bg-accent-600 text-white text-xs font-bold flex items-center justify-center">1</div>
            <span className="text-xs font-semibold text-accent-600">Send OTP</span>
          </div>
          <div className="flex-1 h-px bg-primary-200 dark:bg-slate-800" />
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-slate-800 text-primary-400 dark:text-slate-500 text-xs font-bold flex items-center justify-center">2</div>
            <span className="text-xs text-primary-400 dark:text-slate-500">Verify OTP</span>
          </div>
          <div className="flex-1 h-px bg-primary-200 dark:bg-slate-800" />
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-slate-800 text-primary-400 dark:text-slate-500 text-xs font-bold flex items-center justify-center">3</div>
            <span className="text-xs text-primary-400 dark:text-slate-500">New Password</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-bold text-primary-900 dark:text-slate-100">Forgot your password?</h2>
          <p className="text-sm text-primary-500 dark:text-slate-400 leading-relaxed">
            Enter your registered email address. We'll send a <strong>6-digit OTP</strong> valid for <strong>2 minutes</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@society.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email address is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email format',
              },
            })}
          />

          {/* Inline server error — shown when email not found or any server error */}
          {serverError && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10">
              <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400 font-medium leading-snug">{serverError}</p>
            </div>
          )}

          <Button type="submit" loading={loading} fullWidth icon={<Mail size={16} />}>
            Send OTP to Email
          </Button>
        </form>

        <p className="text-center text-sm text-primary-500">
          <Link to="/login" className="text-accent-600 hover:text-accent-700 font-semibold inline-flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
