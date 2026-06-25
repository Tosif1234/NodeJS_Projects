import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/Modal.jsx';
import Input from '../../components/Input.jsx';
import Select from '../../components/Select.jsx';
import Button from '../../components/Button.jsx';
import { useDispatch } from 'react-redux';
import { payInvoice, fetchResidentBills } from '../../store/slices/billingSlice.js';
import { useToast } from '../../contexts/ToastContext.jsx';

const ResidentPaymentModal = ({ isOpen, onClose, bill }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen && bill) {
      reset({
        paidAmount: bill.amount - (bill.paidAmount || 0),
        paymentMethod: 'UPI',
        transactionId: ''
      });
    }
  }, [isOpen, bill, reset]);

  const onSubmit = async (data) => {
    if (!bill) return;
    setLoading(true);

    try {
      const result = await dispatch(payInvoice({ id: bill._id, paymentData: data }));
      if (payInvoice.fulfilled.match(result)) {
        showToast('Successfully paid your maintenance bill!', 'success');
        dispatch(fetchResidentBills({})); // refresh resident bills
        onClose();
      } else {
        showToast(result.payload || 'Failed to record payment', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Payment"
      size="md"
    >
      {bill && (
        <div className="mb-4 p-3 bg-primary-50 dark:bg-slate-800 rounded-lg text-sm text-primary-700 dark:text-slate-300 flex flex-col gap-1">
          <p><span className="font-semibold">Invoice:</span> {bill.invoiceNumber}</p>
          <p><span className="font-semibold">Total Amount:</span> ${bill.amount.toFixed(2)}</p>
          <p><span className="font-semibold">Remaining Balance:</span> ${(bill.amount - (bill.paidAmount || 0)).toFixed(2)}</p>
        </div>
      )}

      <form id="payment-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Payment Amount ($)"
          type="number"
          step="0.01"
          error={errors.paidAmount?.message}
          {...register('paidAmount', { 
            required: 'Amount is required',
            valueAsNumber: true,
            min: { value: 1, message: 'Amount must be greater than 0' },
            max: { value: bill ? bill.amount - (bill.paidAmount || 0) : 99999, message: 'Cannot exceed remaining balance' }
          })}
        />

        <Select
          label="Payment Method"
          error={errors.paymentMethod?.message}
          {...register('paymentMethod', { required: 'Payment method is required' })}
        >
          <option value="Card">Card</option>
          <option value="UPI">UPI</option>
          <option value="Net Banking">Net Banking</option>
          <option value="Cash">Cash</option>
        </Select>

        <Input
          label="Transaction ID (Optional)"
          placeholder="Txn ID or Reference No."
          error={errors.transactionId?.message}
          {...register('transactionId')}
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} form="payment-form">
            Confirm Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ResidentPaymentModal;
