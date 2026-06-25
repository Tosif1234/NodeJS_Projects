import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ClipboardList,
  CheckCircle,
  Clock,
  Wrench,
  User,
  Play,
  Check,
} from 'lucide-react';
import Card from '../../components/Card.jsx';
import Badge from '../../components/Badge.jsx';
import Button from '../../components/Button.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';

// Thunks
import {
  fetchMaintenanceDashboard,
  updateComplaintStatus,
} from '../../store/slices/complaintSlice.js';

const INITIAL_CHORES = [
  { id: 'CHR-01', text: 'Daily pool chemical pH level audit', done: true },
  { id: 'CHR-02', text: 'Inspect main diesel generator fuel tank levels', done: false },
  { id: 'CHR-03', text: 'Replace corridors utility bulbs in Block D', done: false },
  { id: 'CHR-04', text: 'Test emergency fire escape exit door alarms', done: true },
];

export const MaintenanceDashboard = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  // Selectors
  const { complaints, status } = useSelector((state) => state.complaint);
  const [chores, setChores] = useState(INITIAL_CHORES);

  useEffect(() => {
    dispatch(fetchMaintenanceDashboard());
  }, [dispatch]);

  const handleStartWork = async (id, title) => {
    try {
      await dispatch(
        updateComplaintStatus({
          id,
          data: { status: 'In Progress', notes: 'Diagnosed issue. Starting maintenance repair work.' },
        })
      ).unwrap();
      showToast(`Work started on ticket #${id.slice(-6).toUpperCase()}`);
      dispatch(fetchMaintenanceDashboard());
    } catch (err) {
      showToast(err || 'Failed to update ticket status.', 'error');
    }
  };

  const handleResolveTicket = async (id, title) => {
    try {
      await dispatch(
        updateComplaintStatus({
          id,
          data: {
            status: 'Resolved',
            notes: 'Work completed successfully.',
            completionNotes: 'Replaced damaged parts and verified operations.',
          },
        })
      ).unwrap();
      showToast(`Ticket #${id.slice(-6).toUpperCase()} resolved! Logged completion notes.`, 'success');
      dispatch(fetchMaintenanceDashboard());
    } catch (err) {
      showToast(err || 'Failed to resolve ticket.', 'error');
    }
  };

  const toggleChore = (id, text, currentDone) => {
    setChores(chores.map(ch => ch.id === id ? { ...ch, done: !ch.done } : ch));
    showToast(`Task "${text}" marked as ${!currentDone ? 'completed' : 'pending'}.`);
  };

  const isLoading = status === 'loading' && complaints.length === 0;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <Skeleton variant="text" className="h-10 w-1/3 bg-primary-100 dark:bg-slate-800" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          <Skeleton variant="card" className="h-28 bg-primary-50 dark:bg-slate-800/50" />
          <Skeleton variant="card" className="h-28 bg-primary-50 dark:bg-slate-800/50" />
          <Skeleton variant="card" className="h-28 bg-primary-50 dark:bg-slate-800/50" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <Skeleton variant="card" className="h-96 lg:col-span-2 bg-primary-50 dark:bg-slate-800/50" />
          <Skeleton variant="card" className="h-96 bg-primary-50 dark:bg-slate-800/50" />
        </div>
      </div>
    );
  }

  const assignedTickets = complaints?.filter((c) => c.status === 'Assigned') || [];
  const inProgressTickets = complaints?.filter((c) => c.status === 'In Progress') || [];

  return (
    <div className="flex flex-col gap-8 animate-slide-in">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-primary-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary-900 dark:text-slate-100 font-sans">
            Maintenance Dashboard
          </h1>
          <p className="text-primary-500 dark:text-slate-400 text-sm mt-1">
            Resolve assigned utility repairs and track daily facilities maintenance logs.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-primary-200 dark:border-slate-700 text-xs font-semibold text-primary-600 dark:text-slate-300 ">
          <Wrench className="text-accent-600" size={14} />
          <span>Staff Shift Active</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-primary-500 dark:text-slate-400 uppercase tracking-wider">Assigned Tickets</span>
            <span className="text-2xl font-extrabold text-primary-900 dark:text-slate-100">
              {assignedTickets.length}
            </span>
          </div>
          <div className="bg-primary-50 dark:bg-slate-800 p-3 rounded-xl border border-primary-200/30 dark:border-slate-700 text-amber-600 dark:text-amber-400">
            <Clock size={20} />
          </div>
        </div>
        <div className="glass-card p-6 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-primary-500 dark:text-slate-400 uppercase tracking-wider">In Progress</span>
            <span className="text-2xl font-extrabold text-primary-900 dark:text-slate-100">
              {inProgressTickets.length}
            </span>
          </div>
          <div className="bg-primary-50 dark:bg-slate-800 p-3 rounded-xl border border-primary-200/30 dark:border-slate-700 text-accent-600 dark:text-accent-400">
            <Play size={20} />
          </div>
        </div>
        <div className="glass-card p-6 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-primary-500 dark:text-slate-400 uppercase tracking-wider">Resolved Work</span>
            <span className="text-2xl font-extrabold text-primary-900 dark:text-slate-100">12</span>
          </div>
          <div className="bg-primary-50 dark:bg-slate-800 p-3 rounded-xl border border-primary-200/30 dark:border-slate-700 text-emerald-600 dark:text-emerald-400">
            <CheckCircle size={20} />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Assigned tickets) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card title="My Assigned Complaints" subtitle="Utility issues requiring diagnostic attention and resolution">
            <div className="flex flex-col gap-6 mt-2">
              {complaints.length === 0 ? (
                <EmptyState
                  title="All Checked Up!"
                  description="No pending maintenance tickets are currently assigned to your queue."
                />
              ) : (
                complaints.map((ticket) => (
                  <div
                    key={ticket._id}
                    className="p-5 rounded-2xl border border-primary-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-4 hover:border-accent-500/20 transition-all relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-accent-600 dark:text-accent-400">#{ticket._id.slice(-6).toUpperCase()}</span>
                          <Badge>{ticket.priority}</Badge>
                          <Badge>{ticket.status}</Badge>
                        </div>
                        <h4 className="text-base font-bold text-primary-900 dark:text-slate-100 mt-1.5">{ticket.title}</h4>
                        <p className="text-xs text-primary-500 dark:text-slate-400">
                          Category: {ticket.category}
                        </p>
                      </div>
                      <span className="text-[10px] text-primary-500 dark:text-slate-400 font-medium shrink-0">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-primary-600 dark:text-slate-300 leading-relaxed bg-gray-50/40 dark:bg-slate-800 p-3 rounded-xl border border-primary-900/30 dark:border-slate-700/50">
                      {ticket.description}
                    </p>

                    <div className="flex justify-end gap-3 pt-2 border-t border-primary-200/20">
                      {ticket.status === 'Assigned' ? (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => handleStartWork(ticket._id, ticket.title)}
                          icon={<Play size={12} />}
                        >
                          Start Work
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="xs"
                          onClick={() => handleResolveTicket(ticket._id, ticket.title)}
                          icon={<Check size={12} />}
                        >
                          Mark as Resolved
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Column (Checklist) */}
        <div className="flex flex-col gap-8">
          
          <Card title="Utility Maintenance Checklist" subtitle="Daily society amenities chores checklist">
            <div className="flex flex-col gap-3 mt-3">
              {chores.map((chore) => (
                <div
                  key={chore.id}
                  onClick={() => toggleChore(chore.id, chore.text, chore.done)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    chore.done
                      ? 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-950/10 text-primary-500 dark:text-slate-400'
                      : 'border-primary-200 dark:border-slate-700 bg-gray-50/40 dark:bg-slate-800/50 text-primary-900 dark:text-slate-200 hover:border-primary-700 dark:hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                      chore.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-primary-400 dark:border-slate-600 bg-transparent'
                    }`}>
                      {chore.done && <Check size={10} />}
                    </div>
                    <span className="text-xs font-medium leading-tight">{chore.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="glass-card p-5 border border-primary-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-primary-900 dark:text-slate-100 uppercase tracking-wider">Need Assistance?</h4>
            <p className="text-xs text-primary-500 dark:text-slate-400 leading-relaxed">
              If an assigned issue requires external equipment hire or vendor assistance, contact the Administration office directly.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-accent-600 dark:text-accent-400 mt-1">
              <User size={14} />
              <span>Contact Admin Office</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default MaintenanceDashboard;

