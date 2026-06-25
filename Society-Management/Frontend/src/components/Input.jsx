import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = React.forwardRef(({
  label,
  error,
  type = 'text',
  placeholder,
  helperText,
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-primary-700 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          className={`form-input pr-10 ${
            error 
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' 
              : ''
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-primary-500 hover:text-primary-600 p-1 rounded-lg focus:outline-none transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <span className="text-xs text-red-500 font-medium mt-0.5">{error}</span>
      )}
      {helperText && !error && (
        <span className="text-xs text-primary-500 mt-0.5">{helperText}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
