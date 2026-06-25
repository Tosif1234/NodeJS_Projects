import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { registerVisitor } from '../../store/slices/visitorSlice.js';
import residentService from '../../services/residentService.js';
import Card from '../../components/Card.jsx';
import Input from '../../components/Input.jsx';
import Select from '../../components/Select.jsx';
import Button from '../../components/Button.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { UserPlus, QrCode } from 'lucide-react';

export const SecurityEntry = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [passData, setPassData] = useState(null);

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
      block: 'Block A',
      flatNumber: '',
      purpose: '',
      expectedDuration: '30 mins',
      vehicleNumber: '',
    }
  });

  const onSubmitEntry = async (data) => {
    try {
      // 1. Resolve host resident ID using block and flatNumber
      const residentRes = await residentService.listResidents({
        block: data.block,
        flatNumber: data.flatNumber
      });
      
      const profiles = residentRes?.data || [];
      if (profiles.length === 0) {
        showToast(`No resident registered at ${data.block}, Flat ${data.flatNumber}.`, 'error');
        return;
      }
      
      const hostProfile = profiles[0];
      const hostResidentId = hostProfile.user?._id || hostProfile.user?.id;
      if (!hostResidentId) {
        showToast('Found profile but user details are unavailable.', 'error');
        return;
      }

      // 2. Prepare multipart form data payload
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('phone', data.phone);
      formData.append('visitorType', data.visitorType);
      formData.append('flatNumber', data.flatNumber);
      formData.append('block', data.block);
      formData.append('purpose', data.purpose);
      formData.append('expectedDuration', data.expectedDuration);
      formData.append('hostResident', hostResidentId);
      if (data.vehicleNumber) {
        formData.append('vehicleNumber', data.vehicleNumber);
      }

      const result = await dispatch(registerVisitor(formData)).unwrap();
      showToast(`Pass created for ${result.name}. Request sent to Resident.`);
      setPassData(result);
      reset();
    } catch (err) {
      showToast(err || 'Failed to register visitor entry.', 'error');
    }
  };


  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-primary-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <UserPlus className="text-accent-600 dark:text-accent-500" size={24} />
          Register New Visitor
        </h1>
        <p className="text-sm text-primary-500 dark:text-slate-400">Log guest detail fields to request immediate resident entry clearance.</p>
      </div>

      <Card className="p-6 bg-white dark:bg-slate-900 border-primary-200 dark:border-slate-800">
        <form onSubmit={handleSubmit(onSubmitEntry)} className="flex flex-col gap-4">
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
            placeholder="+919999988888"
            error={errors.phone?.message}
            {...register('phone', { required: 'Phone number is required' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Visitor Type"
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
                { value: 'Block A', label: 'Block A' },
                { value: 'Block B', label: 'Block B' },
                { value: 'Block C', label: 'Block C' },
                { value: 'Block D', label: 'Block D' },
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
            placeholder="Delivery / Friend Visit / Plumbing repair"
            error={errors.purpose?.message}
            {...register('purpose', { required: 'Purpose is required' })}
          />

          <Input
            label="Vehicle Number (Optional)"
            type="text"
            placeholder="MH-12-AB-1234"
            {...register('vehicleNumber')}
          />

          <Button type="submit" className="mt-2">
            Generate Gate Pass & Notify Resident
          </Button>
        </form>
      </Card>

      {passData && (
        <Card className="p-6 border-accent-500/30 bg-accent-950/10 dark:bg-accent-500/10 flex flex-col items-center text-center gap-3 mt-4">
          <div className="bg-accent-600 p-2.5 rounded-full text-white">
            <QrCode size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary-900 dark:text-slate-100">Pass Generated Successfully!</h3>
            <p className="text-xs text-primary-500 dark:text-slate-400 mt-0.5">Share code with guest for scanning at exit</p>
          </div>
          <div className="font-mono text-xl font-extrabold text-accent-600 dark:text-accent-400 bg-primary-100 dark:bg-slate-800 border border-primary-200 dark:border-slate-700 px-6 py-2.5 rounded-xl tracking-wider select-all mt-2">
            {passData.uniqueVisitorId}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SecurityEntry;

