import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResidentsList, deleteResidentProfile, updateProfile } from '../../store/slices/residentSlice.js';
import EditResidentModal from './EditResidentModal.jsx';
import Card from '../../components/Card.jsx';
import Table from '../../components/Table.jsx';
import Badge from '../../components/Badge.jsx';
import Button from '../../components/Button.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import Alert from '../../components/Alert.jsx';
import ViewToggle from '../../components/ViewToggle.jsx';
import useViewToggle from '../../components/useViewToggle.js';
import { Users, Mail, Phone, Home, Trash2, Edit2, Power, Search, Filter } from 'lucide-react';

export const ResidentsList = () => {
  const dispatch = useDispatch();
  const { residentsList, status, error } = useSelector((state) => state.resident);
  const [view, setView] = useViewToggle('admin-residents');
  const [editingProfile, setEditingProfile] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [occupancyFilter, setOccupancyFilter] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(fetchResidentsList({ search: debouncedSearch, status: statusFilter, occupancyType: occupancyFilter }));
  }, [dispatch, debouncedSearch, statusFilter, occupancyFilter]);

  const handleDelete = async (id) => {
    if (!id) return;
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this! The resident will be removed.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      const res = await dispatch(deleteResidentProfile(id));
      if (deleteResidentProfile.fulfilled.match(res)) {
        Swal.fire('Deleted!', 'Resident removed successfully.', 'success');
      } else {
        Swal.fire('Error', res.payload || 'Failed to remove resident', 'error');
      }
    }
  };

  const handleToggleStatus = async (row) => {
    if (!row.user || !row.user._id) return;
    const newStatus = row.user.status === 'Approved' ? 'Suspended' : 'Approved';
    const actionText = newStatus === 'Suspended' ? 'Deactivate' : 'Activate';
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${actionText.toLowerCase()} this account?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'Suspended' ? '#f59e0b' : '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: `Yes, ${actionText}`
    });

    if (result.isConfirmed) {
      const res = await dispatch(updateProfile({
        id: row._id,
        formData: { status: newStatus }
      }));
      if (updateProfile.fulfilled.match(res)) {
        Swal.fire('Updated!', `Account ${actionText.toLowerCase()}d successfully.`, 'success');
        dispatch(fetchResidentsList({}));
      } else {
        Swal.fire('Error', res.payload || 'Failed to update account status', 'error');
      }
    }
  };

  const columns = [
    {
      header: 'Resident Name',
      key: 'user.name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 flex items-center justify-center font-bold text-sm border border-accent-200 dark:border-accent-800">
            {row.user?.name?.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-primary-900 dark:text-slate-100 text-sm">{row.user?.name}</span>
            <span className="text-xs text-primary-500 dark:text-slate-400 flex items-center gap-1">
              <Mail size={12} /> {row.user?.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Flat & Block',
      key: 'flatNumber',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="text-sm text-primary-900 dark:text-slate-100 font-medium flex items-center gap-1">
            <Home size={13} className="text-accent-600 dark:text-accent-400" /> {row.block}
          </span>
          <span className="text-xs text-primary-500 dark:text-slate-400">Flat {row.flatNumber}</span>
        </div>
      ),
    },
    {
      header: 'Phone Number',
      key: 'user.phone',
      render: (val, row) => (
        <span className="text-sm text-primary-600 dark:text-slate-300 flex items-center gap-1">
          <Phone size={13} /> {row.user?.phone || 'N/A'}
        </span>
      ),
    },
    {
      header: 'Occupancy Type',
      key: 'occupancyType',
      render: (val) => (
        <Badge variant={val === 'Owner' ? 'success' : 'info'}>
          {val}
        </Badge>
      ),
    },
    {
      header: 'Account Status',
      key: 'user.status',
      render: (val, row) => (
        <Badge variant={row.user?.status === 'Approved' ? 'success' : 'error'}>
          {row.user?.status || 'Pending'}
        </Badge>
      ),
    },
    {
      header: 'Family & Vehicles',
      key: 'vehicles',
      render: (val, row) => (
        <div className="flex flex-col gap-1 text-[11px] text-primary-500 dark:text-slate-400">
          <span className="flex items-center gap-1">👨‍👩‍👧‍👦 {row.familyMembers?.length || 0} family</span>
          <span className="flex items-center gap-1">🚗 {row.vehicles?.length || 0} vehicles</span>
        </div>
      ),
    },
    {
      header: <div className="text-right">Actions</div>,
      key: '_id',
      render: (val, row) => (
        <div className="flex justify-end gap-1.5">
          <Button size="xs" variant="outline" className="text-amber-600 border-amber-200 dark:border-amber-500/30 dark:text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 !px-2" onClick={() => setEditingProfile(row)} title="Edit">
            <Edit2 size={13} />
          </Button>
          <Button size="xs" variant="outline" className={`${row.user?.status === 'Approved' ? 'text-slate-500 border-slate-200 dark:border-slate-600/50 dark:text-slate-400 hover:bg-slate-500/10 hover:text-slate-600 dark:hover:text-slate-300' : 'text-emerald-600 border-emerald-200 dark:border-emerald-500/30 dark:text-emerald-400 hover:bg-emerald-500/10'} !px-2`} onClick={() => handleToggleStatus(row)} title={row.user?.status === 'Approved' ? 'Deactivate Account' : 'Activate Account'}>
            <Power size={13} />
          </Button>
          <Button size="xs" variant="outline" className="text-red-600 border-red-200 dark:border-red-500/30 dark:text-red-400 hover:bg-red-500/10 hover:text-red-300 !px-2" onClick={() => handleDelete(row.user?._id)} title="Delete">
            <Trash2 size={13} />
          </Button>
        </div>
      ),
    },
  ];

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {(residentsList || []).map((r) => (
        <Card key={r._id} className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 flex items-center justify-center font-bold text-sm border border-accent-200 dark:border-accent-800 shrink-0">
              {r.user?.name?.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-semibold text-primary-900 dark:text-slate-100 text-sm truncate">{r.user?.name}</span>
              <span className="text-xs text-primary-500 dark:text-slate-400 truncate">{r.user?.email}</span>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <Badge variant={r.occupancyType === 'Owner' ? 'success' : 'info'}>{r.occupancyType}</Badge>
              <Badge variant={r.user?.status === 'Approved' ? 'success' : 'error'}>{r.user?.status || 'Pending'}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-primary-500 dark:text-slate-400">
            <span className="flex items-center gap-1"><Home size={12} className="text-accent-600 dark:text-accent-400" /> {r.block} - Flat {r.flatNumber}</span>
            <span className="flex items-center gap-1"><Phone size={12} /> {r.user?.phone || 'N/A'}</span>
          </div>
          <div className="flex gap-4 mt-2 text-xs text-primary-500 dark:text-slate-400">
            <span>👨‍👩‍👧‍👦 {r.familyMembers?.length || 0} family</span>
            <span>🚗 {r.vehicles?.length || 0} vehicles</span>
          </div>
          <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button size="xs" variant="outline" className="flex-1 text-amber-600 border-amber-200 dark:border-amber-500/30 dark:text-amber-400 hover:bg-amber-500/10 hover:text-amber-300" onClick={() => setEditingProfile(r)}>
              <Edit2 size={13} className="mr-1" /> Edit
            </Button>
            <Button size="xs" variant="outline" className={`flex-1 ${r.user?.status === 'Approved' ? 'text-slate-600 border-slate-200 dark:border-slate-500/30 dark:text-slate-400 hover:bg-slate-500/10' : 'text-emerald-600 border-emerald-200 dark:border-emerald-500/30 dark:text-emerald-400 hover:bg-emerald-500/10'}`} onClick={() => handleToggleStatus(r)}>
              <Power size={13} className="mr-1" /> {r.user?.status === 'Approved' ? 'Deactivate' : 'Activate'}
            </Button>
            <Button size="xs" variant="outline" className="flex-1 text-red-600 border-red-200 dark:border-red-500/30 dark:text-red-400 hover:bg-red-500/10 hover:text-red-300" onClick={() => handleDelete(r.user?._id)}>
              <Trash2 size={13} className="mr-1" /> Delete
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
            <Users className="text-accent-600 dark:text-accent-400" size={24} />
            Residents Administration
          </h1>
          <p className="text-sm text-primary-500 dark:text-slate-400">Manage all registered society residents, their vehicles, and emergency contacts.</p>
        </div>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {error && (
        <Alert variant="error" title="API Fetch Error">
          {error}
        </Alert>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-primary-200 dark:border-slate-800">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-primary-200 dark:border-slate-700 rounded-lg text-sm bg-primary-50 dark:bg-slate-800 text-primary-900 dark:text-slate-100 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
            placeholder="Search residents by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 sm:w-auto">
          <Filter size={16} className="text-primary-400" />
          <select
            className="border border-primary-200 dark:border-slate-700 rounded-lg text-sm py-2 px-3 bg-primary-50 dark:bg-slate-800 text-primary-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
          <select
            className="border border-primary-200 dark:border-slate-700 rounded-lg text-sm py-2 px-3 bg-primary-50 dark:bg-slate-800 text-primary-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
            value={occupancyFilter}
            onChange={(e) => setOccupancyFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Owner">Owner</option>
            <option value="Tenant">Tenant</option>
          </select>
        </div>
      </div>

      {view === 'table' ? (
        <Table
          columns={columns}
          data={residentsList || []}
          emptyMessage="No residents found. Run the seed script to populate data."
        />
      ) : (
        (residentsList || []).length === 0 ? (
          <Card className="p-0"><Table columns={columns} data={[]} emptyMessage="No residents found." /></Card>
        ) : renderCardView()
      )}
      
      {editingProfile && (
        <EditResidentModal
          isOpen={!!editingProfile}
          onClose={() => setEditingProfile(null)}
          profile={editingProfile}
        />
      )}
    </div>
  );
};

export default ResidentsList;

