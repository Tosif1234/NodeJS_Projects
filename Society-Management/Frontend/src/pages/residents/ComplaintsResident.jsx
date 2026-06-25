import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { fetchResidentComplaints, createComplaint } from '../../store/slices/complaintSlice.js';
import Card from '../../components/Card.jsx';
import Table from '../../components/Table.jsx';
import Badge from '../../components/Badge.jsx';
import Button from '../../components/Button.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import Alert from '../../components/Alert.jsx';
import Modal from '../../components/Modal.jsx';
import Input from '../../components/Input.jsx';
import Select from '../../components/Select.jsx';
import { ClipboardList, PlusCircle, MessageSquare, AlertCircle, LayoutGrid, List as ListIcon, Filter, ChevronDown } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext.jsx';
import ComplaintCommentsModal from '../complaints/ComplaintCommentsModal.jsx';
import { io } from 'socket.io-client';

export const ComplaintsResident = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { complaints, status, error } = useSelector((state) => state.complaint);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: 'Plumbing',
      priority: 'Medium'
    }
  });

  useEffect(() => {
    dispatch(fetchResidentComplaints({}));

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socket.on('complaint_updated', (data) => {
      dispatch(fetchResidentComplaints({}));
      // We don't automatically update the selectedComplaint because Redux will update it 
      // when the fetch completes, or we could just let the user see it after the fetch.
      // But actually, the modal accesses the complaint from Redux if we pass the latest one, 
      // but `selectedComplaint` holds the stale object. Let's rely on finding it from the updated array if modal is open.
    });

    return () => socket.disconnect();
  }, [dispatch]);

  // Ensure modal gets the freshest data
  const currentComplaintInModal = selectedComplaint 
    ? complaints?.find(c => c._id === selectedComplaint._id) 
    : null;

  const onSubmitComplaint = async (data) => {
    setSubmitLoading(true);
    try {
      const result = await dispatch(createComplaint(data));
      if (createComplaint.fulfilled.match(result)) {
        showToast('Successfully filed a new maintenance ticket!');
        dispatch(fetchResidentComplaints({}));
        setIsModalOpen(false);
        reset();
      } else {
        showToast(result.payload || 'Failed to file ticket', 'error');
      }
    } catch (err) {
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const columns = [
    {
      header: 'Title / Subject',
      key: 'title',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-primary-900 dark:text-slate-100 text-sm">{row.title}</span>
          <span className="text-xs text-primary-500 dark:text-slate-400">{row.description}</span>
        </div>
      ),
    },
    {
      header: 'Category & Priority',
      key: 'category',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <span className="text-xs text-primary-600 dark:text-slate-300 bg-primary-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">{val}</span>
          <Badge variant={row.priority === 'High' || row.priority === 'Critical' ? 'error' : row.priority === 'Medium' ? 'warning' : 'success'}>
            {row.priority}
          </Badge>
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => {
        const variants = {
          Pending: 'warning',
          Assigned: 'accent',
          'In Progress': 'primary',
          Resolved: 'success',
          Closed: 'gray',
        };
        return <Badge variant={variants[val] || 'gray'}>{val}</Badge>;
      },
    },
    {
      header: 'Assigned Engineer',
      key: 'assignedTo.name',
      render: (val, row) => (
        <span className="text-xs text-primary-600 dark:text-slate-400">
          {row.assignedTo?.name ? `👷 ${row.assignedTo.name}` : 'Awaiting Assignment'}
        </span>
      ),
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
  ];

  if (status === 'loading') {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton variant="text" className="h-8 w-1/4 bg-primary-50 dark:bg-slate-800" />
        <Skeleton variant="card" className="h-96 bg-primary-50 dark:bg-slate-800" />
      </div>
    );
  }

  const filteredComplaints = (complaints || []).filter(complaint => {
    return statusFilter === 'All' || complaint.status === statusFilter;
  });

  return (
    <div className="flex flex-col gap-6 animate-slide-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-900 dark:text-white tracking-tight flex items-center gap-2">
            <ClipboardList className="text-indigo-600" size={24} />
            My Complaints History
          </h1>
          <p className="text-sm text-primary-500 dark:text-slate-400">File and track repair tickets and comment directly on issues.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 ring-1 ring-slate-200/50 dark:ring-slate-700' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              <ListIcon size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 ring-1 ring-slate-200/50 dark:ring-slate-700' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
          <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 shadow-sm font-medium px-4 py-[9px] text-[15px] rounded-xl">
            <PlusCircle size={16} /> Raise Issue
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4 mb-2">
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500/20 appearance-none text-slate-700 dark:text-slate-300 shadow-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
        </div>
      </div>

      {error && (
        <Alert variant="error" title="API Fetch Error">
          {error}
        </Alert>
      )}

      {viewMode === 'list' ? (
        <Card className="p-0 overflow-hidden bg-white dark:bg-slate-900 border-primary-200 dark:border-slate-800">
          <Table
            columns={columns}
            data={filteredComplaints}
            emptyMessage="No complaints match your current filters."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map((complaint) => (
              <Card key={complaint._id} className="p-5 border-slate-200 dark:border-slate-800 ring-1 ring-slate-100 dark:ring-slate-800/50 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">{complaint.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] uppercase font-bold text-primary-600 bg-primary-100 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded-md">{complaint.category}</span>
                    </div>
                  </div>
                  <Badge variant={complaint.status === 'Resolved' ? 'success' : complaint.status === 'Pending' ? 'warning' : complaint.status === 'In Progress' ? 'primary' : 'gray'}>
                    {complaint.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{complaint.description}</p>
                
                <div className="flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mt-auto">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-xs">Priority</span> 
                    <Badge variant={complaint.priority === 'High' || complaint.priority === 'Critical' ? 'error' : complaint.priority === 'Medium' ? 'warning' : 'success'}>
                      {complaint.priority}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-2">
                    <span className="text-xs">Assigned</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200 text-xs">
                      {complaint.assignedTo?.name ? complaint.assignedTo.name : 'Unassigned'}
                    </span>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl mb-4">
                  <ClipboardList size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No complaints found</h3>
                <p className="text-slate-500 mt-1 max-w-sm">No complaints match your current filters.</p>
              </Card>
            </div>
          )}
        </div>
      )}

      {selectedComplaint && (
        <ComplaintCommentsModal 
          isOpen={!!selectedComplaint} 
          onClose={() => setSelectedComplaint(null)} 
          complaint={currentComplaintInModal || selectedComplaint} 
        />
      )}

      {/* Raise Complaint Ticket Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Raise Maintenance Ticket"
        description="File a support ticket to alert building management of maintenance issues or complaints."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit(onSubmitComplaint)}
              disabled={submitLoading}
            >
              {submitLoading ? 'Filing Ticket...' : 'File Ticket'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmitComplaint)} className="flex flex-col gap-4">
          <Input
            label="Ticket Subject / Title"
            type="text"
            placeholder="e.g. Kitchen supply line leak"
            error={errors.title?.message}
            {...register('title', { required: 'Title is required' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Issue Category"
              options={[
                { value: 'Plumbing', label: 'Plumbing' },
                { value: 'Electrical', label: 'Electrical' },
                { value: 'Security', label: 'Security' },
                { value: 'Cleaning', label: 'Cleaning' },
                { value: 'Lift Maintenance', label: 'Lift Maintenance' },
                { value: 'Other', label: 'Other' },
              ]}
              {...register('category')}
            />

            <Select
              label="Priority Level"
              options={[
                { value: 'Low', label: 'Low' },
                { value: 'Medium', label: 'Medium' },
                { value: 'High', label: 'High' },
                { value: 'Critical', label: 'Critical' },
              ]}
              {...register('priority')}
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-primary-600 tracking-wide uppercase">
              Description of the Issue
            </label>
            <textarea
              className={`form-input min-h-[100px] resize-none ${
                errors.description ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/50' : ''
              }`}
              placeholder="Provide repair details (e.g. valve leakage in toilet near the main pipe connection)"
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && (
              <span className="text-xs text-red-600 font-medium mt-0.5">{errors.description.message}</span>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ComplaintsResident;


