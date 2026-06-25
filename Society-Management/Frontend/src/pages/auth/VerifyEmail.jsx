import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api.js';
import { CheckCircle, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  useEffect(() => {
    const executeVerification = async () => {
      if (!email || !token) {
        setStatus('error');
        setErrorMessage('Verification parameters are missing. Please check your email link.');
        return;
      }

      try {
        await api.get(`/auth/verify-email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setErrorMessage(err.response?.data?.message || 'Verification failed. Token may have expired.');
      }
    };

    executeVerification();
  }, [email, token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-slate-950">
      <div className="glass-card max-w-md w-full p-8 flex flex-col gap-6 relative overflow-hidden text-center items-center">
        
        {/* Logo */}
        <div className="flex items-center gap-3 self-center mb-2">
          <div className="bg-accent-600 p-2.5 rounded-xl text-white shadow-md">
            <ShieldCheck size={20} />
          </div>
          <span className="font-extrabold text-base tracking-wider text-primary-900 dark:text-slate-100">Smart Society</span>
        </div>

        {status === 'verifying' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="animate-spin text-accent-600" size={36} />
            <h2 className="text-xl font-bold text-primary-900 dark:text-slate-100">Verifying Account</h2>
            <p className="text-xs text-primary-500 dark:text-slate-400 max-w-xs leading-relaxed">
              We are verifying your email verification token. This will only take a moment.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-full">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-primary-900 dark:text-slate-100">Verification Complete</h2>
            <p className="text-xs text-primary-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Your email address has been successfully verified. You can now log in to the portal.
            </p>
            <Link to="/login" className="btn-primary w-full mt-4">
              Proceed to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-full">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-primary-900 dark:text-slate-100">Verification Failed</h2>
            <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed max-w-xs">
              {errorMessage}
            </p>
            <div className="flex flex-col gap-2 w-full mt-4">
              <Link to="/register" className="btn-primary w-full">
                Register Again
              </Link>
              <Link to="/login" className="btn-secondary w-full">
                Back to Login
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;

