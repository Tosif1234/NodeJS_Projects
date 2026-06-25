import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/Modal.jsx';
import Input from '../../components/Input.jsx';
import Select from '../../components/Select.jsx';
import Button from '../../components/Button.jsx';
import { useDispatch } from 'react-redux';
import { updateComplaint, fetchAdminComplaints } from '../../store/slices/complaintSlice.js';
import { useToast } from '../../contexts/ToastContext.jsx';

const EditComplaintModal = ({ isOpen, onClose, complaint }) => {
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
    if (isOpen && complaint) {
      reset({
        title: complaint.title || '',
        description: complaint.description || '',
        category: complaint.category || '',
        priority: complaint.priority || '',
        status: complaint.status || 'Open',
      });
    }
  }, [isOpen, complaint, reset]);

  const onSubmit = async (data) => {
    if (!complaint) return;
    setLoading(true);

    try {
      const result = await dispatch(updateComplaint({ id: complaint._id, updateData: data }));
      if (updateComplaint.fulfilled.match(result)) {
        showToast('Successfully updated complaint!', 'success');
        dispatch(fetchAdminComplaints({ limit: 100 }));
        onClose();
      } else {
        showToast(result.payload || 'Failed to update complaint', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Complaint"
      size="md"
    >
      <form id="edit-complaint-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Title"
          type="text"
          error={errors.title?.message}
          {...register('title', { required: 'Title is required' })}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-primary-900 dark:text-slate-100">
            Description
          </label>
          <textarea
            className="w-full rounded-lg border border-primary-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-primary-900 dark:text-slate-100 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
            rows="4"
            {...register('description', { required: 'Description is required' })}
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Category"
            error={errors.category?.message}
            {...register('category', { required: 'Category is required' })}
          >
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Carpentry">Carpentry</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Security">Security</option>
            <option value="Other">Other</option>
          </Select>

          <Select
            label="Priority"
            error={errors.priority?.message}
            {...register('priority', { required: 'Priority is required' })}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </Select>
        </div>

        <Select
          label="Status"
          error={errors.status?.message}
          {...register('status', { required: 'Status is required' })}
        >
          <option value="Open">Open</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </Select>

        <div className="flex justify-end gap-3 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} form="edit-complaint-form">
            Update Complaint
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditComplaintModal;
