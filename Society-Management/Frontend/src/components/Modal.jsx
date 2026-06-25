import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary-950/40 dark:bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="fixed inset-0 bg-transparent" 
        onClick={onClose} 
      />
      <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 w-full ${sizes[size]} relative flex flex-col max-h-[90vh] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] ring-1 ring-black/5 animate-modal-enter overflow-hidden`}>
        
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex flex-col gap-1">
            {title && <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">{title}</h3>}
            {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;

