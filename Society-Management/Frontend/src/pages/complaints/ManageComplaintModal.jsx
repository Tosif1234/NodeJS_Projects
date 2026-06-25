import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/Modal.jsx';
import Select from '../../components/Select.jsx';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { assignComplaint, updateComplaintStatus, fetchMaintenanceStaff } from '../../store/slices/complaintSlice.js';
import { useToast } from '../../contexts/ToastContext.jsx';

// We now fetch actual maintenance staff from the backend

const ManageComplaintModal = ({ isOpen, onClose, complaint, mode }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const { maintenanceStaff } = useSelector(state => state.complaint);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isOpen && complaint) {
      if (mode === 'status') {
        reset({
          status: complaint.status,
          notes: '',
        });
      } else {
        reset({
          staffId: ''
        });
        if (maintenanceStaff.length === 0) {
          dispatch(fetchMaintenanceStaff());
        }
      }
    }
  }, [isOpen, complaint, mode, reset, dispatch, maintenanceStaff.length]);

  const onSubmit = async (data) => {
    if (!complaint) return;
    setLoading(true);

    try {
      if (mode === 'assign') {
        const result = await dispatch(assignComplaint({ id: complaint._id, staffId: data.staffId }));
        if (assignComplaint.fulfilled.match(result)) {
          showToast('Staff assigned successfully', 'success');
          onClose();
        } else {
          showToast(result.payload || 'Failed to assign staff', 'error');
        }
      } else if (mode === 'status') {
        const payload = { status: data.status, notes: data.notes };
        if (data.status === 'Resolved') {
          payload.completionNotes = data.notes;
        }
        const result = await dispatch(updateComplaintStatus({ id: complaint._id, data: payload }));
        if (updateComplaintStatus.fulfilled.match(result)) {
          showToast('Status updated successfully', 'success');
          onClose();
        } else {
          showToast(result.payload || 'Failed to update status', 'error');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const isAssignMode = mode === 'assign';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isAssignMode ? 'Assign Maintenance Staff' : 'Update Complaint Status'}
      size="sm"
    >
      {complaint && (
        <div className="mb-4 p-3 bg-primary-50 rounded-lg text-sm text-primary-700 flex flex-col gap-1">
          <p><span className="font-semibold">Title:</span> {complaint.title}</p>
          <p><span className="font-semibold">Current Status:</span> {complaint.status}</p>
        </div>
      )}

      <form id="manage-complaint-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {isAssignMode ? (
          <Select
            label="Assign To"
            error={errors.staffId?.message}
            {...register('staffId', { required: 'Please select a staff member' })}
          >
            <option value="">Select Staff Member</option>
            {maintenanceStaff.map(staff => (
              <option key={staff._id} value={staff._id}>{staff.name}</option>
            ))}
          </Select>
        ) : (
          <>
            <Select
              label="New Status"
              error={errors.status?.message}
              {...register('status', { required: 'Status is required' })}
            >
              <option value="Open">Open</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </Select>

            <Input
              label="Action Notes (Optional)"
              placeholder="Add notes about this update..."
              {...register('notes')}
            />
          </>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} form="manage-complaint-form">
            {isAssignMode ? 'Assign Staff' : 'Update Status'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ManageComplaintModal;
