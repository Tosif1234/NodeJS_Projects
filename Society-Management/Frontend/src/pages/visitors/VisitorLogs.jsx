import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminVisitorLogs, checkOutVisitor, updateVisitorStatus } from '../../store/slices/visitorSlice.js';
import Card from '../../components/Card.jsx';
import Table from '../../components/Table.jsx';
import Badge from '../../components/Badge.jsx';
import Button from '../../components/Button.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import Alert from '../../components/Alert.jsx';
import ViewToggle from '../../components/ViewToggle.jsx';
import useViewToggle from '../../components/useViewToggle.js';
import { UserCheck, Calendar, Clock, ArrowRightCircle, Search, Check, X } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext.jsx';
import RegisterVisitorModal from './RegisterVisitorModal.jsx';

export const VisitorLogs = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { logs, status, error } = useSelector((state) => state.visitor);
  const [view, setView] = useViewToggle('admin-visitors');

  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setTypeFilter('');
  };

  const activeFiltersCount = [statusFilter, typeFilter, searchTerm].filter(Boolean).length;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchFilters = { limit: 100, search: debouncedSearch, status: statusFilter, visitorType: typeFilter };
    dispatch(fetchAdminVisitorLogs(fetchFilters));
  }, [dispatch, debouncedSearch, statusFilter, typeFilter]);

  const handleCheckOut = async (id) => {
    const result = await dispatch(checkOutVisitor(id));
    if (checkOutVisitor.fulfilled.match(result)) {
      showToast('Visitor checked out successfully', 'success');
      dispatch(fetchAdminVisitorLogs({ limit: 100 })); // Refresh list
    } else {
      showToast(result.payload || 'Failed to checkout visitor', 'error');
    }
  };

  const handleUpdateStatus = async (id, statusVal) => {
    const result = await dispatch(updateVisitorStatus({ id, status: statusVal }));
    if (updateVisitorStatus.fulfilled.match(result)) {
      showToast(`Visitor ${statusVal.toLowerCase()} successfully!`);
      dispatch(fetchAdminVisitorLogs({ limit: 100 })); // Refresh list
    } else {
      showToast(result.payload || 'Failed to update visitor status', 'error');
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
      header: 'Type & Purpose',
      key: 'visitorType',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-accent-600 dark:text-accent-400 tracking-wide uppercase">{row.visitorType}</span>
          <span className="text-xs text-primary-500 dark:text-slate-400 truncate max-w-[200px]">{row.purpose}</span>
        </div>
      ),
    },
    {
      header: 'Host Resident',
      key: 'hostResident.name',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="text-sm text-primary-900 dark:text-slate-100 font-medium">{row.hostResident?.name || 'N/A'}</span>
          <span className="text-xs text-primary-500 dark:text-slate-400">Flat {row.hostResident?.flatNumber || ''}</span>
        </div>
      ),
    },
    {
      header: 'Pass ID',
      key: 'uniqueVisitorId',
      render: (val) => <span className="font-mono text-xs text-primary-600 dark:text-slate-300 bg-primary-100 dark:bg-slate-800 px-2 py-1 rounded">{val}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => {
        const variants = {
          'Checked In': 'success',
          'Checked Out': 'gray',
          Pending: 'warning',
          Approved: 'accent',
          Rejected: 'error',
        };
        return <Badge variant={variants[val] || 'gray'}>{val}</Badge>;
      },
    },
    {
      header: 'Timestamps',
      key: 'checkIn',
      render: (val, row) => (
        <div className="flex flex-col gap-0.5 text-xs text-primary-500 dark:text-slate-400">
          {row.checkIn && (
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-emerald-500" /> In: {new Date(row.checkIn).toLocaleString()}
            </span>
          )}
          {row.checkOut && (
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-rose-500" /> Out: {new Date(row.checkOut).toLocaleString()}
            </span>
          )}
          {!row.checkIn && !row.checkOut && (
            <span className="flex items-center gap-1">
              <Calendar size={12} /> Expected soon
            </span>
          )}
        </div>
      ),
    },
    {
      header: <div className="text-right">Actions</div>,
      key: '_id',
      render: (val, row) => (
        <div className="flex justify-end gap-1.5">
          {row.status === 'Pending' && (
            <>
              <Button size="xs" variant="outline" className="!text-green-600 !border-green-600 dark:!border-green-500 dark:!text-green-400 hover:!bg-green-50 dark:hover:!bg-green-500/10 !px-2 flex items-center gap-1" onClick={() => handleUpdateStatus(row._id, 'Approved')} title="Approve">
                <Check size={13} className="text-green-600 dark:text-green-400" /> <span className="hidden xl:inline text-green-600 dark:text-green-400">Approve</span>
              </Button>
              <Button size="xs" variant="outline" className="!text-red-600 !border-red-600 dark:!border-red-500 dark:!text-red-400 hover:!bg-red-50 dark:hover:!bg-red-500/10 !px-2 flex items-center gap-1" onClick={() => handleUpdateStatus(row._id, 'Rejected')} title="Reject">
                <X size={13} className="text-red-600 dark:text-red-400" /> <span className="hidden xl:inline text-red-600 dark:text-red-400">Reject</span>
              </Button>
            </>
          )}
          {row.status === 'Checked In' && (
            <Button size="xs" variant="outline" className="text-amber-600 border-amber-200 dark:border-amber-500/30 dark:text-amber-400 hover:bg-amber-50 !px-2" onClick={() => handleCheckOut(row._id)}>
              <ArrowRightCircle size={13} className="mr-1 hidden xl:inline" /> Check Out
            </Button>
          )}
        </div>
      ),
    },
  ];

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {(logs || []).map((v) => (
        <Card key={v._id} className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-semibold text-primary-900 dark:text-slate-100 text-sm">{v.name}</span>
              <span className="text-xs text-primary-500 dark:text-slate-400">{v.phone}</span>
            </div>
            <Badge variant={
              v.status === 'Checked In' ? 'success' :
              v.status === 'Checked Out' ? 'gray' :
              v.status === 'Pending' ? 'warning' :
              v.status === 'Approved' ? 'accent' : 'error'
            }>{v.status}</Badge>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-semibold text-accent-600 dark:text-accent-400 uppercase">{v.visitorType}</span>
            <span className="text-xs text-primary-500 dark:text-slate-400">• {v.purpose}</span>
          </div>
          <div className="text-xs text-primary-500 dark:text-slate-400 mt-2">
            Host: {v.hostResident?.name || 'N/A'} (Flat {v.hostResident?.flatNumber || ''})
          </div>
          <div className="flex flex-col gap-0.5 text-xs text-primary-500 dark:text-slate-400 mt-2">
            {v.checkIn && <span className="flex items-center gap-1"><Clock size={11} className="text-emerald-500" /> In: {new Date(v.checkIn).toLocaleString()}</span>}
            {v.checkOut && <span className="flex items-center gap-1"><Clock size={11} className="text-rose-500" /> Out: {new Date(v.checkOut).toLocaleString()}</span>}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-mono text-xs text-primary-600 dark:text-slate-300 bg-primary-100 dark:bg-slate-800 px-2 py-1 rounded">ID: {v.uniqueVisitorId}</span>
            <div className="flex justify-end gap-1.5">
              {v.status === 'Pending' && (
                <>
                  <Button size="xs" variant="outline" className="!text-green-600 !border-green-600 dark:!border-green-500 dark:!text-green-400 hover:!bg-green-50 dark:hover:!bg-green-500/10 !px-2" onClick={() => handleUpdateStatus(v._id, 'Approved')} title="Approve">
                    <Check size={13} />
                  </Button>
                  <Button size="xs" variant="outline" className="!text-red-600 !border-red-600 dark:!border-red-500 dark:!text-red-400 hover:!bg-red-50 dark:hover:!bg-red-500/10 !px-2" onClick={() => handleUpdateStatus(v._id, 'Rejected')} title="Reject">
                    <X size={13} />
                  </Button>
                </>
              )}
              {v.status === 'Checked In' && (
                <Button size="xs" variant="outline" className="text-amber-600 border-amber-200 dark:border-amber-500/30 dark:text-amber-400 !px-2" onClick={() => handleCheckOut(v._id)}>
                  Check Out
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  if (status === 'loading') {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton variant="text" className="h-8 w-1/4 bg-primary-50 dark:bg-slate-800" />
        <Skeleton variant="card" className="h-96 bg-primary-50 dark:bg-slate-800" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <UserCheck className="text-accent-600 dark:text-accent-400" size={24} />
            Visitor Pass Logs
          </h1>
          <p className="text-sm text-primary-500 dark:text-slate-400">View and audit historical gate visitor logs, check-ins, and clearances.</p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle view={view} onChange={setView} />
          <Button onClick={() => setRegisterModalOpen(true)}>Register Visitor</Button>
        </div>
      </div>

      {error && (
        <Alert variant="error" title="API Fetch Error">{error}</Alert>
      )}

      {/* Filters */}
      <div className="flex flex-col xl:flex-row gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-primary-200 dark:border-slate-800 items-center">
        <div className="relative flex-1 w-full xl:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-primary-200 dark:border-slate-700 rounded-lg text-sm bg-primary-50 dark:bg-slate-800 text-primary-900 dark:text-slate-100 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
            placeholder="Search visitors by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <select
            className="border border-primary-200 dark:border-slate-700 rounded-lg text-sm py-2 px-3 bg-primary-50 dark:bg-slate-800 text-primary-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500 flex-1 sm:flex-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Checked In">Checked In</option>
            <option value="Checked Out">Checked Out</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select
            className="border border-primary-200 dark:border-slate-700 rounded-lg text-sm py-2 px-3 bg-primary-50 dark:bg-slate-800 text-primary-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500 flex-1 sm:flex-none"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Guest">Guest</option>
            <option value="Delivery">Delivery</option>
            <option value="Service">Service</option>
            <option value="Maid">Maid</option>
            <option value="Cab">Cab</option>
            <option value="Other">Other</option>
          </select>
          
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 ml-auto sm:ml-0 w-full sm:w-auto justify-end sm:justify-start">
              <span className="text-xs text-primary-500 dark:text-slate-400">
                {activeFiltersCount} Filter{activeFiltersCount !== 1 && 's'} Active
              </span>
              <button
                onClick={handleClearFilters}
                className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {view === 'table' ? (
        <Table columns={columns} data={logs || []} emptyMessage="No visitors registered in society records." />
      ) : (
        (logs || []).length === 0 ? (
          <Table columns={columns} data={[]} emptyMessage="No visitors registered." />
        ) : renderCardView()
      )}

      <RegisterVisitorModal 
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />
    </div>
  );
};

export default VisitorLogs;
