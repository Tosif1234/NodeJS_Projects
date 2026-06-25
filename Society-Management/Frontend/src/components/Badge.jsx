import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const baseStyle = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border whitespace-nowrap";
  
  const variants = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    warning: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    error: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    info: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    accent: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
    primary: "bg-primary-100 text-primary-700 border-primary-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    gray: "bg-primary-100 text-primary-500 border-primary-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    default: "bg-primary-100 text-primary-600 border-primary-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
  };

  // Helper mapping to automatically style common statuses
  const getBadgeVariant = (text) => {
    if (!text || typeof text !== 'string') return variant;
    
    const term = text.toLowerCase().trim();
    if (['paid', 'approved', 'success', 'verified', 'resolved', 'active'].includes(term)) return 'success';
    if (['pending', 'pending approval', 'partially paid', 'warning', 'scheduled', 'assigned', 'in progress'].includes(term)) return 'warning';
    if (['rejected', 'overdue', 'failed', 'error', 'suspended', 'critical', 'high'].includes(term)) return 'error';
    if (['checked in', 'info'].includes(term)) return 'info';
    if (['checked out', 'closed', 'expired'].includes(term)) return 'gray';
    return variant !== 'default' ? variant : 'default';
  };

  const activeVariant = getBadgeVariant(children);

  return (
    <span className={`${baseStyle} ${variants[activeVariant] || variants.default} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
