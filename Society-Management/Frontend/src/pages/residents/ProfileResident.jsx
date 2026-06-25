import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  fetchProfile,
  createProfile,
  addFamilyMember,
  removeFamilyMember,
  addVehicle,
  removeVehicle,
  updateProfile,
} from '../../store/slices/residentSlice.js';
import { updateUserProfile } from '../../store/slices/authSlice.js';
import Card from '../../components/Card.jsx';
import Badge from '../../components/Badge.jsx';
import Table from '../../components/Table.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import Alert from '../../components/Alert.jsx';
import Modal from '../../components/Modal.jsx';
import Input from '../../components/Input.jsx';
import Select from '../../components/Select.jsx';
import Button from '../../components/Button.jsx';
import { User, Home, Shield, Users, Car, Plus, Trash2, ShieldAlert, Lock } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext.jsx';
import authService from '../../services/authService.js';
import Swal from 'sweetalert2';

export const ProfileResident = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const { profile, status, error } = useSelector((state) => state.resident);

  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [submittingFamily, setSubmittingFamily] = useState(false);
  const [submittingVehicle, setSubmittingVehicle] = useState(false);
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [submittingUser, setSubmittingUser] = useState(false);
  const [submittingHousing, setSubmittingHousing] = useState(false);

  // Forms setup
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      block: 'A',
      flatNumber: '',
      floor: '',
      occupancyType: 'Owner',
    },
  });

  const {
    register: registerUserForm,
    handleSubmit: handleSubmitUser,
    reset: resetUser,
    formState: { errors: userErrors },
  } = useForm();

  const {
    register: registerHousing,
    handleSubmit: handleSubmitHousing,
    reset: resetHousing,
    formState: { errors: housingErrors },
  } = useForm();

  const {
    register: registerFamily,
    handleSubmit: handleSubmitFamily,
    reset: resetFamily,
    formState: { errors: familyErrors },
  } = useForm({
    defaultValues: {
      name: '',
      relation: 'Spouse',
      phone: '',
      isEmergencyContact: 'false',
    },
  });

  const {
    register: registerVehicle,
    handleSubmit: handleSubmitVehicle,
    reset: resetVehicle,
    formState: { errors: vehicleErrors },
  } = useForm({
    defaultValues: {
      vehicleType: 'Car',
      vehicleName: '',
      licensePlate: '',
    },
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [submittingPassword, setSubmittingPassword] = useState(false);

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm();
  
  const newPasswordValue = watchPassword('newPassword');

  // ... (useEffect and other functions remain identical, except we add onChangePassword)

  useEffect(() => {
    if (user) {
      dispatch(fetchProfile('me'));
      resetUser({ name: user.name, phone: user.phone });
    }
  }, [dispatch, user, resetUser]);

  useEffect(() => {
    if (profile) {
      resetHousing({
        block: profile.block || 'A',
        flatNumber: profile.flatNumber || '',
        floor: profile.floor || '',
        occupancyType: profile.occupancyType || 'Owner',
      });
    }
  }, [profile, resetHousing]);

  const onUpdateUser = async (data) => {
    setSubmittingUser(true);
    try {
      const result = await dispatch(updateUserProfile(data));
      if (updateUserProfile.fulfilled.match(result)) {
        showToast('Personal details updated successfully!', 'success');
      } else {
        showToast(result.payload?.message || 'Failed to update personal details', 'error');
      }
    } catch (err) {
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setSubmittingUser(false);
    }
  };

  const onUpdateHousing = async (data) => {
    setSubmittingHousing(true);
    try {
      const result = await dispatch(updateProfile({ id: 'me', formData: data }));
      if (updateProfile.fulfilled.match(result)) {
        showToast('Housing details updated successfully!', 'success');
      } else {
        showToast(result.payload || 'Failed to update housing details', 'error');
      }
    } catch (err) {
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setSubmittingHousing(false);
    }
  };

  const onCreateProfile = async (data) => {
    setSubmittingProfile(true);
    try {
      const payload = {
        ...data,
        userId: user._id || user.id,
      };
      const result = await dispatch(createProfile(payload));
      if (createProfile.fulfilled.match(result)) {
        showToast('Profile created successfully!', 'success');
      } else {
        showToast(result.payload || 'Failed to create profile', 'error');
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

  const onAddFamilyMember = async (data) => {
    setSubmittingFamily(true);
    const payload = {
      ...data,
      isEmergencyContact: data.isEmergencyContact === 'true',
    };
    try {
      const result = await dispatch(addFamilyMember({ id: 'me', data: payload }));
      if (addFamilyMember.fulfilled.match(result)) {
        showToast('Household member added successfully!');
        setIsFamilyModalOpen(false);
        resetFamily();
      } else {
        showToast(result.payload || 'Failed to add household member', 'error');
      }
    } catch (err) {
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setSubmittingFamily(false);
    }
  };

  const onAddVehicle = async (data) => {
    setSubmittingVehicle(true);
    try {
      const result = await dispatch(addVehicle({ id: 'me', data }));
      if (addVehicle.fulfilled.match(result)) {
        showToast('Vehicle registered successfully!');
        setIsVehicleModalOpen(false);
        resetVehicle();
      } else {
        showToast(result.payload || 'Failed to register vehicle', 'error');
      }
    } catch (err) {
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setSubmittingVehicle(false);
    }
  };

  const handleRemoveFamilyMember = async (familyId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to remove this household member?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, remove them!'
    });

    if (result.isConfirmed) {
      const actionResult = await dispatch(removeFamilyMember({ id: 'me', familyId }));
      if (removeFamilyMember.fulfilled.match(actionResult)) {
        showToast('Household member removed.');
      } else {
        showToast(actionResult.payload || 'Failed to remove member', 'error');
      }
    }
  };

  const handleRemoveVehicle = async (vehicleId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to remove this vehicle?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, remove it!'
    });

    if (result.isConfirmed) {
      const actionResult = await dispatch(removeVehicle({ id: 'me', vehicleId }));
      if (removeVehicle.fulfilled.match(actionResult)) {
        showToast('Vehicle removed.');
      } else {
        showToast(actionResult.payload || 'Failed to remove vehicle', 'error');
      }
    }
  };

  if (status === 'loading' && !profile) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <Skeleton variant="text" className="h-8 w-1/4 bg-primary-50 dark:bg-slate-800" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton variant="card" className="h-48 bg-primary-50 dark:bg-slate-800" />
          <Skeleton variant="card" className="h-48 bg-primary-50 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  // --- NO PROFILE YET -> SHOW ONBOARDING FORM ---
  if (status === 'succeeded' && !profile) {
    return (
      <div className="flex flex-col gap-6 animate-slide-in max-w-2xl mx-auto mt-6">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home size={32} />
          </div>
          <h1 className="text-2xl font-extrabold text-primary-900 dark:text-slate-100 tracking-tight">Complete Your Profile</h1>
          <p className="text-sm text-primary-500 dark:text-slate-400 mt-2">
            Welcome to Smart Society! Let's get your flat registered so you can start accessing society features.
          </p>
        </div>

        <Card className="p-8 bg-white dark:bg-slate-900 border-primary-200 dark:border-slate-800">
          <form onSubmit={handleSubmitProfile(onCreateProfile)} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Select
                label="Block / Tower"
                options={[
                  { value: 'A', label: 'Block A' },
                  { value: 'B', label: 'Block B' },
                  { value: 'C', label: 'Block C' },
                  { value: 'D', label: 'Block D' },
                ]}
                {...registerProfile('block')}
              />
              <Input
                label="Flat / House Number"
                type="text"
                placeholder="e.g. 101, 14A"
                error={profileErrors.flatNumber?.message}
                {...registerProfile('flatNumber', { required: 'Flat number is required' })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Floor"
                type="text"
                placeholder="e.g. 1st, Ground"
                {...registerProfile('floor')}
              />
              <Select
                label="Occupancy Type"
                options={[
                  { value: 'Owner', label: 'Owner (I own this flat)' },
                  { value: 'Tenant', label: 'Tenant (I am renting)' },
                ]}
                {...registerProfile('occupancyType')}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="mt-4"
              loading={submittingProfile}
            >
              Save Profile Details
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // --- REGULAR PROFILE VIEW ---
  return (
    <div className="flex flex-col gap-6 animate-slide-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-primary-200 pb-6 mb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <User className="text-indigo-600 dark:text-indigo-400" size={28} />
            My Profile
          </h1>
          <p className="text-sm text-primary-500 dark:text-slate-400 mt-1">Manage your housing details and account security.</p>
        </div>

        {/* Sleek Pill Toggle */}
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

      {error && (
        <Alert variant="error" title="API Fetch Error">
          {error}
        </Alert>
      )}

      {profile && activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in mt-2">
          {/* Edit Profile Form (Personal) */}
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
            
            <form onSubmit={handleSubmitUser(onUpdateUser)} className="flex flex-col gap-5">
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                error={userErrors.name?.message}
                {...registerUserForm('name', { required: 'Name is required' })}
              />

              <Input
                label="Phone Number"
                type="text"
                placeholder="Enter your phone number"
                error={userErrors.phone?.message}
                {...registerUserForm('phone', { required: 'Phone number is required' })}
              />

              <div className="mt-4 pt-6 border-t border-primary-100 dark:border-slate-800">
                <Button
                  type="submit"
                  variant="primary"
                  loading={submittingUser}
                  className="w-full py-2.5 text-[15px] shadow-sm flex items-center justify-center gap-2"
                >
                  Save Personal Details
                </Button>
              </div>
            </form>
          </Card>

          {/* Housing details (Read-Only) */}
          <Card className="p-0 overflow-hidden bg-white dark:bg-slate-900 border-primary-200 dark:border-slate-800 flex flex-col hover:border-primary-300 dark:hover:border-slate-700 transition-colors self-start">
            <div className="p-5 border-b border-primary-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-base font-bold text-primary-900 dark:text-slate-100 flex items-center gap-2">
                <Home size={18} className="text-indigo-600 dark:text-indigo-400" /> Housing Assignment
              </h3>
            </div>
            <div className="p-5 grid grid-cols-2 gap-y-6 gap-x-4 text-sm">
              <div className="flex flex-col">
                <span className="text-xs text-primary-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-1">Block Name</span>
                <span className="text-primary-900 dark:text-slate-100 font-semibold text-base">{profile.block}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-primary-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-1">Flat Number</span>
                <span className="text-primary-900 dark:text-slate-100 font-semibold text-base">{profile.flatNumber}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-primary-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-1">Occupancy</span>
                <Badge variant={profile.occupancyType === 'Owner' ? 'success' : 'accent'} className="w-max shadow-sm">
                  {profile.occupancyType}
                </Badge>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-primary-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-1">Status</span>
                <Badge variant="success" className="w-max shadow-sm">Verified</Badge>
              </div>
            </div>
          </Card>
        </div>
      )}

      {profile && activeTab === 'security' && (
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

export default ProfileResident;
