import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminBookings, updateBookingStatus } from '../../store/slices/bookingSlice.js';
import Card from '../../components/Card.jsx';
import Table from '../../components/Table.jsx';
import Badge from '../../components/Badge.jsx';
import Button from '../../components/Button.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import Alert from '../../components/Alert.jsx';
import { CalendarCheck, Calendar, Clock, Search, Check, X, Trash2, Ban } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext.jsx';
import { useState } from 'react';
import Swal from 'sweetalert2';

export const BookingsList = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { bookings, status, error } = useSelector((state) => state.booking);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  const activeFiltersCount = [statusFilter, searchTerm].filter(Boolean).length;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(fetchAdminBookings({ search: debouncedSearch, status: statusFilter }));
  }, [dispatch, debouncedSearch, statusFilter]);

  const handleUpdateStatus = async (id, statusVal) => {
    const result = await dispatch(updateBookingStatus({ id, status: statusVal }));
    if (updateBookingStatus.fulfilled.match(result)) {
      showToast(`Booking ${statusVal.toLowerCase()} successfully!`);
    } else {
      showToast(result.payload || 'Failed to update booking', 'error');
    }
  };

  const handleCancelBooking = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to cancel this approved booking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, cancel it!'
    });

    if (result.isConfirmed) {
      const { cancelFacilityBooking } = await import('../../store/slices/bookingSlice.js');
      const actionResult = await dispatch(cancelFacilityBooking(id));
      if (cancelFacilityBooking.fulfilled.match(actionResult)) {
        showToast('Booking cancelled successfully!', 'success');
      } else {
        showToast(actionResult.payload || 'Failed to cancel booking', 'error');
      }
    }
  };

  const handleDeleteBooking = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this booking? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const { deleteBooking } = await import('../../store/slices/bookingSlice.js');
        const actionResult = await dispatch(deleteBooking(id));
        if (deleteBooking.fulfilled.match(actionResult)) {
          showToast('Booking deleted successfully!', 'success');
          dispatch(fetchAdminBookings({ search: debouncedSearch, status: statusFilter }));
        } else {
          showToast(actionResult.payload || 'Failed to delete booking', 'error');
        }
      } catch (err) {
        showToast('Error deleting booking', 'error');
      }
    }
  };

  const columns = [
    {
      header: 'Facility Name',
      key: 'facilityName',
      render: (val) => <span className="font-semibold text-primary-900 dark:text-slate-100 text-sm">{val}</span>,
    },
    {
      header: 'Booked By',
      key: 'bookedBy.name',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 flex items-center justify-center font-bold text-xs">
            {row.bookedBy?.name?.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase()}
          </div>
          <span className="text-xs text-primary-900 dark:text-slate-100">{row.bookedBy?.name || 'Resident'}</span>
        </div>
      ),
    },
    {
      header: 'Date & Time',
      key: 'bookingDate',
      render: (val, row) => (
        <div className="flex flex-col text-xs text-primary-600 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {new Date(val).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {row.startTime} - {row.endTime}
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => {
        const variants = {
          Approved: 'success',
          Pending: 'warning',
          Cancelled: 'error',
          Rejected: 'gray',
        };
        return <Badge variant={variants[val] || 'gray'}>{val}</Badge>;
      },
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
          {row.status === 'Approved' && (
             <Button size="xs" variant="outline" className="text-amber-600 border-amber-200 dark:border-amber-700/50 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 !px-2 flex items-center gap-1" onClick={() => handleCancelBooking(row._id)} title="Cancel">
               <Ban size={13} className="text-amber-600 dark:text-amber-400" /> <span className="hidden xl:inline text-amber-600 dark:text-amber-400">Cancel</span>
             </Button>
          )}
          <Button size="xs" variant="outline" className="text-red-600 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 !px-2" onClick={() => handleDeleteBooking(row._id)} title="Delete">
            <Trash2 size={13} />
          </Button>
        </div>
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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-primary-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <CalendarCheck className="text-accent-600 dark:text-accent-400" size={24} />
          Amenities & Facility Bookings
        </h1>
        <p className="text-sm text-primary-500 dark:text-slate-400">Review and approve resident facility reservations and schedule conflicts.</p>
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
            placeholder="Search bookings by facility or resident name..."
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
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Rejected">Rejected</option>
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

      <Card className="p-0 overflow-hidden bg-white dark:bg-slate-900 border-primary-200 dark:border-slate-800">
        <Table
          columns={columns}
          data={bookings || []}
          emptyMessage="No facility bookings recorded."
        />
      </Card>
    </div>
  );
};

export default BookingsList;

