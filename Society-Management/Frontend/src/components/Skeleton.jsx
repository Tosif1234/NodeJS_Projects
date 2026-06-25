import React from 'react';

export const Skeleton = ({
  variant = 'text',
  className = '',
  count = 1,
}) => {
  const baseClass = "bg-primary-200/60 dark:bg-slate-800 animate-pulse rounded-lg";
  
  const variants = {
    text: "h-4 w-full",
    rect: "h-32 w-full",
    circle: "h-12 w-12 rounded-full",
    card: "bg-white dark:bg-slate-900 h-40 w-full border border-primary-100 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-4 shadow-sm",
    table: "h-8 w-full"
  };

  const renderSingle = (key) => {
    if (variant === 'card') {
      return (
        <div key={key} className={`${variants.card} ${className}`}>
          <div className="h-4 w-1/3 bg-primary-200/60 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-8 w-full bg-primary-100 dark:bg-slate-700 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-primary-100 dark:bg-slate-700 rounded animate-pulse" />
        </div>
      );
    }
    return <div key={key} className={`${baseClass} ${variants[variant]} ${className}`} />;
  };

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => renderSingle(idx))}
    </>
  );
};

export default Skeleton;

