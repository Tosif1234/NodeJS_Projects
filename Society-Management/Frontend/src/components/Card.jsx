import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  className = '',
  onClick,
  ...props
}) => {
  const isClickable = !!onClick;
  const clickableStyle = isClickable ? "cursor-pointer active:scale-[0.99]" : "";

  return (
    <div
      onClick={onClick}
      className={`glass-card p-6 flex flex-col gap-4 ${clickableStyle} ${className}`}
      {...props}
    >
      {/* Header */}
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between border-b border-primary-100 dark:border-slate-800 pb-3">
          <div className="flex flex-col min-w-0">
            {title && <h4 className="text-sm font-bold text-primary-900 dark:text-slate-100 tracking-wide truncate">{title}</h4>}
            {subtitle && <p className="text-xs text-primary-500 dark:text-slate-400 truncate mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}

      {/* Body */}
      <div className="flex-1 text-sm text-primary-600 dark:text-slate-300 leading-relaxed">
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="border-t border-primary-100 dark:border-slate-800 pt-3 flex items-center justify-end text-xs text-primary-500 dark:text-slate-400">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
