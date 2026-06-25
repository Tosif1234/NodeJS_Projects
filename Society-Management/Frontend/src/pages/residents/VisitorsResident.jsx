import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { fetchResidentVisitors, updateVisitorStatus, registerVisitor } from '../../store/slices/visitorSlice.js';
import Card from '../../components/Card.jsx';
import Table from '../../components/Table.jsx';
import Badge from '../../components/Badge.jsx';
import Button from '../../components/Button.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import Alert from '../../components/Alert.jsx';
import Modal from '../../components/Modal.jsx';
import Input from '../../components/Input.jsx';
import Select from '../../components/Select.jsx';
import { UserCheck, Clock, Check, X, PlusCircle, LayoutGrid, List as ListIcon, Filter, ChevronDown } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext.jsx';

export const VisitorsResident = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { logs, status, error } = useSelector((state) => state.visitor);
  const { user } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [statusFilter, setStatusFilter] = useState('All');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      visitorType: 'Guest',
      purpose: '',
      vehicleNumber: '',
      expectedDuration: 1,
    },
  });

  useEffect(() => {
    dispatch(fetchResidentVisitors({}));
  }, [dispatch]);

  const handleStatusChange = async (id, statusVal) => {
    const result = await dispatch(updateVisitorStatus({ id, status: statusVal }));
    if (updateVisitorStatus.fulfilled.match(result)) {
      showToast(`Visitor invitation has been ${statusVal.toLowerCase()}!`);
      dispatch(fetchResidentVisitors({}));
    } else {
      showToast(result.payload || 'Failed to update visitor request', 'error');
    }
  };

  const onSubmitVisitor = async (data) => {
    setSubmitLoading(true);
    try {
      const payload = {
        ...data,
        hostResident: user._id || user.id,
      };
      const result = await dispatch(registerVisitor(payload));
      if (registerVisitor.fulfilled.match(result)) {
        showToast('Visitor pre-registered successfully!');
        dispatch(fetchResidentVisitors({}));
        setIsModalOpen(false);
        reset();
      } else {
        showToast(result.payload || 'Failed to register visitor', 'error');
      }
    } catch (err) {
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const columns = [
    {
      header: 'Visitor Details',
      key: 'name',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-primary-900 dark:text-slate-100 text-sm">{row.name}</span>
          <span className="text-xs text-primary-500 dark:text-slate-400">{row.phone}</span>
        </div>
      ),
    },
    {
      header: 'Invitation Code',
      key: 'uniqueVisitorId',
      render: (val) => <span className="font-mono text-xs text-primary-600 dark:text-slate-300 bg-primary-100 dark:bg-slate-800 px-2 py-1 rounded">{val}</span>,
    },
    {
      header: 'Purpose',
      key: 'purpose',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-accent-600 dark:text-accent-400 uppercase">{row.visitorType}</span>
          <span className="text-xs text-primary-600 dark:text-slate-400">{val}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => {
        const variants = {
          Pending: 'warning',
          Approved: 'success',
          Rejected: 'error',
          'Checked In': 'accent',
          'Checked Out': 'gray',
        };
        return <Badge variant={variants[val] || 'gray'}>{val}</Badge>;
      },
    },
    {
      header: 'Actions / Entry Time',
      key: '_id',
      render: (val, row) => {
        // If the resident pre-registers, status starts as 'Pending' but they are the host.
        // Wait, if they pre-register, usually they approve it themselves, but here they can just approve.
        if (row.status === 'Pending') {
          return (
            <div className="flex gap-2">
              <Button size="xs" variant="success" onClick={() => handleStatusChange(row._id, 'Approved')} className="flex items-center gap-0.5">
                <Check size={12} /> Approve
              </Button>
              <Button size="xs" variant="outline" onClick={() => handleStatusChange(row._id, 'Rejected')} className="flex items-center gap-0.5 text-red-600 border-red-200 hover:bg-red-500/10">
                <X size={12} /> Deny
              </Button>
            </div>
          );
        }

        return (
          <div className="flex flex-col text-xs text-primary-500 gap-0.5">
            {row.checkIn && (
              <span className="flex items-center gap-1">
                <Clock size={11} className="text-emerald-600" /> In: {new Date(row.checkIn).toLocaleString()}
              </span>
            )}
            {row.checkOut && (
              <span className="flex items-center gap-1">
                <Clock size={11} className="text-rose-400" /> Out: {new Date(row.checkOut).toLocaleString()}
              </span>
            )}
            {!row.checkIn && !row.checkOut && <span className="text-primary-500 italic">Approved, expected</span>}
          </div>
        );
      },
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

  const filteredLogs = (logs || []).filter(log => {
    return statusFilter === 'All' || log.status === statusFilter;
  });

  return (
    <div className="flex flex-col gap-6 animate-slide-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-900 dark:text-white tracking-tight flex items-center gap-2">
            <UserCheck className="text-accent-600" size={24} />
            My Visitors & Invites
          </h1>
          <p className="text-sm text-primary-500 dark:text-slate-400">Manage gate approvals, clearances, check-in history, and pre-register guests.</p>
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
            <PlusCircle size={16} /> Pre-Register Guest
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
            <option value="Approved">Approved</option>
            <option value="Checked In">Checked In</option>
            <option value="Checked Out">Checked Out</option>
            <option value="Rejected">Rejected</option>
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
            data={filteredLogs}
            emptyMessage="No visitors match your current filters."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <Card key={log._id} className="p-5 border-slate-200 dark:border-slate-800 ring-1 ring-slate-100 dark:ring-slate-800/50 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">{log.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400">{log.phone}</span>
                      <span className="text-[10px] uppercase font-bold text-accent-600 bg-accent-50 dark:bg-accent-900/30 px-1.5 py-0.5 rounded">{log.visitorType}</span>
                    </div>
                  </div>
                  <Badge variant={log.status === 'Approved' ? 'success' : log.status === 'Pending' ? 'warning' : log.status === 'Rejected' ? 'error' : log.status === 'Checked In' ? 'accent' : 'gray'}>
                    {log.status}
                  </Badge>
                </div>
                
                <div className="flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Invite Code</span> 
                    <span className="font-mono text-xs text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/50 px-2 py-1 rounded">{log.uniqueVisitorId}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-2">
                    <span className="text-xs">Purpose</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200 text-xs">{log.purpose}</span>
                  </div>
                </div>

                {log.status === 'Pending' && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                    <Button size="xs" variant="success" onClick={() => handleStatusChange(log._id, 'Approved')} className="flex items-center gap-0.5">
                      <Check size={12} /> Approve
                    </Button>
                    <Button size="xs" variant="outline" onClick={() => handleStatusChange(log._id, 'Rejected')} className="flex items-center gap-0.5 text-red-600 border-red-200 hover:bg-red-500/10">
                      <X size={12} /> Deny
                    </Button>
                  </div>
                )}
                
                {(log.checkIn || log.checkOut) && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1 text-xs text-primary-500 dark:text-slate-400">
                    {log.checkIn && (
                      <span className="flex items-center gap-1"><Clock size={11} className="text-emerald-600" /> In: {new Date(log.checkIn).toLocaleString()}</span>
                    )}
                    {log.checkOut && (
                      <span className="flex items-center gap-1"><Clock size={11} className="text-rose-400" /> Out: {new Date(log.checkOut).toLocaleString()}</span>
                    )}
                  </div>
                )}
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl mb-4">
                  <UserCheck size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No visitors found</h3>
                <p className="text-slate-500 mt-1 max-w-sm">No visitors match your current filters.</p>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Pre-Register Visitor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Pre-Register Visitor"
        description="Generate a pre-approved gate pass to expedite security clearance for your guests."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit(onSubmitVisitor)}
              disabled={submitLoading}
            >
              {submitLoading ? 'Registering...' : 'Register Visitor'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmitVisitor)} className="flex flex-col gap-4">
          <Input
            label="Visitor Full Name"
            type="text"
            placeholder="e.g. Rahul Sharma"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="e.g. +919876543210"
              error={errors.phone?.message}
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^\+?[1-9]\d{9,14}$/,
                  message: 'Please enter a valid phone number',
                },
              })}
            />

            <Select
              label="Visitor Type"
              options={[
                { value: 'Guest', label: 'Guest' },
                { value: 'Delivery', label: 'Delivery' },
                { value: 'Service', label: 'Service / Repair' },
                { value: 'Other', label: 'Other' },
              ]}
              {...register('visitorType')}
            />
          </div>

          <Input
            label="Purpose of Visit"
            type="text"
            placeholder="e.g. Meeting, Amazon Delivery, AC Repair"
            error={errors.purpose?.message}
            {...register('purpose', { required: 'Purpose is required' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Vehicle Number (Optional)"
              type="text"
              placeholder="e.g. MH-12-AB-1234"
              {...register('vehicleNumber')}
            />

            <Input
              label="Expected Duration (Hours)"
              type="number"
              min="1"
              max="48"
              {...register('expectedDuration', { valueAsNumber: true })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VisitorsResident;
