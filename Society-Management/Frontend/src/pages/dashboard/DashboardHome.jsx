import React from 'react';
import { useSelector } from 'react-redux';
import AdminDashboard from './AdminDashboard.jsx';
import ResidentDashboard from './ResidentDashboard.jsx';
import SecurityDashboard from './SecurityDashboard.jsx';
import MaintenanceDashboard from './MaintenanceDashboard.jsx';
import Alert from '../../components/Alert.jsx';
import Skeleton from '../../components/Skeleton.jsx';

export const DashboardHome = () => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <Skeleton variant="text" className="h-10 w-1/3 bg-primary-100 dark:bg-slate-800" />
        <Skeleton variant="text" className="h-4 w-1/2 bg-primary-50 dark:bg-slate-800/50" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <Skeleton variant="card" className="h-32 bg-primary-50 dark:bg-slate-800/50" />
          <Skeleton variant="card" className="h-32 bg-primary-50 dark:bg-slate-800/50" />
          <Skeleton variant="card" className="h-32 bg-primary-50 dark:bg-slate-800/50" />
          <Skeleton variant="card" className="h-32 bg-primary-50 dark:bg-slate-800/50" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <Skeleton variant="card" className="h-96 lg:col-span-2 bg-primary-50 dark:bg-slate-800/50" />
          <Skeleton variant="card" className="h-96 bg-primary-50 dark:bg-slate-800/50" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-12">
        <Alert variant="error" title="Session Lost">
          Could not find active user credentials. Please log out and sign in again.
        </Alert>
      </div>
    );
  }

  // Switch dashboards based on user role
  switch (user.role) {
    case 'Admin':
      return <AdminDashboard />;
    case 'Resident':
      return <ResidentDashboard />;
    case 'Security Staff':
      return <SecurityDashboard />;
    case 'Maintenance Staff':
      return <MaintenanceDashboard />;
    default:
      return (
        <div className="max-w-md mx-auto py-12">
          <Alert variant="error" title="Access Denied">
            Role "{user.role}" is not configured for a dashboard workflow.
          </Alert>
        </div>
      );
  }
};

export default DashboardHome;

