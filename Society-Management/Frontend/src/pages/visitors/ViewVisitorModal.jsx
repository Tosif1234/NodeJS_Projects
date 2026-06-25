import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/Modal.jsx';
import Input from '../../components/Input.jsx';
import Select from '../../components/Select.jsx';
import Button from '../../components/Button.jsx';

const ViewVisitorModal = ({ isOpen, onClose, visitor }) => {
  const {
    register,
    reset,
  } = useForm();

  useEffect(() => {
    if (isOpen && visitor) {
      reset({
        name: visitor.name || '',
        phone: visitor.phone || '',
        visitorType: visitor.visitorType || '',
        purpose: visitor.purpose || '',
        hostResident: visitor.hostResident?.name || 'N/A',
        expectedDuration: visitor.expectedDuration || '',
        status: visitor.status || 'Pending'
      });
    }
  }, [isOpen, visitor, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="View Visitor Log"
      size="md"
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Visitor Name"
          type="text"
          disabled
          {...register('name')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            type="tel"
            disabled
            {...register('phone')}
          />
          <Input
            label="Visitor Type"
            type="text"
            disabled
            {...register('visitorType')}
          />
        </div>

        <Input
          label="Purpose of Visit"
          type="text"
          disabled
          {...register('purpose')}
        />

        <Input
          label="Host Resident"
          type="text"
          disabled
          {...register('hostResident')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Expected Duration (mins)"
            type="text"
            disabled
            {...register('expectedDuration')}
          />
          <Input
            label="Status"
            type="text"
            disabled
            {...register('status')}
          />
        </div>

        <div className="flex justify-end mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewVisitorModal;
