import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/Modal.jsx';
import Input from '../../components/Input.jsx';
import Select from '../../components/Select.jsx';
import Button from '../../components/Button.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { updateVisitor, fetchAdminVisitorLogs } from '../../store/slices/visitorSlice.js';
import { fetchResidentsList } from '../../store/slices/residentSlice.js';
import { useToast } from '../../contexts/ToastContext.jsx';

const EditVisitorModal = ({ isOpen, onClose, visitor }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const { residentsList } = useSelector((state) => state.resident);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchResidentsList({ limit: 1000 }));
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (isOpen && visitor) {
      reset({
        name: visitor.name || '',
        phone: visitor.phone || '',
        visitorType: visitor.visitorType || '',
        purpose: visitor.purpose || '',
        hostResident: visitor.hostResident?._id || visitor.hostResident || '',
        expectedDuration: visitor.expectedDuration || '',
        status: visitor.status || 'Pending'
      });
    }
  }, [isOpen, visitor, reset]);

  const onSubmit = async (data) => {
    if (!visitor) return;
    setLoading(true);

    try {
      const result = await dispatch(updateVisitor({ id: visitor._id, updateData: data }));
      if (updateVisitor.fulfilled.match(result)) {
        showToast('Successfully updated visitor log!', 'success');
        dispatch(fetchAdminVisitorLogs({}));
        onClose();
      } else {
        showToast(result.payload || 'Failed to update visitor', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Visitor Log"
      size="md"
    >
      <form id="edit-visitor-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Visitor Name"
          type="text"
          error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            type="tel"
            error={errors.phone?.message}
            {...register('phone', { required: 'Phone is required' })}
          />
          <Select
            label="Visitor Type"
            error={errors.visitorType?.message}
            {...register('visitorType', { required: 'Type is required' })}
          >
            <option value="Guest">Guest</option>
            <option value="Delivery">Delivery</option>
            <option value="Service">Service/Maintenance</option>
            <option value="Cab">Cab/Taxi</option>
            <option value="Other">Other</option>
          </Select>
        </div>

        <Input
          label="Purpose of Visit"
          type="text"
          error={errors.purpose?.message}
          {...register('purpose', { required: 'Purpose is required' })}
        />

        <Select
          label="Host Resident"
          error={errors.hostResident?.message}
          {...register('hostResident', { required: 'Host Resident is required' })}
        >
          <option value="">-- Choose Resident --</option>
          {residentsList.map(r => (
            <option key={r.user?._id} value={r.user?._id}>
              {r.user?.name} (Flat: {r.flatNumber})
            </option>
          ))}
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Expected Duration (mins)"
            type="number"
            error={errors.expectedDuration?.message}
            {...register('expectedDuration')}
          />
          <Select
            label="Status"
            error={errors.status?.message}
            {...register('status', { required: 'Status is required' })}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Checked In">Checked In</option>
            <option value="Checked Out">Checked Out</option>
          </Select>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} form="edit-visitor-form">
            Update Visitor
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditVisitorModal;
