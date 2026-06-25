import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/Modal.jsx';
import Input from '../../components/Input.jsx';
import Select from '../../components/Select.jsx';
import Button from '../../components/Button.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { createNewBillsBulk, createNewBill, fetchAdminBillingDashboard } from '../../store/slices/billingSlice.js';
import { fetchResidentsList } from '../../store/slices/residentSlice.js';
import { useToast } from '../../contexts/ToastContext.jsx';

const GenerateBillsModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generationType, setGenerationType] = useState('bulk'); // 'bulk' or 'single'
  const { residentsList } = useSelector((state) => state.resident);

  React.useEffect(() => {
    if (isOpen) {
      dispatch(fetchResidentsList({ limit: 1000 }));
    }
  }, [isOpen, dispatch]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      maintenanceCharges: 100,
      waterCharges: 20,
      parkingCharges: 15,
      electricityCommonCharges: 25,
      dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
      resident: ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);

    if (generationType === 'single' && !data.resident) {
      showToast('Please select a resident for single bill generation', 'error');
      setLoading(false);
      return;
    }

    const bulkData = {
      ...data,
      month: parseInt(data.month),
      year: parseInt(data.year),
      maintenanceCharges: parseFloat(data.maintenanceCharges),
      waterCharges: parseFloat(data.waterCharges),
      parkingCharges: parseFloat(data.parkingCharges),
      electricityCommonCharges: parseFloat(data.electricityCommonCharges),
      dueDate: new Date(data.dueDate)
    };

    try {
      let result;
      if (generationType === 'bulk') {
        result = await dispatch(createNewBillsBulk(bulkData));
      } else {
        result = await dispatch(createNewBill({ ...bulkData, resident: data.resident }));
      }

      if (createNewBillsBulk.fulfilled.match(result) || createNewBill.fulfilled.match(result)) {
        showToast(`Successfully generated ${generationType === 'bulk' ? 'bulk bills' : 'single bill'}!`, 'success');
        dispatch(fetchAdminBillingDashboard({}));
        onClose();
        reset();
      } else {
        showToast(result.payload || `Failed to generate ${generationType} bills`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Maintenance Bills"
      size="md"
    >
      <div className="flex gap-4 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <button
          className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${generationType === 'bulk' ? 'bg-white dark:bg-slate-700 shadow text-primary-900 dark:text-slate-100' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          onClick={() => setGenerationType('bulk')}
        >
          Bulk Generate (All Residents)
        </button>
        <button
          className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${generationType === 'single' ? 'bg-white dark:bg-slate-700 shadow text-primary-900 dark:text-slate-100' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          onClick={() => setGenerationType('single')}
        >
          Single Resident
        </button>
      </div>

      <form id="generate-bills-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {generationType === 'single' && (
          <Select
            label="Select Resident"
            error={errors.resident?.message}
            {...register('resident', { required: generationType === 'single' ? 'Resident is required' : false })}
          >
            <option value="">-- Choose Resident --</option>
            {residentsList.map(r => (
              <option key={r.user?._id} value={r.user?._id}>
                {r.user?.name} (Flat: {r.flatNumber})
              </option>
            ))}
          </Select>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Month"
            error={errors.month?.message}
            {...register('month', { required: 'Month is required' })}
          >
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </Select>
          <Input
            label="Year"
            type="number"
            error={errors.year?.message}
            {...register('year', { required: 'Year is required', min: 2020 })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Maintenance Charges ($)"
            type="number"
            step="0.01"
            error={errors.maintenanceCharges?.message}
            {...register('maintenanceCharges', { required: 'Required', min: 0 })}
          />
          <Input
            label="Water Charges ($)"
            type="number"
            step="0.01"
            error={errors.waterCharges?.message}
            {...register('waterCharges', { required: 'Required', min: 0 })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Parking Charges ($)"
            type="number"
            step="0.01"
            error={errors.parkingCharges?.message}
            {...register('parkingCharges', { required: 'Required', min: 0 })}
          />
          <Input
            label="Common Electricity ($)"
            type="number"
            step="0.01"
            error={errors.electricityCommonCharges?.message}
            {...register('electricityCommonCharges', { required: 'Required', min: 0 })}
          />
        </div>

        <Input
          label="Due Date"
          type="date"
          error={errors.dueDate?.message}
          {...register('dueDate', { required: 'Due Date is required' })}
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} form="generate-bills-form">
            Generate Bills
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GenerateBillsModal;
