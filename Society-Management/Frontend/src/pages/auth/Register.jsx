import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/slices/authSlice.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import { Building2 } from 'lucide-react';

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { loading, error: authError, validationErrors } = useSelector((state) => state.auth);
  
  const [pwdStrength, setPwdStrength] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const passwordValue = watch('password', '');

  const calculateStrength = (password) => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  React.useEffect(() => {
    setPwdStrength(calculateStrength(passwordValue));
  }, [passwordValue]);

  const onSubmit = async (data) => {
    const registrationData = { ...data, role: 'Resident' };
    const resultAction = await dispatch(registerUser(registrationData));
    if (registerUser.fulfilled.match(resultAction)) {
      showToast('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    } else {
      showToast(resultAction.payload?.message || 'Registration failed.', 'error');
    }
  };

  const getStrengthLabel = (score) => {
    if (score === 0) return { label: 'None', color: 'bg-primary-200' };
    if (score <= 2) return { label: 'Weak', color: 'bg-red-500' };
    if (score === 3 || score === 4) return { label: 'Strong', color: 'bg-amber-500' };
    return { label: 'Excellent', color: 'bg-emerald-500' };
  };

  const strengthDetails = getStrengthLabel(pwdStrength);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-primary-200 dark:border-slate-800 p-8 flex flex-col gap-6" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          
          

          {/* Logo */}
          <div className="flex items-center gap-3 justify-center">
            <div className="bg-accent-600 p-2.5 rounded-xl text-white shadow-md">
              <Building2 size={22} />
            </div>
            <span className="font-bold text-xl tracking-tight text-primary-900 dark:text-slate-100">Smart Society</span>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-primary-900 dark:text-slate-100 tracking-tight">Create Account</h1>
            <p className="text-primary-500 dark:text-slate-400 text-sm mt-1">Register as a resident to get started.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {authError && !validationErrors && (
              <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-medium">
                {authError}
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              placeholder="Jane Doe"
              error={errors.name?.message || validationErrors?.name}
              {...register('name', { required: 'Full name is required' })}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="jane@example.com"
              error={errors.email?.message || validationErrors?.email}
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email format',
                },
              })}
            />

            <Input
              label="Phone Number"
              type="text"
              placeholder="+15550199"
              error={errors.phone?.message || validationErrors?.phone}
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^\+?[1-9]\d{9,14}$/,
                  message: 'Enter a valid phone number (minimum 10 digits)',
                },
              })}
            />

            <div className="flex flex-col gap-1.5">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message || validationErrors?.password}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                })}
              />
              
              {passwordValue && (
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex justify-between items-center text-[10px] text-primary-500 dark:text-slate-400">
                    <span>Strength: <span className="font-bold text-primary-700">{strengthDetails.label}</span></span>
                  </div>
                  <div className="h-1.5 w-full bg-primary-100 rounded-full flex gap-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                          i < pwdStrength ? strengthDetails.color : 'bg-primary-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" loading={loading} fullWidth className="mt-1">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-primary-500 dark:text-slate-400 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-600 hover:text-accent-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
