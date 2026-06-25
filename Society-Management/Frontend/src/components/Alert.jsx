import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export const Alert = ({
  children,
  title,
  variant = 'info',
  className = '',
}) => {
  const getIcon = (v) => {
    switch (v) {
      case 'success':
        return <CheckCircle className="text-emerald-600 shrink-0" size={18} />;
      case 'error':
        return <AlertCircle className="text-red-600 shrink-0" size={18} />;
      case 'warning':
        return <AlertTriangle className="text-amber-600 shrink-0" size={18} />;
      default:
        return <Info className="text-blue-600 shrink-0" size={18} />;
    }
  };

  const styles = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    error: 'border-red-200 bg-red-50 text-red-800 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
    warning: 'border-amber-200 bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    info: 'border-blue-200 bg-blue-50 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${styles[variant]} ${className}`}>
      {getIcon(variant)}
      <div className="flex flex-col gap-0.5 min-w-0">
        {title && <span className="font-bold text-sm tracking-wide">{title}</span>}
        <div className="text-xs leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  );
};

export default Alert;

