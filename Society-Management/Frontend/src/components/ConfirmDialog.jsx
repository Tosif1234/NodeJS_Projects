import React from 'react';
import Modal from './Modal.jsx';
import Button from './Button.jsx';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone. Please confirm if you wish to proceed.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  variant = 'danger',
}) => {
  const footer = (
    <>
      <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
        {cancelText}
      </Button>
      <Button 
        variant={variant === 'danger' ? 'danger' : 'primary'} 
        size="sm" 
        onClick={onConfirm} 
        loading={loading}
      >
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer} size="sm">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl shrink-0 ${
          variant === 'danger' 
            ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20' 
            : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
        }`}>
          <AlertTriangle size={24} />
        </div>
        <div className="flex flex-col gap-1.5 min-w-0">
          <p className="text-sm text-primary-600 dark:text-slate-300 leading-relaxed mt-1">{message}</p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

