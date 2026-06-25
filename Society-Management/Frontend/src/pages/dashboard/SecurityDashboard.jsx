import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  Users,
  Clock,
  UserCheck,
  Plus,
  QrCode,
  LogOut,
  MapPin,
  Hash,
} from 'lucide-react';
import Card from '../../components/Card.jsx';
import Badge from '../../components/Badge.jsx';
import Input from '../../components/Input.jsx';
import Select from '../../components/Select.jsx';
import Button from '../../components/Button.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import Alert from '../../components/Alert.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';

// Thunks
import {
  fetchSecurityDashboard,
  registerVisitor,
  checkOutVisitor,
} from '../../store/slices/visitorSlice.js';

export const SecurityDashboard = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  
  // Selectors
  const { activeVisitors, securityStats, status, error } = useSelector((state) => state.visitor);
  
  const [passData, setPassData] = useState(null); // Generated pass popup state

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      visitorType: 'Guest',
      block: 'A',
      flatNumber: '',
      purpose: '',
      expectedDuration: '30 mins',
      vehicleNumber: '',
    }
  });

  useEffect(() => {
    dispatch(fetchSecurityDashboard());
  }, [dispatch]);

  const onSubmitEntry = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('phone', data.phone);
      formData.append('visitorType', data.visitorType);
      formData.append('flatNumber', data.flatNumber);
      formData.append('block', data.block);
      formData.append('purpose', data.purpose);
      formData.append('expectedDuration', data.expectedDuration);
      
      if (data.vehicleNumber) {
        formData.append('vehicleNumber', data.vehicleNumber);
      }

      const result = await dispatch(registerVisitor(formData)).unwrap();
      
      showToast(`Pass created for ${result.name}. Request sent to Resident.`);
      
      // Open pass preview
      setPassData(result);
      
      // Reset form
      reset();
      
      // Refresh dashboard stats
      dispatch(fetchSecurityDashboard());
    } catch (err) {
      showToast(err || 'Failed to register visitor entry.', 'error');
    }
  };

  const handleCheckOutAction = async (id, name) => {
    try {
      await dispatch(checkOutVisitor(id)).unwrap();
      showToast(`Visitor ${name} has checked out.`, 'info');
      // Refresh stats
      dispatch(fetchSecurityDashboard());
    } catch (err) {
      showToast(err || 'Check-out request failed.', 'error');
    }
  };

  const isLoading = status === 'loading' && activeVisitors.length === 0;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <Skeleton variant="text" className="h-10 w-1/3 bg-primary-100 dark:bg-slate-800" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Skeleton variant="card" className="h-28 bg-primary-50 dark:bg-slate-800/50" />
          <Skeleton variant="card" className="h-28 bg-primary-50 dark:bg-slate-800/50" />
          <Skeleton variant="card" className="h-28 bg-primary-50 dark:bg-slate-800/50" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <Skeleton variant="card" className="h-96 lg:col-span-2 bg-primary-50 dark:bg-slate-800/50" />
          <Skeleton variant="card" className="h-96 bg-primary-50 dark:bg-slate-800/50" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-slide-in">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-primary-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary-900 dark:text-slate-100 font-sans">
            Security Gatehouse
          </h1>
          <p className="text-primary-500 dark:text-slate-400 text-sm mt-1">
            Gate entry authorization log, resident requests, and visitor checkout tracker.
          </p>
        </div>
        <div className="bg-primary-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-primary-200 dark:border-slate-700 text-xs font-semibold text-primary-600 dark:text-slate-300 flex items-center gap-2 ">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Gate Server Online
        </div>
      </div>

      {/* Quick Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-primary-500 dark:text-slate-400 uppercase tracking-wider">Today's Entries</span>
            <span className="text-2xl font-extrabold text-primary-900 dark:text-slate-100">{securityStats?.todayCount || 0}</span>
          </div>
          <div className="bg-primary-50 dark:bg-slate-800 p-3 rounded-xl border border-primary-200/30 dark:border-slate-700 text-accent-600 dark:text-accent-400">
            <Users size={20} />
          </div>
        </div>
        <div className="glass-card p-6 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-primary-500 dark:text-slate-400 uppercase tracking-wider">Active Visitors</span>
            <span className="text-2xl font-extrabold text-primary-900 dark:text-slate-100">{securityStats?.activeCount || 0}</span>
          </div>
          <div className="bg-primary-50 dark:bg-slate-800 p-3 rounded-xl border border-primary-200/30 dark:border-slate-700 text-emerald-600 dark:text-emerald-400">
            <Clock size={20} />
          </div>
        </div>
        <div className="glass-card p-6 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-primary-500 dark:text-slate-400 uppercase tracking-wider">Pending Approvals</span>
            <span className="text-2xl font-extrabold text-primary-900 dark:text-slate-100">{securityStats?.pendingCount || 0}</span>
          </div>
          <div className="bg-primary-50 dark:bg-slate-800 p-3 rounded-xl border border-primary-200/30 dark:border-slate-700 text-amber-600 dark:text-amber-400">
            <UserCheck size={20} />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (New Visitor Entry Form) */}
        <div className="lg:col-span-1">
          <Card title="Register New Entry Pass" subtitle="Log visitor details to submit resident approval request">
            <form onSubmit={handleSubmit(onSubmitEntry)} className="flex flex-col gap-4 mt-3">
              <Input
                label="Visitor Full Name"
                type="text"
                placeholder="Name"
                error={errors.name?.message}
                {...register('name', { required: 'Visitor name is required' })}
              />

              <Input
                label="Phone Number"
                type="text"
                placeholder="+15550199"
                error={errors.phone?.message}
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: { value: /^\+?[1-9]\d{9,14}$/, message: 'Enter a valid phone number' }
                })}
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Type"
                  options={[
                    { value: 'Guest', label: 'Guest' },
                    { value: 'Delivery', label: 'Delivery' },
                    { value: 'Vendor', label: 'Vendor' },
                    { value: 'Maid', label: 'Maid' },
                    { value: 'Driver', label: 'Driver' },
                    { value: 'Other', label: 'Other' },
                  ]}
                  {...register('visitorType')}
                />
                
                <Select
                  label="Block"
                  options={[
                    { value: 'A', label: 'Block A' },
                    { value: 'B', label: 'Block B' },
                    { value: 'C', label: 'Block C' },
                    { value: 'D', label: 'Block D' },
                  ]}
                  {...register('block')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Flat Number"
                  type="text"
                  placeholder="102"
                  error={errors.flatNumber?.message}
                  {...register('flatNumber', { required: 'Flat number is required' })}
                />

                <Select
                  label="Expected Duration"
                  options={[
                    { value: '15 mins', label: '15 mins' },
                    { value: '30 mins', label: '30 mins' },
                    { value: '1 hour', label: '1 hour' },
                    { value: '3 hours', label: '3 hours' },
                    { value: 'Full Day', label: 'Full Day' },
                  ]}
                  {...register('expectedDuration')}
                />
              </div>

              <Input
                label="Purpose of Visit"
                type="text"
                placeholder="UPS Delivery, plumbing etc."
                error={errors.purpose?.message}
                {...register('purpose', { required: 'Purpose of visit is required' })}
              />

              <Input
                label="Vehicle Number (Optional)"
                type="text"
                placeholder="NY-9021-AX"
                {...register('vehicleNumber')}
              />

              <Button type="submit" fullWidth className="mt-2" icon={<Plus size={16} />} loading={status === 'loading'}>
                Submit Request
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Column (Active Queue List) */}
        <div className="lg:col-span-2 flex flex-col gap-6 min-w-0">
          
          <Card title="Active Visitors inside Society" subtitle="Currently checked-in visitors inside common areas">
              {activeVisitors?.length === 0 ? (
                <div className="py-8">
                  <EmptyState 
                    title="No Checked-In Visitors"
                    description="All visitors logged for today have exited. No active passes currently checked-in."
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-2">
                  {activeVisitors.map(row => (
                    <div key={row._id} className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-primary-900 dark:text-slate-100">{row.name}</span>
                          <span className="text-xs text-primary-500 dark:text-slate-400 mt-0.5">{row.phone}</span>
                        </div>
                        <Badge variant="primary">{row.visitorType}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <div className="flex items-center gap-2 text-primary-600 dark:text-slate-300">
                          <Hash size={14} className="text-primary-400" />
                          <span className="font-semibold text-accent-600 dark:text-accent-400">{row.uniqueVisitorId}</span>
                        </div>
                        <div className="flex items-center gap-2 text-primary-600 dark:text-slate-300">
                          <MapPin size={14} className="text-primary-400" />
                          <span className="font-medium">{row.block}-{row.flatNumber}</span>
                        </div>
                        <div className="flex items-center gap-2 text-primary-600 dark:text-slate-300 col-span-2">
                          <Clock size={14} className="text-primary-400" />
                          <span>In: {row.checkIn ? new Date(row.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          fullWidth
                          className="hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 dark:hover:border-rose-800"
                          onClick={() => handleCheckOutAction(row._id, row.name)}
                          icon={<LogOut size={14} />}
                        >
                          Check Out Visitor
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </Card>

          {/* Generated Pass Preview card details */}
          {passData && (
            <Card
              title="Recent Generated Pass Preview"
              subtitle="QR Gate pass issued details"
              headerAction={
                <Button variant="outline" size="xs" onClick={() => setPassData(null)}>
                  Clear
                </Button>
              }
            >
              <div className="p-6 rounded-xl border border-accent-500/20 bg-gray-50/60 dark:bg-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-6 mt-2 relative overflow-hidden">
                <div className="absolute -top-12 -left-12 w-28 h-28 rounded-full bg-accent-500/10 blur-2xl" />
                
                {/* Details */}
                <div className="flex flex-col gap-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-accent-600 dark:text-accent-400 tracking-wider uppercase">Gate Pass</span>
                    <Badge variant="success">{passData.status}</Badge>
                  </div>
                  <h4 className="text-base font-extrabold text-primary-900 dark:text-slate-100">{passData.name}</h4>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-primary-500 dark:text-slate-400 mt-2">
                    <span>Pass ID: <span className="font-semibold text-primary-900 dark:text-slate-100">{passData.uniqueVisitorId}</span></span>
                    <span>Type: <span className="font-semibold text-primary-900 dark:text-slate-100">{passData.visitorType}</span></span>
                    <span>Flat: <span className="font-semibold text-primary-900 dark:text-slate-100">{passData.block}-{passData.flatNumber}</span></span>
                    <span>Vehicle: <span className="font-semibold text-primary-900 dark:text-slate-100">{passData.vehicleNumber || 'None'}</span></span>
                    <span>Duration: <span className="font-semibold text-primary-900 dark:text-slate-100">{passData.expectedDuration}</span></span>
                  </div>
                </div>

                {/* QR Symbol */}
                <div className="shrink-0 flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl border border-primary-200 dark:border-slate-700">
                  <QrCode size={90} className="text-primary-950 dark:text-slate-100" />
                  <span className="text-[9px] font-bold text-primary-900 dark:text-slate-100 tracking-widest">{passData.uniqueVisitorId}</span>
                </div>
              </div>
            </Card>
          )}

        </div>

      </div>
    </div>
  );
};

export default SecurityDashboard;

