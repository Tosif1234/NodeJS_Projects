import React, { createContext, useContext, useCallback } from 'react';
import Swal from 'sweetalert2';

const ToastContext = createContext(null);

// Pre-configured SweetAlert2 toast mixin
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  showCloseButton: true,
  customClass: {
    popup: 'swal-toast-popup',
    title: 'swal-toast-title',
    timerProgressBar: 'swal-toast-progress',
  },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

// SweetAlert2 confirm dialog helper
const confirmDialog = async ({
  title = 'Are you sure?',
  text = 'This action cannot be undone.',
  confirmButtonText = 'Yes, proceed',
  cancelButtonText = 'Cancel',
  icon = 'warning',
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: '#4f46e5',
    cancelButtonColor: '#64748b',
    confirmButtonText,
    cancelButtonText,
    customClass: {
      popup: 'swal-confirm-popup',
      title: 'swal-confirm-title',
      htmlContainer: 'swal-confirm-text',
    },
  });
  return result.isConfirmed;
};

export const ToastProvider = ({ children }) => {
  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const iconMap = {
      success: 'success',
      error: 'error',
      warning: 'warning',
      info: 'info',
    };

    Toast.fire({
      icon: iconMap[type] || 'success',
      title: message,
      timer: duration,
    });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, confirmDialog }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
