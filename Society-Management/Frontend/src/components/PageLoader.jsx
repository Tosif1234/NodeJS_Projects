import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PageLoader = ({ message = 'Loading workspace...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 dark:bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 max-w-sm w-full p-8 flex flex-col items-center justify-center gap-6 shadow-elevated rounded-2xl border border-primary-100 dark:border-slate-800 text-center animate-slide-in relative overflow-hidden">
        {/* Animated Icon and Spinners */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-primary-100 border-t-accent-500 animate-spin w-16 h-16" />
          <div className="bg-accent-50 dark:bg-slate-800 p-4 rounded-full border border-accent-100 dark:border-slate-700 text-accent-600 dark:text-accent-400 shadow-sm z-10">
            <ShieldCheck size={28} />
          </div>
        </div>

        {/* Loader message */}
        <div className="flex flex-col gap-1.5 z-10">
          <h3 className="font-extrabold text-primary-900 dark:text-slate-100 text-base tracking-wide font-sans">Smart Society</h3>
          <p className="text-primary-500 dark:text-slate-400 text-xs font-medium tracking-wide animate-pulse">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;

