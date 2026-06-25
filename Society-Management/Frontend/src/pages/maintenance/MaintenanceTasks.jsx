import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMaintenanceDashboard, updateComplaintStatus } from '../../store/slices/complaintSlice.js';
import Card from '../../components/Card.jsx';
import Table from '../../components/Table.jsx';
import Badge from '../../components/Badge.jsx';
import Button from '../../components/Button.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import Alert from '../../components/Alert.jsx';
import { ClipboardList, Play, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext.jsx';
import ComplaintCommentsModal from '../complaints/ComplaintCommentsModal.jsx';
import { io } from 'socket.io-client';

export const MaintenanceTasks = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { complaints, status, error } = useSelector((state) => state.complaint);

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    dispatch(fetchMaintenanceDashboard());

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socket.on('complaint_updated', (data) => {
      dispatch(fetchMaintenanceDashboard());
    });

    return () => socket.disconnect();
  }, [dispatch]);

  const currentComplaintInModal = selectedComplaint 
    ? complaints?.find(c => c._id === selectedComplaint._id) 
    : null;

  const handleStartWork = async (id) => {
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

  const handleResolveTicket = async (id) => {
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

  const columns = [
    {
      header: 'Task Title',
      key: 'title',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-primary-900 dark:text-slate-100 text-sm">{row.title}</span>
          <span className="text-xs text-primary-500 dark:text-slate-400">{row.description}</span>
        </div>
      ),
    },
    {
      header: 'Category & Location',
      key: 'category',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{val}</span>
          <span className="text-xs text-primary-500 dark:text-slate-400">Raised by Flat {row.raisedBy?.flatNumber || 'N/A'}</span>
        </div>
      ),
    },
    {
      header: 'Priority',
      key: 'priority',
      render: (val) => (
        <Badge variant={val === 'High' ? 'error' : val === 'Medium' ? 'warning' : 'success'}>
          {val}
        </Badge>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => {
        const variants = {
          Assigned: 'warning',
          'In Progress': 'primary',
          Resolved: 'success',
          Closed: 'gray',
        };
        return <Badge variant={variants[val] || 'gray'}>{val}</Badge>;
      },
    },
    {
      header: 'Discussion',
      key: 'comments',
      render: (val, row) => (
        <button 
          onClick={() => setSelectedComplaint(row)}
          className="text-xs text-primary-500 hover:text-primary-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 whitespace-nowrap cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-md transition-colors"
        >
          <MessageSquare size={13} /> {val?.length || 0} comments
        </button>
      ),
    },
    {
      header: 'Action',
      key: '_id',
      render: (val, row) => (
        <div className="flex gap-2">
          {row.status === 'Assigned' && (
            <Button size="xs" variant="accent" onClick={() => handleStartWork(row._id)} className="flex items-center gap-1 whitespace-nowrap">
              <Play size={11} /> Start Work
            </Button>
          )}
          {row.status === 'In Progress' && (
            <Button 
              size="xs" 
              onClick={() => handleResolveTicket(row._id)} 
              className="flex items-center gap-1.5 whitespace-nowrap bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md shadow-emerald-500/30 border border-emerald-400/50 transition-all hover:-translate-y-0.5"
            >
              <CheckCircle size={11} className="text-emerald-100" /> Mark Resolved
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (status === 'loading') {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton variant="text" className="h-8 w-1/4 bg-primary-50" />
        <Skeleton variant="card" className="h-96 bg-primary-50" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-primary-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <ClipboardList className="text-indigo-600 dark:text-indigo-500" size={24} />
          My Assigned Tasks
        </h1>
        <p className="text-sm text-primary-500 dark:text-slate-400">View and update repair jobs and log completion details for the residents.</p>
      </div>

      {error && (
        <Alert variant="error" title="API Fetch Error">
          {error}
        </Alert>
      )}

      <Card className="p-0 overflow-hidden bg-white dark:bg-slate-900 border-primary-200 dark:border-slate-800">
        <Table
          columns={columns}
          data={complaints || []}
          emptyMessage="No assigned maintenance tasks at the moment."
        />
      </Card>

      {selectedComplaint && (
        <ComplaintCommentsModal 
          isOpen={!!selectedComplaint} 
          onClose={() => setSelectedComplaint(null)} 
          complaint={currentComplaintInModal || selectedComplaint} 
        />
      )}
    </div>
  );
};

export default MaintenanceTasks;
