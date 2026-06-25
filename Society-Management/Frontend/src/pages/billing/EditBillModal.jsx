import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/Modal.jsx';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import { useDispatch } from 'react-redux';
import { updateBill, fetchAdminBillingDashboard } from '../../store/slices/billingSlice.js';
import { useToast } from '../../contexts/ToastContext.jsx';

const EditBillModal = ({ isOpen, onClose, bill }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isOpen && bill) {
      reset({
        maintenanceCharges: bill.maintenanceCharges || 0,
        waterCharges: bill.waterCharges || 0,
        parkingCharges: bill.parkingCharges || 0,
        electricityCommonCharges: bill.electricityCommonCharges || 0,
        penalties: bill.penalties || 0,
        otherCharges: bill.otherCharges || 0,
        dueDate: bill.dueDate ? new Date(bill.dueDate).toISOString().split('T')[0] : ''
      });
    }
  }, [isOpen, bill, reset]);

  const onSubmit = async (data) => {
    if (!bill) return;
    setLoading(true);

    const updateData = {
      maintenanceCharges: parseFloat(data.maintenanceCharges),
      waterCharges: parseFloat(data.waterCharges),
      parkingCharges: parseFloat(data.parkingCharges),
      electricityCommonCharges: parseFloat(data.electricityCommonCharges),
      penalties: parseFloat(data.penalties),
      otherCharges: parseFloat(data.otherCharges),
      dueDate: new Date(data.dueDate)
    };

    try {
      const result = await dispatch(updateBill({ id: bill._id, updateData }));
      if (updateBill.fulfilled.match(result)) {
        showToast('Successfully updated bill!', 'success');
        dispatch(fetchAdminBillingDashboard({}));
        onClose();
      } else {
        showToast(result.payload || 'Failed to update bill', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Maintenance Bill"
      size="md"
    >
      {bill && (
        <div className="mb-4 p-3 bg-primary-50 rounded-lg text-sm text-primary-700 flex flex-col gap-1">
          <p><span className="font-semibold">Invoice:</span> {bill.invoiceNumber}</p>
          <p><span className="font-semibold">Resident:</span> {bill.resident?.name || 'Unknown'}</p>
          <p><span className="font-semibold">Month/Year:</span> {bill.month}/{bill.year}</p>
        </div>
      )}

      <form id="edit-bill-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Penalties ($)"
            type="number"
            step="0.01"
            error={errors.penalties?.message}
            {...register('penalties', { required: 'Required', min: 0 })}
          />
          <Input
            label="Other Charges ($)"
            type="number"
            step="0.01"
            error={errors.otherCharges?.message}
            {...register('otherCharges', { required: 'Required', min: 0 })}
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
          <Button type="submit" loading={loading} form="edit-bill-form">
            Update Bill
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditBillModal;
