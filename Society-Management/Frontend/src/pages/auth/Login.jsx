import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/slices/authSlice.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import { Building2, ShieldCheck, Users, CreditCard, Bell } from 'lucide-react';

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { loading, error: authError, validationErrors } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const resultAction = await dispatch(loginUser(data));
    
    if (loginUser.fulfilled.match(resultAction)) {
      showToast('Logged in successfully! Welcome back.');
      navigate('/dashboard');
    } else {
      showToast(resultAction.payload?.message || 'Login failed. Please check credentials.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950">
      {/* Left Column: Form Section */}
      <div className="w-full lg:w-[480px] xl:w-[520px] flex flex-col justify-center px-8 md:px-14 py-12 border-r border-primary-100 dark:border-slate-800">
        <div className="max-w-sm w-full mx-auto flex flex-col gap-8">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-accent-600 p-2.5 rounded-xl text-white shadow-md">
              <Building2 size={22} />
            </div>
            <span className="font-bold text-xl tracking-tight text-primary-900 dark:text-slate-100">Smart Society</span>
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold text-primary-900 dark:text-slate-100 tracking-tight">Welcome back</h1>
            <p className="text-primary-500 dark:text-slate-400 text-sm leading-relaxed">Sign in to your account to manage bookings, pay bills, or check visitor logs.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {authError && !validationErrors && (
              <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-medium leading-relaxed">
                {authError}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="name@society.com"
              error={errors.email?.message || validationErrors?.email}
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email format',
                },
              })}
            />

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-primary-700 tracking-wide">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-accent-600 hover:text-accent-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                error={errors.password?.message || validationErrors?.password}
                {...register('password', { required: 'Password is required' })}
              />
            </div>

            <Button type="submit" loading={loading} fullWidth className="mt-1">
              Sign In
            </Button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-sm text-primary-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent-600 hover:text-accent-700 font-semibold">
              Register here
            </Link>
          </p>

        </div>
      </div>

      {/* Right Column: Premium Illustration Panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-accent-600 via-accent-700 to-indigo-900 flex-col justify-between p-12 relative overflow-hidden">
        
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 dark:bg-slate-950/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 dark:bg-slate-950/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-white/[0.03] dark:bg-slate-950/[0.03] rounded-full -translate-x-1/2 -translate-y-1/2" />

        {/* Top badge */}
        <div className="flex justify-end z-10">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-slate-950/10 text-white/95 border border-white/10">
            <ShieldCheck size={14} />
            <span>Trusted by 500+ Societies</span>
          </div>
        </div>

        {/* Center content */}
        <div className="flex flex-col items-center justify-center flex-1 z-10 gap-8">
          <div className="text-center max-w-md">
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
              Modern Society Management
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Streamline visitor management, billing, complaints, and community engagement all in one powerful platform.
            </p>
          </div>

          {/* Feature cards row */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
            <div className="bg-white/10 dark:bg-slate-950/10 rounded-2xl p-4 border border-white/10 text-center">
              <div className="bg-white/20 dark:bg-slate-950/20 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users size={20} className="text-white" />
              </div>
              <span className="text-white text-xs font-semibold">Visitor Pass</span>
              <p className="text-white/60 text-[10px] mt-1">QR-based entry</p>
            </div>
            <div className="bg-white/10 dark:bg-slate-950/10 rounded-2xl p-4 border border-white/10 text-center">
              <div className="bg-white/20 dark:bg-slate-950/20 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CreditCard size={20} className="text-white" />
              </div>
              <span className="text-white text-xs font-semibold">Auto Billing</span>
              <p className="text-white/60 text-[10px] mt-1">Monthly invoices</p>
            </div>
            <div className="bg-white/10 dark:bg-slate-950/10 rounded-2xl p-4 border border-white/10 text-center">
              <div className="bg-white/20 dark:bg-slate-950/20 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Bell size={20} className="text-white" />
              </div>
              <span className="text-white text-xs font-semibold">Notifications</span>
              <p className="text-white/60 text-[10px] mt-1">Real-time alerts</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
