import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/Modal.jsx';
import Input from '../../components/Input.jsx';
import Select from '../../components/Select.jsx';
import Button from '../../components/Button.jsx';
import { useDispatch } from 'react-redux';
import { registerVisitor, fetchAdminVisitorLogs } from '../../store/slices/visitorSlice.js';
import { useToast } from '../../contexts/ToastContext.jsx';

// Mock list of residents for the dropdown (in a real app, you'd fetch this from the API)
const MOCK_RESIDENTS = [
  { _id: '60d5ec49f1b2c42d88d2a1b1', name: 'John Doe (Flat 101)', flatNumber: '101' },
  { _id: '60d5ec49f1b2c42d88d2a1b2', name: 'Jane Smith (Flat 202)', flatNumber: '202' },
  { _id: '60d5ec49f1b2c42d88d2a1b3', name: 'Alice Johnson (Flat 305)', flatNumber: '305' },
];

const RegisterVisitorModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const result = await dispatch(registerVisitor(data));
      if (registerVisitor.fulfilled.match(result)) {
        showToast('Visitor registered successfully', 'success');
        dispatch(fetchAdminVisitorLogs({})); // Refresh list
        reset();
        onClose();
      } else {
        showToast(result.payload || 'Failed to register visitor', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register Gate Visitor"
      size="md"
    >
      <form id="register-visitor-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Visitor Name"
          placeholder="E.g. Michael Scott"
          error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />

        <Input
          label="Phone Number"
          placeholder="E.g. +1234567890"
          error={errors.phone?.message}
          {...register('phone', { required: 'Phone number is required' })}
        />

        <Select
          label="Visitor Type"
          error={errors.visitorType?.message}
          {...register('visitorType', { required: 'Visitor type is required' })}
        >
          <option value="">Select Type</option>
          <option value="Guest">Guest</option>
          <option value="Delivery">Delivery</option>
          <option value="Maid">Maid</option>
          <option value="Driver">Driver</option>
          <option value="Vendor">Vendor</option>
          <option value="Other">Other</option>
        </Select>

        <Select
          label="Host Resident"
          error={errors.hostResident?.message}
          {...register('hostResident', { required: 'Host resident is required' })}
        >
          <option value="">Select Resident</option>
          {MOCK_RESIDENTS.map(resident => (
            <option key={resident._id} value={resident._id}>{resident.name}</option>
          ))}
        </Select>

        <Input
          label="Purpose of Visit"
          placeholder="E.g. Package Delivery, Meeting"
          error={errors.purpose?.message}
          {...register('purpose', { required: 'Purpose is required' })}
        />

        <Input
          label="Vehicle Number (Optional)"
          placeholder="E.g. ABC 1234"
          {...register('vehicleNumber')}
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} form="register-visitor-form">
            Register Visitor
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RegisterVisitorModal;
