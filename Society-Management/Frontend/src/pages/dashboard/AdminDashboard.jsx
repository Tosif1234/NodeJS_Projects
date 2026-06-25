import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Users,
  AlertTriangle,
  DollarSign,
  CalendarCheck,
  ArrowUpRight,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import Card from '../../components/Card.jsx';
import Badge from '../../components/Badge.jsx';
import Table from '../../components/Table.jsx';
import Button from '../../components/Button.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import Alert from '../../components/Alert.jsx';

// Slices Thunks
import { fetchAdminBillingDashboard } from '../../store/slices/billingSlice.js';
import { fetchAdminAnalytics } from '../../store/slices/complaintSlice.js';
import { fetchAdminVisitorLogs } from '../../store/slices/visitorSlice.js';
import { fetchFacilityAnalytics } from '../../store/slices/bookingSlice.js';

// Color Palette
const COLORS = {
  accent: '#14b8a6', // teal-500
  primary: '#6366f1', // indigo-500
  success: '#10b981', // emerald-500
  warning: '#f59e0b', // amber-500
  error: '#ef4444', // red-500
  gray: '#64748b', // slate-500
  chartGrid: 'rgba(51, 65, 85, 0.3)',
};

const PIE_COLORS = [COLORS.primary, COLORS.accent, COLORS.success, COLORS.warning, COLORS.error];

export const AdminDashboard = () => {
  const dispatch = useDispatch();

  // Redux Selectors
  const billing = useSelector((state) => state.billing);
  const complaint = useSelector((state) => state.complaint);
  const visitor = useSelector((state) => state.visitor);
  const booking = useSelector((state) => state.booking);

  useEffect(() => {
    // Fetch live dashboard analytics from backend APIs
    dispatch(fetchAdminBillingDashboard({}));
    dispatch(fetchAdminAnalytics());
    dispatch(fetchAdminVisitorLogs({ limit: 100 }));
    dispatch(fetchFacilityAnalytics());
  }, [dispatch]);

  // Loading indicator checks
  const isLoading =
    billing.status === 'loading' ||
    complaint.status === 'loading' ||
    visitor.status === 'loading' ||
    booking.status === 'loading';

  // Error checks
  const hasError =
    billing.status === 'failed' ||
    complaint.status === 'failed' ||
    visitor.status === 'failed' ||
    booking.status === 'failed';

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <Skeleton variant="text" className="h-10 w-1/3 bg-primary-100 dark:bg-slate-800" />
        <Skeleton variant="text" className="h-4 w-1/2 bg-primary-50 dark:bg-slate-800/50" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <Skeleton variant="card" className="h-32 bg-primary-50 dark:bg-slate-800/50" />
          <Skeleton variant="card" className="h-32 bg-primary-50 dark:bg-slate-800/50" />
          <Skeleton variant="card" className="h-32 bg-primary-50 dark:bg-slate-800/50" />
          <Skeleton variant="card" className="h-32 bg-primary-50 dark:bg-slate-800/50" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton variant="card" className="h-80 bg-primary-50 dark:bg-slate-800/50" />
          <Skeleton variant="card" className="h-80 bg-primary-50 dark:bg-slate-800/50" />
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="max-w-md mx-auto py-12">
        <Alert variant="error" title="Backend Connection Failed">
          {billing.error || complaint.error || visitor.error || booking.error || 'Could not fetch admin statistics.'}
        </Alert>
      </div>
    );
  }

  // Live Aggregated Stats mapping
  const statsList = [
    {
      title: 'Total Billed Amount',
      value: `$${(billing.dashboardStats?.totalRevenue + billing.dashboardStats?.pendingAmount || 0).toLocaleString()}`,
      change: `Rate: ${Math.round(billing.dashboardStats?.collectionRate || 0)}%`,
      isIncrease: true,
      icon: <DollarSign className="text-emerald-600" size={20} />,
      description: 'Total society maintenance bills generated',
    },
    {
      title: 'Open Complaints',
      value: complaint.complaints?.filter((c) => c.status !== 'Resolved' && c.status !== 'Closed').length || 0,
      change: `${complaint.analytics?.resolutionStats?.overdueCount || 0} Overdue`,
      isIncrease: false,
      icon: <AlertTriangle className="text-rose-400" size={20} />,
      description: 'Utility & common maintenance tickets',
    },
    {
      title: 'Total Revenue Collected',
      value: `$${(billing.dashboardStats?.totalRevenue || 0).toLocaleString()}`,
      change: 'Paid Invoices',
      isIncrease: true,
      icon: <DollarSign className="text-accent-600" size={20} />,
      description: `Collected amount: $${(billing.dashboardStats?.totalRevenue || 0).toLocaleString()}`,
    },
    {
      title: 'Active Bookings',
      value: booking.bookings?.filter((b) => b.status === 'Approved').length || 0,
      change: 'Active slots',
      isIncrease: true,
      icon: <CalendarCheck className="text-amber-600" size={20} />,
      description: 'Amenity reservations approved today',
    },
  ];

  // Dynamic Chart compilations
  const compileRevenueTrends = () => {
    const trendsMap = {};
    billing.bills?.forEach((bill) => {
      const key = `${bill.year}-${String(bill.month).padStart(2, '0')}`;
      if (!trendsMap[key]) {
        trendsMap[key] = { month: `${bill.year}/${bill.month}`, collected: 0, target: 0 };
      }
      trendsMap[key].collected += bill.paidAmount || 0;
      trendsMap[key].target += bill.amount || 0;
    });
    return Object.keys(trendsMap)
      .sort()
      .map((k) => trendsMap[k]);
  };

  const compileVisitorTrends = () => {
    const trendsMap = {};
    visitor.logs?.forEach((log) => {
      const dateStr = new Date(log.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' });
      if (!trendsMap[dateStr]) {
        trendsMap[dateStr] = { date: dateStr, count: 0 };
      }
      trendsMap[dateStr].count += 1;
    });
    return Object.keys(trendsMap)
      .reverse() // Sort chronologically (logs fetched from API are desc)
      .map((k) => trendsMap[k]);
  };

  const revenueTrendsData = compileRevenueTrends();
  const visitorTrendsData = compileVisitorTrends();

  // Complaint trends by month
  const complaintTrendsData =
    complaint.analytics?.monthlyTrends?.map((trend) => ({
      month: `${trend._id.year}/${trend._id.month}`,
      tickets: trend.count,
    })) || [];

  // Facility usage analytics
  const facilityUsageData =
    booking.analytics?.facilityCounts?.map((f) => ({
      name: f._id,
      bookings: f.totalBookings,
    })) || [];

  // Visitor Type Distribution
  const visitorTypeData =
    visitor.logs?.reduce((acc, log) => {
      const existing = acc.find((e) => e.name === log.visitorType);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: log.visitorType, value: 1 });
      }
      return acc;
    }, []) || [];

  // Recent complaints table slice
  const recentComplaints = complaint.complaints?.slice(0, 5) || [];

  return (
    <div className="flex flex-col gap-8 animate-slide-in">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-primary-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary-900 dark:text-slate-100 font-sans">
            Admin Workspace
          </h1>
          <p className="text-primary-500 dark:text-slate-400 text-sm mt-1">
            Real-time society operations tracking and aggregated backend analytics.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsList.map((stat, index) => (
          <div
            key={index}
            className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-primary-500 dark:text-slate-400 uppercase tracking-wider">
                {stat.title}
              </span>
              <div className="bg-primary-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-primary-200/30 dark:border-slate-700/50">
                {stat.icon}
              </div>
            </div>
            
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-primary-900 dark:text-slate-100 font-sans tracking-tight">
                {stat.value}
              </span>
              <span
                className={`flex items-center text-xs font-bold ${
                  stat.isIncrease ? 'text-emerald-600' : 'text-primary-600'
                }`}
              >
                {stat.change}
              </span>
            </div>

            <p className="text-xs text-primary-500 dark:text-slate-400 font-medium">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Trend Chart */}
        <Card title="Revenue Trend Chart" subtitle="Live collections collected vs targeted target">
          {revenueTrendsData.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-xs text-primary-500 dark:text-slate-400">
              No billing data registered on the database.
            </div>
          ) : (
            <div className="h-80 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.chartGrid} />
                  <XAxis dataKey="month" stroke={COLORS.gray} fontSize={11} tickLine={false} />
                  <YAxis stroke={COLORS.gray} fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d16',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="collected" fill={COLORS.accent} radius={[4, 4, 0, 0]} name="Collected" />
                  <Bar dataKey="target" fill={COLORS.primary} radius={[4, 4, 0, 0]} name="Target" opacity={0.4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Complaint Trend Chart */}
        <Card title="Complaint Trend Chart" subtitle="Aggregated monthly registered tickets timeline">
          {complaintTrendsData.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-xs text-primary-500 dark:text-slate-400">
              No complaint tickets raised yet.
            </div>
          ) : (
            <div className="h-80 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={complaintTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.error} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={COLORS.error} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.chartGrid} />
                  <XAxis dataKey="month" stroke={COLORS.gray} fontSize={11} tickLine={false} />
                  <YAxis stroke={COLORS.gray} fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d16',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="tickets" stroke={COLORS.error} fillOpacity={1} fill="url(#colorTickets)" name="Tickets Raised" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

      </div>

      {/* Secondary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visitor Type Pie Breakdown */}
        <Card title="Visitor Types Chart" subtitle="Live visitor distribution Breakdown" className="lg:col-span-1">
          {visitorTypeData.length === 0 ? (
            <div className="h-60 flex items-center justify-center text-xs text-primary-500 dark:text-slate-400">
              No visitor logs registered.
            </div>
          ) : (
            <>
              <div className="h-60 w-full flex items-center justify-center mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={visitorTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {visitorTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#090d16',
                        borderColor: '#1e293b',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-primary-500 dark:text-slate-400 font-medium">
                {visitorTypeData.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                    <span className="truncate">{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        {/* Facility Usage Chart */}
        <Card title="Facility Usage Chart" subtitle="Aggregated bookings count per society amenity" className="lg:col-span-2">
          {facilityUsageData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-primary-500 dark:text-slate-400">
              No amenity reservations recorded on the database.
            </div>
          ) : (
            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={facilityUsageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.chartGrid} />
                  <XAxis dataKey="name" stroke={COLORS.gray} fontSize={11} tickLine={false} />
                  <YAxis stroke={COLORS.gray} fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d16',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="bookings" fill={COLORS.accent} radius={[4, 4, 0, 0]} name="Total Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

      </div>

      {/* Recent Complaints Table */}
      <Card title="Live Active Complaints" subtitle="Recent utility issue reports from residents">
        <div className="mt-2">
          <Table
            headers={['Ticket ID', 'Complaint Info', 'Resident', 'Category', 'Priority', 'Status']}
            rows={recentComplaints}
            emptyTitle="No Complaints Registered"
            emptyMessage="Excellent! No utility issues are currently flagged on the database."
            renderRow={(row) => (
              <tr key={row._id} className="hover:bg-white dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-bold text-accent-600 dark:text-accent-400">{row.title ? row._id.slice(-6).toUpperCase() : row._id}</td>
                <td className="px-6 py-4 font-medium text-primary-900 dark:text-slate-200">{row.title}</td>
                <td className="px-6 py-4 text-xs text-primary-500 dark:text-slate-400">{row.raisedBy?.name || 'Resident'}</td>
                <td className="px-6 py-4 text-xs text-slate-700 dark:text-slate-300">{row.category}</td>
                <td className="px-6 py-4">
                  <Badge>{row.priority}</Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge>{row.status}</Badge>
                </td>
              </tr>
            )}
          />
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
