import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Megaphone,
  CalendarCheck,
  ArrowRight,
  Clock,
  ShieldCheck,
  Ban,
  DollarSign,
  Plus,
} from 'lucide-react';
import Card from '../../components/Card.jsx';
import Badge from '../../components/Badge.jsx';
import Button from '../../components/Button.jsx';
import Avatar from '../../components/Avatar.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';

// Thunks
import { fetchProfile } from '../../store/slices/residentSlice.js';
import { fetchResidentBills, payInvoice } from '../../store/slices/billingSlice.js';
import { fetchResidentComplaints } from '../../store/slices/complaintSlice.js';
import { fetchResidentVisitors, updateVisitorStatus } from '../../store/slices/visitorSlice.js';
import { fetchNoticeFeed } from '../../store/slices/noticeSlice.js';
import { fetchResidentBookings } from '../../store/slices/bookingSlice.js';

export const ResidentDashboard = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  // Selectors
  const resident = useSelector((state) => state.resident);
  const billing = useSelector((state) => state.billing);
  const complaint = useSelector((state) => state.complaint);
  const visitor = useSelector((state) => state.visitor);
  const notice = useSelector((state) => state.notice);
  const booking = useSelector((state) => state.booking);

  useEffect(() => {
    // Dispatch initial fetch actions
    dispatch(fetchProfile('me'));
    dispatch(fetchResidentBills());
    dispatch(fetchResidentComplaints());
    dispatch(fetchResidentVisitors());
    dispatch(fetchNoticeFeed());
    dispatch(fetchResidentBookings());
  }, [dispatch]);

  const handleApproveVisitor = async (id, name) => {
    try {
      await dispatch(updateVisitorStatus({ id, status: 'Approved' })).unwrap();
      showToast(`Visitor request for ${name} has been approved.`);
    } catch (err) {
      showToast(err || 'Failed to approve visitor.', 'error');
    }
  };

  const handleRejectVisitor = async (id, name) => {
    try {
      await dispatch(updateVisitorStatus({ id, status: 'Rejected' })).unwrap();
      showToast(`Visitor request for ${name} has been declined.`, 'error');
    } catch (err) {
      showToast(err || 'Failed to reject visitor.', 'error');
    }
  };

  const handlePayBill = async (id, amount) => {
    try {
      // Mock payment details to satisfy validations
      const paymentData = {
        amountPaid: amount,
        paymentMethod: 'Card',
        transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      };
      await dispatch(payInvoice({ id, paymentData })).unwrap();
      showToast(`Payment of $${amount} completed successfully!`, 'success');
      // Re-fetch billing details to refresh totals
      dispatch(fetchResidentBills());
    } catch (err) {
      showToast(err || 'Payment transaction failed.', 'error');
    }
  };

  // Check loading states
  const isLoading =
    resident.status === 'loading' && !resident.profile;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <Skeleton variant="text" className="h-10 w-1/3 bg-primary-100 dark:bg-slate-800" />
        <Skeleton variant="text" className="h-4 w-1/2 bg-primary-50 dark:bg-slate-800/50" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <Skeleton variant="card" className="h-96 lg:col-span-2 bg-primary-50 dark:bg-slate-800/50" />
          <Skeleton variant="card" className="h-96 bg-primary-50 dark:bg-slate-800/50" />
        </div>
      </div>
    );
  }

  // Live collections mapping
  const pendingBills = billing.bills?.filter((b) => b.status !== 'Paid') || [];
  const activeComplaints = complaint.complaints?.filter((c) => c.status !== 'Resolved' && c.status !== 'Closed') || [];
  
  // Pending approvals at visitor gates
  const pendingVisitorApprovals = visitor.logs?.filter((v) => v.status === 'Pending') || [];
  
  // Upcoming bookings
  const upcomingBookings = booking.bookings?.filter((b) => b.status === 'Approved' || b.status === 'Pending') || [];

  return (
    <div className="flex flex-col gap-8 animate-slide-in">
      {/* Greetings & Info Card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-primary-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary-900 dark:text-white font-sans">
            Resident Hub
          </h1>
          <p className="text-primary-500 dark:text-slate-400 text-sm mt-1">
            Flat: <span className="font-semibold text-primary-900 dark:text-slate-200">{resident.profile?.block}-{resident.profile?.flatNumber || 'Not Assigned'}</span> • occupancy: <span className="font-semibold text-primary-900 dark:text-slate-200">{resident.profile?.residentType || 'Tenant'}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            Family Members ({resident.profile?.familyMembers?.length || 0})
          </Button>
          <Button variant="outline" size="sm">
            Vehicles ({resident.profile?.vehicles?.length || 0})
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2-Span on Desktop) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Visitor Approvals panel */}
          <Card title="Visitor Gate Approvals" subtitle="Live security gate entry authorization alerts">
            <div className="flex flex-col gap-4 mt-2">
              {pendingVisitorApprovals.length === 0 ? (
                <EmptyState
                  title="No Pending Visitors"
                  description="All entry requests are resolved. Security has not logged new arrivals for your flat."
                />
              ) : (
                pendingVisitorApprovals.map((req) => (
                  <div
                    key={req._id}
                    className="p-4 rounded-xl border border-primary-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-accent-500/20 dark:hover:border-accent-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={req.name} variant="indigo" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-primary-900 dark:text-slate-100">{req.name}</span>
                        <div className="flex items-center gap-2 text-xs text-primary-500 dark:text-slate-400 mt-1">
                          <Badge>{req.visitorType}</Badge>
                          <span>• Phone: {req.phone}</span>
                          <span>• Purpose: {req.purpose}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <Button
                        variant="danger"
                        size="xs"
                        onClick={() => handleRejectVisitor(req._id, req.name)}
                        icon={<Ban size={12} />}
                      >
                        Decline
                      </Button>
                      <Button
                        variant="primary"
                        size="xs"
                        onClick={() => handleApproveVisitor(req._id, req.name)}
                        icon={<ShieldCheck size={12} />}
                      >
                        Approve Entry
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Active Complaints Tracker */}
          <Card title="My Active Tickets" subtitle="Track progress of raised maintenance complaints">
            <div className="flex flex-col gap-4 mt-2">
              {activeComplaints.length === 0 ? (
                <EmptyState
                  title="No Active Complaints"
                  description="All raised tickets are resolved. Use 'New Complaint' if you have utility/plumbing issues."
                />
              ) : (
                activeComplaints.map((c) => (
                  <div
                    key={c._id}
                    className="p-4 rounded-xl border border-primary-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-accent-500/20 dark:hover:border-accent-500/30 transition-all flex justify-between items-center"
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-accent-600 dark:text-accent-400">#{c._id.slice(-6).toUpperCase()}</span>
                        <Badge>{c.priority}</Badge>
                      </div>
                      <h4 className="text-sm font-bold text-primary-900 dark:text-slate-100 truncate mt-1">{c.title}</h4>
                      <p className="text-xs text-primary-500 dark:text-slate-400 mt-0.5">Category: {c.category} • Current Stage: {c.status}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge>{c.status}</Badge>
                      <span className="text-xs text-primary-500 dark:text-slate-400 hover:text-primary-900 dark:hover:text-slate-200 cursor-pointer flex items-center gap-1 font-medium">
                        View Comments <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Notice Board Bulletin List */}
          <Card title="Recent Notices & Announcements" subtitle="Important news and updates from committee">
            <div className="flex flex-col gap-4 mt-2">
              {notice.feed?.length === 0 ? (
                <EmptyState
                  title="Notice Board Empty"
                  description="No active announcements have been published to your feed."
                />
              ) : (
                notice.feed?.slice(0, 3).map((n) => (
                  <div
                    key={n._id}
                    className="p-5 rounded-xl border border-primary-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Megaphone className="text-accent-600 dark:text-accent-400" size={16} />
                        <span className="text-sm font-bold text-primary-900 dark:text-slate-100">{n.title}</span>
                      </div>
                      <span className="text-[10px] text-primary-500 dark:text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-primary-600 dark:text-slate-300 leading-relaxed pl-6 mt-1">
                      {n.content}
                    </p>
                    <div className="flex pl-6 mt-2">
                      <Badge>{n.category}</Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

        </div>

        {/* Right Column (1-Span on Desktop) */}
        <div className="flex flex-col gap-8">
          
          {/* Pending Bills */}
          <Card title="Unpaid Invoices" subtitle="Maintenance and Water utility bills">
            <div className="flex flex-col gap-4 mt-2">
              {pendingBills.length === 0 ? (
                <EmptyState
                  title="No Pending Invoices"
                  description="Your invoices are fully paid. Thank you!"
                />
              ) : (
                pendingBills.map((bill) => (
                  <div
                    key={bill._id}
                    className="p-4 rounded-xl border border-primary-200 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-900/50 flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-primary-500 dark:text-slate-400">#{bill.invoiceNumber}</span>
                        <span className="text-sm font-bold text-primary-900 dark:text-slate-100 mt-1">Month: {bill.month}/{bill.year}</span>
                        <span className="text-xs text-primary-500 dark:text-slate-400 mt-0.5">Penalties: ${bill.penalties}</span>
                      </div>
                      <span className="text-lg font-extrabold text-primary-900 dark:text-slate-100">${bill.amount.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center border-t border-primary-200 dark:border-slate-800 pt-3">
                      <span className="text-[10px] text-primary-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock size={12} className={bill.status === 'Overdue' ? 'text-red-600 dark:text-red-400' : 'text-primary-500 dark:text-slate-400'} />
                        Due: {new Date(bill.dueDate).toLocaleDateString()}
                      </span>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handlePayBill(bill._id, bill.amount)}
                        icon={<DollarSign size={12} />}
                      >
                        Pay Invoice
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Upcoming Bookings */}
          <Card title="Upcoming Bookings" subtitle="Your active amenity booking slots">
            <div className="flex flex-col gap-4 mt-2">
              {upcomingBookings.length === 0 ? (
                <EmptyState
                  title="No Bookings Found"
                  description="You have no upcoming facility reservations."
                />
              ) : (
                upcomingBookings.map((b) => (
                  <div
                    key={b._id}
                    className="p-4 rounded-xl border border-primary-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-accent-500/20 dark:hover:border-accent-500/30 transition-all flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CalendarCheck size={16} className="text-accent-600 dark:text-accent-400" />
                        <span className="text-xs font-bold text-primary-900 dark:text-slate-100">{b.facilityName}</span>
                      </div>
                      <Badge>{b.status}</Badge>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-primary-500 dark:text-slate-400 mt-1 pl-6">
                      <span>Date: {new Date(b.bookingDate).toLocaleDateString()}</span>
                      <span>Time: {b.startTime} - {b.endTime}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
};

export default ResidentDashboard;

