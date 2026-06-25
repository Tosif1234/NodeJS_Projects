import React from 'react';

export const Avatar = ({
  src,
  name = '',
  size = 'md',
  status = null, // 'online' | 'offline' | 'busy'
  className = '',
}) => {
  const [imgError, setImgError] = React.useState(false);

  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
  };

  const getInitials = (n) => {
    if (!n) return '?';
    const parts = n.trim().split(' ').filter(Boolean);
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0]?.[0]?.toUpperCase() || '?';
  };

  const getStatusStyle = (s) => {
    switch (s) {
      case 'online':
        return 'bg-emerald-500';
      case 'offline':
        return 'bg-primary-600';
      case 'busy':
        return 'bg-red-500';
      default:
        return '';
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const imageSrc = src && !src.startsWith('http') 
    ? `http://localhost:5000/${src}` 
    : src;

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      {src && !imgError ? (
        <img
          src={imageSrc}
          alt={name || 'Avatar'}
          className={`${sizes[size]} rounded-full object-cover border border-primary-200 dark:border-slate-700`}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={`${sizes[size]} rounded-full bg-accent-100 dark:bg-slate-800 border border-accent-200 dark:border-slate-700 text-accent-700 dark:text-slate-300 flex items-center justify-center font-bold shadow-sm`}>
          {getInitials(name)}
        </div>
      )}
      
      {/* Optional Status dot */}
      {status && (
        <span className={`absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${getStatusStyle(status)}`} />
      )}
    </div>
  );
};

export default Avatar;

