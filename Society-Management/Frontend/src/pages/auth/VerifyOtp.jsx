import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../services/api.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import Button from '../../components/Button.jsx';
import { Building2, ShieldCheck, RefreshCw, ArrowLeft, Clock } from 'lucide-react';

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 120; // 2 minutes

export const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const email = location.state?.email;

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(OTP_EXPIRY_SECONDS);
  const [expired, setExpired] = useState(false);
  const [error, setError] = useState('');

  const inputRefs = useRef([]);

  // Redirect if no email in state
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password', { replace: true });
    }
  }, [email, navigate]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // 2-minute countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) {
      setExpired(true);
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setExpired(true);
          clearInterval(timer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleDigitChange = (index, value) => {
    // Accept only single digit
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setError('');

    // Auto-focus next input
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits filled
    if (digit && index === OTP_LENGTH - 1) {
      const allFilled = newDigits.every((d) => d !== '');
      if (allFilled) {
        handleVerify(newDigits.join(''));
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        // Clear current digit
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
      } else if (index > 0) {
        // Move focus to previous input and clear it
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newDigits = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((ch, i) => { newDigits[i] = ch; });
    setDigits(newDigits);
    setError('');
    // Focus last filled or next empty
    const lastIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[lastIdx]?.focus();
    if (pasted.length === OTP_LENGTH) {
      handleVerify(pasted);
    }
  };

  const handleVerify = useCallback(async (otpString) => {
    const otp = otpString || digits.join('');
    if (otp.length < OTP_LENGTH) {
      setError('Please enter all 6 digits.');
      return;
    }
    if (expired) {
      setError('OTP has expired. Please request a new one.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      const { verifiedToken } = res.data.data;
      showToast('OTP verified! Set your new password.', 'success');
      navigate('/reset-password', { state: { verifiedToken } });
    } catch (err) {
      const msg = err.response?.data?.message || 'OTP verification failed. Try again.';
      setError(msg);
      // If OTP expired on server, update UI
      if (msg.toLowerCase().includes('expired')) {
        setExpired(true);
        setSecondsLeft(0);
      }
      // Shake and clear digits on wrong OTP
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }, [digits, email, expired, navigate, showToast]);

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      showToast('New OTP sent! Check your email.', 'success');
      setDigits(Array(OTP_LENGTH).fill(''));
      setSecondsLeft(OTP_EXPIRY_SECONDS);
      setExpired(false);
      inputRefs.current[0]?.focus();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to resend OTP. Try again.', 'error');
    } finally {
      setResendLoading(false);
    }
  };

  const isTimerWarning = secondsLeft <= 30 && !expired;

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
          <div className="flex-1 h-px bg-accent-400" />
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-accent-600 text-white text-xs font-bold flex items-center justify-center">2</div>
            <span className="text-xs font-semibold text-accent-600">Verify OTP</span>
          </div>
          <div className="flex-1 h-px bg-primary-200 dark:bg-slate-800" />
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-slate-800 text-primary-400 dark:text-slate-500 text-xs font-bold flex items-center justify-center">3</div>
            <span className="text-xs text-primary-400 dark:text-slate-500">New Password</span>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-accent-600" />
            <h2 className="text-xl font-bold text-primary-900 dark:text-slate-100">Enter your OTP</h2>
          </div>
          <p className="text-sm text-primary-500 dark:text-slate-400 leading-relaxed">
            A 6-digit code was sent to{' '}
            <span className="font-semibold text-primary-800 dark:text-slate-200">{email}</span>
          </p>
        </div>

        {/* Timer */}
        <div
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold"
          style={{
            background: expired ? '#fef2f2' : isTimerWarning ? '#fff7ed' : '#f0fdf4',
            color: expired ? '#dc2626' : isTimerWarning ? '#ea580c' : '#16a34a',
            border: `1px solid ${expired ? '#fecaca' : isTimerWarning ? '#fed7aa' : '#bbf7d0'}`,
          }}
        >
          <Clock size={15} />
          {expired ? (
            <span>OTP Expired — Request a new one below</span>
          ) : (
            <span>Expires in <strong>{formatTime(secondsLeft)}</strong></span>
          )}
        </div>

        {/* 6-digit OTP input boxes */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 justify-center">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={expired || loading}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className={`w-12 h-14 text-center text-[22px] font-bold rounded-xl outline-none transition-all duration-150 caret-transparent ${
                  expired 
                    ? 'bg-slate-50 dark:bg-slate-800 border-2 border-red-200 dark:border-red-500/30 text-slate-800 dark:text-slate-400 cursor-not-allowed' 
                    : digit 
                      ? 'bg-accent-50 dark:bg-accent-500/10 border-2 border-accent-500 text-accent-900 dark:text-accent-300 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]' 
                      : error 
                        ? 'bg-white dark:bg-slate-900 border-2 border-red-300 dark:border-red-500/50 text-slate-900 dark:text-slate-100'
                        : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-accent-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]'
                }`}
              />
            ))}
          </div>

          {/* Error message */}
          {error && (
            <p className="text-center text-xs text-red-600 font-medium">{error}</p>
          )}

          <p className="text-center text-xs text-primary-400">
            Tip: You can paste your OTP directly into the first box
          </p>
        </div>

        {/* Verify Button */}
        {!expired && (
          <Button
            type="button"
            loading={loading}
            fullWidth
            onClick={() => handleVerify()}
            disabled={digits.join('').length < OTP_LENGTH}
          >
            Verify OTP
          </Button>
        )}

        {/* Resend OTP — shown when expired OR as secondary option */}
        <div className="flex flex-col gap-2">
          {expired && (
            <Button
              type="button"
              loading={resendLoading}
              fullWidth
              onClick={handleResend}
              icon={<RefreshCw size={15} />}
            >
              Send New OTP
            </Button>
          )}
          {!expired && (
            <p className="text-center text-xs text-primary-400">
              Didn't receive it?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="text-accent-600 font-semibold hover:underline disabled:opacity-50"
              >
                {resendLoading ? 'Sending...' : 'Resend OTP'}
              </button>
            </p>
          )}
        </div>

        <p className="text-center text-sm text-primary-500">
          <Link
            to="/forgot-password"
            className="text-accent-600 hover:text-accent-700 font-semibold inline-flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Back
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
