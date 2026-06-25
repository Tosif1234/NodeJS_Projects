import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminComplaints } from '../../store/slices/complaintSlice.js';
import Card from '../../components/Card.jsx';
import Table from '../../components/Table.jsx';
import Badge from '../../components/Badge.jsx';
import Button from '../../components/Button.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import Alert from '../../components/Alert.jsx';
import ViewToggle from '../../components/ViewToggle.jsx';
import useViewToggle from '../../components/useViewToggle.js';
import { ClipboardList, MessageSquare, Search } from 'lucide-react';
import ManageComplaintModal from './ManageComplaintModal.jsx';
import ComplaintCommentsModal from './ComplaintCommentsModal.jsx';
import { io } from 'socket.io-client';

export const ComplaintsList = () => {
  const dispatch = useDispatch();
  const { complaints, status, error } = useSelector((state) => state.complaint);
  const [view, setView] = useViewToggle('admin-complaints');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('status'); // 'assign' or 'status'
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedComplaintForComments, setSelectedComplaintForComments] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setCategoryFilter('');
    setPriorityFilter('');
  };

  const activeFiltersCount = [statusFilter, categoryFilter, priorityFilter, searchTerm].filter(Boolean).length;
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchFilters = { search: debouncedSearch, status: statusFilter, category: categoryFilter, priority: priorityFilter, limit: 100 };
    dispatch(fetchAdminComplaints(fetchFilters));

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socket.on('complaint_updated', () => {
      dispatch(fetchAdminComplaints(fetchFilters));
    });

    return () => socket.disconnect();
  }, [dispatch, debouncedSearch, statusFilter, categoryFilter, priorityFilter]);

  const currentComplaintInModal = selectedComplaintForComments 
    ? complaints?.find(c => c._id === selectedComplaintForComments._id) 
    : null;

  const sortedComplaints = [...(complaints || [])].sort((a, b) => {
    // 1. Group: Unassigned (Open) vs Assigned (Not Open)
    const aIsAssigned = !!a.assignedTo || a.status !== 'Open';
    const bIsAssigned = !!b.assignedTo || b.status !== 'Open';
    
    if (aIsAssigned && !bIsAssigned) return 1;
    if (!aIsAssigned && bIsAssigned) return -1;
    
    // 2. Group: Status
    const statusOrder = { 'Open': 1, 'Assigned': 2, 'In Progress': 3, 'Resolved': 4, 'Closed': 5 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
    }

    // 3. Group: Priority
    const priorityOrder = { 'Critical': 1, 'High': 2, 'Medium': 3, 'Low': 4 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99);
    }

    // 4. Group: Date (Newest first)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleOpenAssign = (complaint) => {
    setSelectedComplaint(complaint);
    setModalMode('assign');
    setModalOpen(true);
  };

  const handleOpenStatus = (complaint) => {
    setSelectedComplaint(complaint);
    setModalMode('status');
    setModalOpen(true);
  };

  const columns = [
    {
      header: 'Complaint details',
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
          <Badge variant={row.priority === 'High' ? 'error' : row.priority === 'Medium' ? 'warning' : 'success'}>
            {row.priority}
          </Badge>
        </div>
      ),
    },
    {
      header: 'Raised By',
      key: 'raisedBy.name',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 flex items-center justify-center font-bold text-xs">
            {row.raisedBy?.name?.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase()}
          </div>
          <span className="text-xs text-primary-800 dark:text-slate-200">{row.raisedBy?.name || 'Resident'}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <Badge>{val}</Badge>,
    },
    {
      header: 'Assigned To',
      key: 'assignedTo.name',
      render: (val, row) => (
        <span className="text-xs text-primary-600 dark:text-slate-400 whitespace-nowrap">
          {row.assignedTo?.name ? `👷 ${row.assignedTo.name}` : 'Unassigned'}
        </span>
      ),
    },
    {
      header: 'Discussion',
      key: 'comments',
      render: (val, row) => (
        <button 
          onClick={() => setSelectedComplaintForComments(row)}
          className="text-xs text-primary-500 hover:text-primary-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 whitespace-nowrap cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-md transition-colors"
        >
          <MessageSquare size={13} /> {val?.length || 0} comments
        </button>
      ),
    },
    {
      header: <div className="text-right">Actions</div>,
      key: '_id',
      render: (val, row) => (
        <div className="flex justify-end gap-1.5">
          {!row.assignedTo && (
            <Button size="xs" variant="accent" className="!px-2" onClick={() => handleOpenAssign(row)}>
              Assign
            </Button>
          )}
          <Button size="xs" variant="outline" className="text-primary-600 border-primary-200 dark:border-slate-700 dark:text-slate-300 !px-2" onClick={() => handleOpenStatus(row)} title="Update Status">
            Status
          </Button>
        </div>
      ),
    },
  ];

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {sortedComplaints.map((c) => (
        <Card key={c._id} className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-semibold text-primary-900 dark:text-slate-100 text-sm">{c.title}</span>
              <span className="text-xs text-primary-500 dark:text-slate-400 mt-0.5 line-clamp-2">{c.description}</span>
            </div>
            <Badge>{c.status}</Badge>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-primary-600 dark:text-slate-300 bg-primary-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">{c.category}</span>
            <Badge variant={c.priority === 'High' ? 'error' : c.priority === 'Medium' ? 'warning' : 'success'}>{c.priority}</Badge>
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-primary-500 dark:text-slate-400">
            <span>Raised by: {c.raisedBy?.name || 'Resident'}</span>
            <span>{c.assignedTo?.name ? `👷 ${c.assignedTo.name}` : 'Unassigned'}</span>
          </div>
          <div className="flex gap-2 mt-3">
            {!c.assignedTo && (
              <Button size="xs" variant="accent" className="w-full" onClick={() => handleOpenAssign(c)}>
                Assign
              </Button>
            )}
            <Button size="xs" variant="outline" className="w-full" onClick={() => handleOpenStatus(c)}>
              Status
            </Button>
            <Button size="xs" variant="outline" className="w-full flex items-center justify-center gap-1" onClick={() => setSelectedComplaintForComments(c)}>
              <MessageSquare size={12} /> {c.comments?.length || 0}
            </Button>
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
            <ClipboardList className="text-accent-600 dark:text-accent-400" size={24} />
            Complaints Management
          </h1>
          <p className="text-sm text-primary-500 dark:text-slate-400">Track and assign utility maintenance tickets filed by society residents.</p>
        </div>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {error && (
        <Alert variant="error" title="API Fetch Error">
          {error}
        </Alert>
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
            placeholder="Search complaints..."
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
            <option value="Open">Open</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <select
            className="border border-primary-200 dark:border-slate-700 rounded-lg text-sm py-2 px-3 bg-primary-50 dark:bg-slate-800 text-primary-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500 flex-1 sm:flex-none"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Security">Security</option>
            <option value="Parking">Parking</option>
            <option value="Lift Maintenance">Lift Maintenance</option>
            <option value="Other">Other</option>
          </select>
          <select
            className="border border-primary-200 dark:border-slate-700 rounded-lg text-sm py-2 px-3 bg-primary-50 dark:bg-slate-800 text-primary-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500 flex-1 sm:flex-none"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
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
        <Table columns={columns} data={sortedComplaints} emptyMessage="No complaints raised currently." />
      ) : (
        sortedComplaints.length === 0 ? (
          <Table columns={columns} data={[]} emptyMessage="No complaints raised currently." />
        ) : renderCardView()
      )}

      <ManageComplaintModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        complaint={selectedComplaint}
        mode={modalMode}
      />

      {selectedComplaintForComments && (
        <ComplaintCommentsModal 
          isOpen={!!selectedComplaintForComments} 
          onClose={() => setSelectedComplaintForComments(null)} 
          complaint={currentComplaintInModal || selectedComplaintForComments} 
        />
      )}
    </div>
  );
};

export default ComplaintsList;

