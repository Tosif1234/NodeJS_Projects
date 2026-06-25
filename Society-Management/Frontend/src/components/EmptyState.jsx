import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  icon = <Inbox size={32} />,
  title = 'No records found',
  description = 'There are no items to display in this list at the moment.',
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center gap-4 border border-dashed border-primary-200 dark:border-slate-800 rounded-2xl bg-primary-50/50 dark:bg-slate-900/50 transition-colors duration-300 ${className}`}>
      <div className="bg-white dark:bg-slate-800 p-4 rounded-full text-primary-500 dark:text-slate-400 border border-primary-200 dark:border-slate-700 shadow-sm">
        {icon}
      </div>
      <div className="flex flex-col gap-1 max-w-sm">
        <h4 className="text-sm font-bold text-primary-800 dark:text-slate-200 tracking-wide">{title}</h4>
        <p className="text-xs text-primary-500 dark:text-slate-400 leading-relaxed">{description}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;

