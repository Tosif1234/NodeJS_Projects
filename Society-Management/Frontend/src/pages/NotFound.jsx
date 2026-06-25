import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 text-primary-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <AlertTriangle size={48} />
      </div>
      <h1 className="text-7xl font-extrabold text-slate-800 dark:text-slate-100 mb-2 tracking-tight">
        404
      </h1>
      <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">
        Page Not Found
      </h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
        Oops! We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps the URL is incorrect.
      </p>
      <Link 
        to="/dashboard" 
        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
      >
        <Home size={18} />
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
