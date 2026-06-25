import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import Card from '../../components/Card.jsx';
import Alert from '../../components/Alert.jsx';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import { User, Shield, Lock, Save, ShieldAlert } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext.jsx';
import authService from '../../services/authService.js';
import { updateUserProfile } from '../../store/slices/authSlice.js';

export const ProfileShared = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('profile');
  const [submittingPassword, setSubmittingPassword] = useState(false);
  const [submittingProfile, setSubmittingProfile] = useState(false);

  // Profile Edit Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    setValue,
  } = useForm();

  // Change Password Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm();
  
  const newPasswordValue = watchPassword('newPassword');

  // Pre-fill profile form
  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('phone', user.phone);
    }
  }, [user, setValue]);

  const onUpdateProfile = async (data) => {
    setSubmittingProfile(true);
    try {
      const result = await dispatch(updateUserProfile(data));
      if (updateUserProfile.fulfilled.match(result)) {
        showToast('Profile updated successfully!', 'success');
      } else {
        showToast(result.payload?.message || 'Failed to update profile', 'error');
      }
    } catch (err) {
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setSubmittingProfile(false);
    }
  };

  const onChangePassword = async (data) => {
    setSubmittingPassword(true);
    try {
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      showToast('Password changed successfully!', 'success');
      resetPassword();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to change password';
      showToast(msg, 'error');
    } finally {
      setSubmittingPassword(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-slide-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-primary-200 pb-6 mb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <User className="text-indigo-600 dark:text-indigo-400" size={28} />
            My Profile
          </h1>
          <p className="text-sm text-primary-500 dark:text-slate-400 mt-1">Manage your account details and security settings.</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center bg-slate-100/80 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-inner">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${activeTab === 'profile' ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-slate-200/50 dark:ring-slate-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'}`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${activeTab === 'security' ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-slate-200/50 dark:ring-slate-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'}`}
          >
            Change Password
          </button>
        </div>
      </div>

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in mt-2">
          {/* Edit Profile Form */}
          <Card className="p-8 bg-white dark:bg-slate-900 border-primary-200 dark:border-slate-800 shadow-sm w-full ring-1 ring-slate-100 dark:ring-slate-800">
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-5 ring-8 ring-indigo-50/50 dark:ring-indigo-900/20 shadow-sm">
                <User size={28} />
              </div>
              <h3 className="text-2xl font-bold text-primary-900 dark:text-slate-100 tracking-tight">Personal Details</h3>
              <p className="text-sm text-primary-500 dark:text-slate-400 mt-2 leading-relaxed">
                Update your name and contact number.
              </p>
            </div>
            
            <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="flex flex-col gap-5">
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                error={profileErrors.name?.message}
                {...registerProfile('name', { required: 'Name is required' })}
              />

              <Input
                label="Phone Number"
                type="text"
                placeholder="Enter your phone number"
                error={profileErrors.phone?.message}
                {...registerProfile('phone', { required: 'Phone number is required' })}
              />

              <div className="mt-4 pt-6 border-t border-primary-100 dark:border-slate-800">
                <Button
                  type="submit"
                  variant="primary"
                  loading={submittingProfile}
                  className="w-full py-2.5 text-[15px] shadow-sm flex items-center justify-center gap-2"
                >
                  <Save size={16} /> Save Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* User Account Info Sidebar */}
          <div className="flex flex-col gap-6">
            <Card className="p-0 overflow-hidden bg-white dark:bg-slate-900 border-primary-200 dark:border-slate-800 flex flex-col">
              <div className="p-5 border-b border-primary-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="text-base font-bold text-primary-900 dark:text-slate-100 flex items-center gap-2">
                  <Shield size={18} className="text-indigo-600 dark:text-indigo-400" /> Account Status
                </h3>
              </div>
              <div className="p-5 flex flex-col gap-5 text-sm">
                <div className="flex justify-between items-center pb-4 border-b border-primary-100/50 dark:border-slate-700/50">
                  <span className="text-primary-500 dark:text-slate-400 font-medium">Email Address</span>
                  <span className="text-primary-900 dark:text-slate-100 font-semibold">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-primary-100/50 dark:border-slate-700/50">
                  <span className="text-primary-500 dark:text-slate-400 font-medium">System Role</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">{user?.role}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-500 dark:text-slate-400 font-medium">Account Status</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">{user?.status}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in mt-2">
          {/* Change Password Form */}
          <Card className="p-8 bg-white dark:bg-slate-900 border-primary-200 dark:border-slate-800 shadow-sm w-full ring-1 ring-slate-100 dark:ring-slate-800">
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-5 ring-8 ring-indigo-50/50 dark:ring-indigo-900/20 shadow-sm">
                <Lock size={28} />
              </div>
              <h3 className="text-2xl font-bold text-primary-900 dark:text-slate-100 tracking-tight">Change Password</h3>
              <p className="text-sm text-primary-500 dark:text-slate-400 mt-2 leading-relaxed">
                Ensure your account is using a long, secure password.
              </p>
            </div>
            
            <form onSubmit={handleSubmitPassword(onChangePassword)} className="flex flex-col gap-5">
              <Input
                label="Current Password"
                type="password"
                placeholder="Enter your old password"
                error={passwordErrors.currentPassword?.message}
                {...registerPassword('currentPassword', { required: 'Current password is required' })}
              />

              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                error={passwordErrors.newPassword?.message}
                {...registerPassword('newPassword', { 
                  required: 'New password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />

              <Input
                label="Re-enter New Password"
                type="password"
                placeholder="Confirm new password"
                error={passwordErrors.confirmPassword?.message}
                {...registerPassword('confirmPassword', { 
                  required: 'Please confirm your new password',
                  validate: (value) => value === newPasswordValue || 'Passwords do not match'
                })}
              />

              <div className="mt-4 pt-6 border-t border-primary-100 dark:border-slate-800">
                <Button
                  type="submit"
                  variant="primary"
                  loading={submittingPassword}
                  className="w-full py-2.5 text-[15px] shadow-sm"
                >
                  Update Password
                </Button>
              </div>
            </form>
          </Card>

          {/* Security Guidelines Sidebar */}
          <div className="flex flex-col gap-6">
            <Card className="p-6 bg-slate-50 dark:bg-slate-800/50 border-primary-200 dark:border-slate-700 border-dashed">
              <h3 className="text-lg font-bold text-primary-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                <ShieldAlert size={18} className="text-indigo-600 dark:text-indigo-400" /> Password Requirements
              </h3>
              <ul className="space-y-3 text-sm text-primary-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5 font-bold">✓</span>
                  Must be at least 6 characters long.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5 font-bold">✓</span>
                  Should contain a mix of uppercase and lowercase letters.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5 font-bold">✓</span>
                  Should include numbers and special characters.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5 font-bold">✓</span>
                  Avoid using personal information like birthdays or names.
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/50">
              <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2 mb-2">
                <Shield size={18} className="text-indigo-600 dark:text-indigo-400" /> Keep your account safe
              </h3>
              <p className="text-sm text-indigo-700 dark:text-indigo-400/90 leading-relaxed">
                We strongly recommend updating your password every 3-6 months. Do not share your Smart Society credentials with anyone. If you suspect your account has been compromised, reset your password immediately from the login screen.
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileShared;
