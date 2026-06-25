import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ allowedRoles = null }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const location = useLocation();
  const token = localStorage.getItem('accessToken');

  // If loading user details, show a premium loading skeleton or spinner
  if (loading) {
    return (
      <div className="min-height-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4 text-primary-200 dark:text-slate-600">
        <div className="w-12 h-12 rounded-full border-4 border-accent-500/20 border-t-accent-500 animate-spin"></div>
        <p className="font-medium animate-pulse text-sm">Authenticating session...</p>
      </div>
    );
  }

  // If not authenticated and not loading, redirect to login (meaning data fetch failed or no token)
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check guard
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized: render child routes
  return <Outlet />;
};

export default ProtectedRoute;

