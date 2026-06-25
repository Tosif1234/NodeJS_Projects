import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/Modal.jsx';
import Input from '../../components/Input.jsx';
import Select from '../../components/Select.jsx';
import Button from '../../components/Button.jsx';
import { useDispatch } from 'react-redux';
import { updateBooking, fetchAdminBookings } from '../../store/slices/bookingSlice.js';
import { useToast } from '../../contexts/ToastContext.jsx';

const EditBookingModal = ({ isOpen, onClose, booking }) => {
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
    if (isOpen && booking) {
      reset({
        facilityName: booking.facilityName || '',
        bookingDate: booking.bookingDate ? new Date(booking.bookingDate).toISOString().split('T')[0] : '',
        startTime: booking.startTime || '',
        endTime: booking.endTime || '',
        notes: booking.notes || '',
        status: booking.status || 'Pending',
      });
    }
  }, [isOpen, booking, reset]);

  const onSubmit = async (data) => {
    if (!booking) return;
    setLoading(true);

    try {
      const result = await dispatch(updateBooking({ id: booking._id, updateData: data }));
      if (updateBooking.fulfilled.match(result)) {
        showToast('Successfully updated facility booking!', 'success');
        dispatch(fetchAdminBookings({}));
        onClose();
      } else {
        showToast(result.payload || 'Failed to update booking', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Facility Booking"
      size="md"
    >
      <form id="edit-booking-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Select
          label="Facility"
          error={errors.facilityName?.message}
          {...register('facilityName', { required: 'Facility is required' })}
        >
          <option value="Clubhouse">Clubhouse</option>
          <option value="Swimming Pool">Swimming Pool</option>
          <option value="Tennis Court">Tennis Court</option>
          <option value="Community Hall">Community Hall</option>
          <option value="Gym">Gym</option>
        </Select>

        <Input
          label="Booking Date"
          type="date"
          error={errors.bookingDate?.message}
          {...register('bookingDate', { required: 'Date is required' })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Time"
            type="time"
            error={errors.startTime?.message}
            {...register('startTime', { required: 'Start time is required' })}
          />
          <Input
            label="End Time"
            type="time"
            error={errors.endTime?.message}
            {...register('endTime', { required: 'End time is required' })}
          />
        </div>

        <Select
          label="Status"
          error={errors.status?.message}
          {...register('status', { required: 'Status is required' })}
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Completed">Completed</option>
        </Select>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-primary-900 dark:text-slate-100">
            Notes (Optional)
          </label>
          <textarea
            className="w-full rounded-lg border border-primary-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-primary-900 dark:text-slate-100 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
            rows="3"
            {...register('notes')}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} form="edit-booking-form">
            Update Booking
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditBookingModal;
