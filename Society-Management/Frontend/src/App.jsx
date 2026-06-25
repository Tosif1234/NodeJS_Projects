import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { localLogout } from './store/slices/authSlice.js';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import PageLoader from './components/PageLoader.jsx';

// Lazy-loaded Authentication Pages
const Login = lazy(() => import('./pages/auth/Login.jsx'));
const Register = lazy(() => import('./pages/auth/Register.jsx'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword.jsx'));
const VerifyOtp = lazy(() => import('./pages/auth/VerifyOtp.jsx'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword.jsx'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail.jsx'));

// Lazy-loaded Dashboard & Feed
const DashboardHome = lazy(() => import('./pages/dashboard/DashboardHome.jsx'));
const NotificationsFeed = lazy(() => import('./pages/dashboard/NotificationsFeed.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

const Unauthorized = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-4 bg-slate-50">
    <h1 className="text-4xl font-extrabold text-red-500">403</h1>
    <h2 className="text-xl font-bold text-primary-900">Unauthorized Access</h2>
    <p className="text-primary-600 max-w-md text-sm">You do not have permission to view this section of the portal.</p>
    <Link to="/dashboard" className="btn-primary mt-2">Back to Dashboard</Link>
  </div>
);

// Admin Sub-pages
const ResidentsList = lazy(() => import('./pages/residents/ResidentsList.jsx'));
const VisitorLogs = lazy(() => import('./pages/visitors/VisitorLogs.jsx'));
const Complaints = lazy(() => import('./pages/complaints/ComplaintsList.jsx'));
const BillingAdmin = lazy(() => import('./pages/billing/BillingAdmin.jsx'));
const FacilitiesAdmin = lazy(() => import('./pages/bookings/BookingsList.jsx'));
const NoticesAdmin = lazy(() => import('./pages/notices/NoticesList.jsx'));
const PollsAdmin = lazy(() => import('./pages/polls/PollsList.jsx'));

// Resident Sub-pages
const ProfileResident = lazy(() => import('./pages/residents/ProfileResident.jsx'));
const FamilyResident = lazy(() => import('./pages/residents/FamilyResident.jsx'));
const VehiclesResident = lazy(() => import('./pages/residents/VehiclesResident.jsx'));
const VisitorsResident = lazy(() => import('./pages/residents/VisitorsResident.jsx'));
const ComplaintsResident = lazy(() => import('./pages/residents/ComplaintsResident.jsx'));
const BillingResident = lazy(() => import('./pages/residents/BillingResident.jsx'));
const BookingsResident = lazy(() => import('./pages/residents/BookingsResident.jsx'));
const NoticesResident = lazy(() => import('./pages/residents/NoticesResident.jsx'));
const PollsResident = lazy(() => import('./pages/residents/PollsResident.jsx'));

// Security Sub-pages
const SecurityEntry = lazy(() => import('./pages/security/SecurityEntry.jsx'));
const SecurityActive = lazy(() => import('./pages/security/SecurityActive.jsx'));

// Maintenance Sub-pages
const MaintenanceTasks = lazy(() => import('./pages/maintenance/MaintenanceTasks.jsx'));

// Shared Sub-pages
const ProfileShared = lazy(() => import('./pages/shared/ProfileShared.jsx'));

const ProfileRouter = () => {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" />;
  return user.role === 'Resident' ? <ProfileResident /> : <ProfileShared />;
};

function App() {
  const dispatch = useDispatch();

  // Listen for global custom logout events (e.g. from axios 401 interceptor)
  useEffect(() => {
    const handleLogoutEvent = () => {
      dispatch(localLogout());
    };
    window.addEventListener('auth-logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('auth-logout', handleLogoutEvent);
    };
  }, [dispatch]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Shared Index Home */}
            <Route index element={<DashboardHome />} />
            <Route path="notifications" element={<NotificationsFeed />} />

            {/* Admin Role Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="residents" element={<ResidentsList />} />
              <Route path="visitors" element={<VisitorLogs />} />
              <Route path="complaints" element={<Complaints />} />
              <Route path="billing" element={<BillingAdmin />} />
              <Route path="facilities" element={<FacilitiesAdmin />} />
              <Route path="notices" element={<NoticesAdmin />} />
              <Route path="polls" element={<PollsAdmin />} />
            </Route>

            {/* Resident Role Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Resident']} />}>
              <Route path="resident/family" element={<FamilyResident />} />
              <Route path="resident/vehicles" element={<VehiclesResident />} />
              <Route path="resident/visitors" element={<VisitorsResident />} />
              <Route path="resident/complaints" element={<ComplaintsResident />} />
              <Route path="resident/billing" element={<BillingResident />} />
              <Route path="resident/bookings" element={<BookingsResident />} />
              <Route path="resident/notices" element={<NoticesResident />} />
              <Route path="resident/polls" element={<PollsResident />} />
            </Route>

            {/* Security Role Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Security Staff']} />}>
              <Route path="security/entry" element={<SecurityEntry />} />
              <Route path="security/active" element={<SecurityActive />} />
              <Route path="security/notices" element={<NoticesResident />} />
            </Route>

            {/* Maintenance Role Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Maintenance Staff']} />}>
              <Route path="maintenance/worklist" element={<MaintenanceTasks />} />
              <Route path="maintenance/notices" element={<NoticesResident />} />
            </Route>

            {/* Shared Profile for All Roles */}
            <Route element={<ProtectedRoute allowedRoles={['Admin', 'Resident', 'Security Staff', 'Maintenance Staff']} />}>
              <Route path="profile" element={<ProfileRouter />} />
            </Route>
          </Route>
        </Route>

        {/* Catch-all route to 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
