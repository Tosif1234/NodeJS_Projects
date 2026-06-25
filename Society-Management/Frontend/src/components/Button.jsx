import React from 'react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  icon,
  className = '',
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 gap-2 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap";
  
  const variants = {
    primary: "bg-accent-600 hover:bg-accent-700 active:bg-accent-800 active:scale-[0.97] text-white shadow-sm hover:shadow-md",
    secondary: "bg-white dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-slate-700 active:bg-primary-100 dark:active:bg-slate-600 active:scale-[0.97] text-primary-700 dark:text-slate-200 border border-primary-200 dark:border-slate-700 shadow-sm",
    outline: "bg-transparent border border-primary-200 dark:border-slate-700 hover:bg-primary-50 dark:hover:bg-slate-800 active:scale-[0.97] text-primary-600 dark:text-slate-300 hover:text-primary-800 dark:hover:text-slate-100",
    danger: "bg-red-600 hover:bg-red-700 active:bg-red-800 active:scale-[0.97] text-white shadow-sm hover:shadow-md",
    ghost: "bg-transparent hover:bg-primary-50 dark:hover:bg-slate-800 active:scale-[0.97] text-primary-500 dark:text-slate-400 hover:text-primary-700 dark:hover:text-slate-200",
    success: "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 active:scale-[0.97] text-white shadow-sm hover:shadow-md",
    accent: "bg-accent-50 dark:bg-accent-500/10 hover:bg-accent-100 dark:hover:bg-accent-500/20 active:scale-[0.97] text-accent-700 dark:text-accent-400 border border-accent-200 dark:border-accent-500/20",
  };

  const sizes = {
    xs: "px-2.5 py-1.5 text-xs",
    sm: "px-3.5 py-2 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const hasPadding = className.split(' ').some(c => c.startsWith('p-') || c.startsWith('px-') || c.startsWith('py-'));
  const sizeStyle = hasPadding ? "" : (sizes[size] || sizes.md);

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${sizeStyle} ${widthStyle} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-1"></span>
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
};

export default Button;
