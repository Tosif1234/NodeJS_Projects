import React from 'react';

export const Select = React.forwardRef(({
  label,
  error,
  options = [],
  placeholder,
  helperText,
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-primary-700 dark:text-slate-300 tracking-wide">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`form-input appearance-none bg-no-repeat ${
          error 
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' 
            : ''
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1.25rem'
        }}
        {...props}
      >
        {children || (
          <>
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </>
        )}
      </select>
      {error && (
        <span className="text-xs text-red-500 font-medium mt-0.5">{error}</span>
      )}
      {helperText && !error && (
        <span className="text-xs text-primary-500 dark:text-slate-400 mt-0.5">{helperText}</span>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;

