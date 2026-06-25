import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice.js';
import { fetchUnreadCount } from '../store/slices/notificationSlice.js';
import {
  LayoutDashboard,
  Moon,
  Sun,
  Users,
  FileText,
  UserCheck,
  ClipboardList,
  AlertTriangle,
  Megaphone,
  Vote,
  Bell,
  LogOut,
  Menu,
  X,
  CreditCard,
  User,
  ShieldCheck,
  CalendarCheck,
  Wrench,
  Building2
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext.jsx';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notification);
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0]?.[0]?.toUpperCase() || '';
  };

  useEffect(() => {
    if (user) {
      dispatch(fetchUnreadCount());
      const interval = setInterval(() => {
        dispatch(fetchUnreadCount());
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  // Build structured sidebar with section groups per role
  const getSidebarSections = (role) => {
    const sections = [];

    // -- Admin --
    if (role === 'Admin') {
      sections.push({
        label: 'Overview',
        items: [
          { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
          { to: '/dashboard/profile', icon: <User size={18} />, label: 'My Profile' },
        ]
      });
      sections.push({
        label: 'Management',
        items: [
          { to: '/dashboard/residents', icon: <Users size={18} />, label: 'Residents' },
          { to: '/dashboard/visitors', icon: <UserCheck size={18} />, label: 'Visitor Logs' },
          { to: '/dashboard/complaints', icon: <ClipboardList size={18} />, label: 'Complaints' },
        ]
      });
      sections.push({
        label: 'Finance',
        items: [
          { to: '/dashboard/billing', icon: <CreditCard size={18} />, label: 'Billing & Invoices' },
        ]
      });
      sections.push({
        label: 'Community',
        items: [
          { to: '/dashboard/facilities', icon: <CalendarCheck size={18} />, label: 'Facility Bookings' },
          { to: '/dashboard/notices', icon: <Megaphone size={18} />, label: 'Notice Board' },
          { to: '/dashboard/polls', icon: <Vote size={18} />, label: 'Polls & Voting' },
        ]
      });
    }

    // -- Resident --
    else if (role === 'Resident') {
      sections.push({
        label: 'Overview',
        items: [
          { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
          { to: '/dashboard/profile', icon: <User size={18} />, label: 'My Profile' },
        ]
      });
      sections.push({
        label: 'Services',
        items: [
          { to: '/dashboard/resident/visitors', icon: <UserCheck size={18} />, label: 'My Visitors' },
          { to: '/dashboard/resident/complaints', icon: <ClipboardList size={18} />, label: 'My Complaints' },
          { to: '/dashboard/resident/billing', icon: <CreditCard size={18} />, label: 'Pay Bills' },
          { to: '/dashboard/resident/bookings', icon: <CalendarCheck size={18} />, label: 'Book Facilities' },
        ]
      });
      sections.push({
        label: 'Community',
        items: [
          { to: '/dashboard/resident/notices', icon: <Megaphone size={18} />, label: 'Notice Board' },
          { to: '/dashboard/resident/polls', icon: <Vote size={18} />, label: 'Polls & Voting' },
        ]
      });
    }

    // -- Security Staff --
    else if (role === 'Security Staff') {
      sections.push({
        label: 'Overview',
        items: [
          { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
          { to: '/dashboard/profile', icon: <User size={18} />, label: 'My Profile' },
        ]
      });
      sections.push({
        label: 'Gate Management',
        items: [
          { to: '/dashboard/security/entry', icon: <UserCheck size={18} />, label: 'Visitor Entry' },
          { to: '/dashboard/security/active', icon: <ShieldCheck size={18} />, label: 'Active Visitors' },
        ]
      });
      sections.push({
        label: 'Info',
        items: [
          { to: '/dashboard/security/notices', icon: <Megaphone size={18} />, label: 'Notice Board' },
        ]
      });
    }

    // -- Maintenance Staff --
    else if (role === 'Maintenance Staff') {
      sections.push({
        label: 'Overview',
        items: [
          { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
          { to: '/dashboard/profile', icon: <User size={18} />, label: 'My Profile' },
        ]
      });
      sections.push({
        label: 'Work',
        items: [
          { to: '/dashboard/maintenance/worklist', icon: <Wrench size={18} />, label: 'Assigned Tasks' },
        ]
      });
      sections.push({
        label: 'Info',
        items: [
          { to: '/dashboard/maintenance/notices', icon: <Megaphone size={18} />, label: 'Notice Board' },
        ]
      });
    }

    return sections;
  };

  const renderNavLink = (item) => {
    const isActive = location.pathname === item.to;
    return (
      <Link
        key={item.to}
        to={item.to}
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-semibold ${
          isActive
            ? 'bg-accent-50/70 dark:bg-accent-500/10 text-accent-700 dark:text-accent-400 border-l-[3px] border-accent-600 pl-[9px]'
            : 'text-primary-600 dark:text-slate-400 hover:bg-primary-50/80 dark:hover:bg-slate-800 hover:text-primary-900 dark:text-slate-100 dark:hover:text-slate-200'
        }`}
      >
        <span className={isActive ? 'text-accent-600 dark:text-accent-500' : 'text-primary-400 dark:text-slate-500'}>{item.icon}</span>
        <span>{item.label}</span>
      </Link>
    );
  };

  const renderSidebar = () => {
    const sections = user ? getSidebarSections(user.role) : [];
    return (
      <>
        {sections.map((section, idx) => (
          <div key={idx} className="flex flex-col gap-0.5">
            <span className="px-3 pt-4 pb-1.5 text-[10px] font-bold text-primary-400 dark:text-slate-500 uppercase tracking-widest">
              {section.label}
            </span>
            {section.items.map(renderNavLink)}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-[260px] h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-primary-200 dark:border-slate-800 p-4 shrink-0 justify-between">
        <div className="flex flex-col min-h-0 flex-1">
          <div className="flex items-center gap-2.5 px-3 py-4 mb-2 shrink-0">
            <div className="bg-accent-600 p-2 rounded-xl text-white shadow-sm">
              <Building2 size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight text-primary-900 dark:text-slate-100">Smart Society</span>
          </div>
          <nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto pr-1">
            {renderSidebar()}
          </nav>
        </div>

        {/* User profile footer */}
        <div className="border-t border-primary-100 dark:border-slate-800 pt-4 flex flex-col gap-3 mt-4 shrink-0">
          <div className="flex items-center gap-3 px-3">
            <div className="w-10 h-10 rounded-full bg-accent-100 dark:bg-slate-800 text-accent-700 dark:text-slate-300 flex items-center justify-center font-bold text-sm border border-accent-200 dark:border-slate-700">
              {getInitials(user?.name)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-primary-900 dark:text-slate-100 truncate">{user?.name}</span>
              <span className="text-xs text-primary-500 dark:text-slate-500 truncate">{user?.role}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 font-medium text-sm"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile drawer overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-primary-900/20 dark:bg-slate-950/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile Drawer */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-[260px] bg-white dark:bg-slate-900 border-r border-primary-200 dark:border-slate-800 p-4 flex flex-col justify-between transition-transform duration-300 lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col min-h-0 flex-1">
          <div className="flex items-center justify-between px-3 py-4 mb-2 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="bg-accent-600 p-2 rounded-xl text-white shadow-sm">
                <Building2 size={20} />
              </div>
              <span className="font-bold text-lg text-primary-900 dark:text-slate-100">Smart Society</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-primary-400 dark:text-slate-400 hover:text-primary-700 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-primary-100 dark:hover:bg-slate-800">
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto pr-1">
            {renderSidebar()}
          </nav>
        </div>

        <div className="border-t border-primary-100 dark:border-slate-800 pt-4 flex flex-col gap-3 mt-4 shrink-0">
          <div className="flex items-center gap-3 px-3">
            <div className="w-10 h-10 rounded-full bg-accent-100 dark:bg-slate-800 text-accent-700 dark:text-slate-300 flex items-center justify-center font-bold text-sm border border-accent-200 dark:border-slate-700">
              {getInitials(user?.name)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-primary-900 dark:text-slate-100 truncate">{user?.name}</span>
              <span className="text-xs text-primary-500 dark:text-slate-500 truncate">{user?.role}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 font-medium text-sm"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header bar */}
        <header className="h-16 border-b border-primary-200/80 dark:border-slate-800 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-primary-500 dark:text-slate-500 hover:text-primary-800 dark:hover:text-slate-300 p-1.5 rounded-lg hover:bg-primary-100 dark:hover:bg-slate-800"
            >
              <Menu size={20} />
            </button>
            <span className="font-medium text-primary-600 dark:text-slate-400 text-sm hidden sm:inline-block">Welcome back, <span className="text-primary-900 dark:text-slate-100 font-semibold">{user?.name}</span></span>
          </div>

          <div className="flex items-center gap-3">
            
            <button
              onClick={toggleTheme}
              className="p-2 text-primary-400 dark:text-slate-400 hover:text-primary-700 dark:hover:text-slate-200 hover:bg-primary-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 mr-2"
              title="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {/* Quick notifications feed link */}
            <Link to="/dashboard/notifications" className="relative p-2 text-primary-400 dark:text-slate-400 hover:text-primary-700 dark:hover:text-slate-300 hover:bg-primary-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Content body outlet */}
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>

  );
};

export default DashboardLayout;
