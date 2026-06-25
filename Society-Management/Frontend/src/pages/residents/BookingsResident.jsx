import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { fetchResidentBookings, createFacilityBooking, cancelFacilityBooking } from '../../store/slices/bookingSlice.js';
import Card from '../../components/Card.jsx';
import Table from '../../components/Table.jsx';
import Badge from '../../components/Badge.jsx';
import Button from '../../components/Button.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import Alert from '../../components/Alert.jsx';
import Modal from '../../components/Modal.jsx';
import Input from '../../components/Input.jsx';
import Select from '../../components/Select.jsx';
import { CalendarCheck, PlusCircle, Calendar, Clock, X, LayoutGrid, List as ListIcon, Filter, ChevronDown } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext.jsx';
import Swal from 'sweetalert2';

export const BookingsResident = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { bookings, status, error } = useSelector((state) => state.booking);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [statusFilter, setStatusFilter] = useState('All');
  const [facilityFilter, setFacilityFilter] = useState('All');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      facilityName: 'Club House',
      bookingDate: '',
      startTime: '10:00',
      endTime: '12:00'
    }
  });

  useEffect(() => {
    dispatch(fetchResidentBookings({}));
  }, [dispatch]);

  const onSubmitBooking = async (data) => {
    setSubmitLoading(true);
    try {
      const result = await dispatch(createFacilityBooking(data));
      if (createFacilityBooking.fulfilled.match(result)) {
        showToast('Successfully reserved a facility slot!');
        dispatch(fetchResidentBookings({}));
        setIsModalOpen(false);
        reset();
      } else {
        showToast(result.payload || 'Failed to book slot. Check for conflicts.', 'error');
      }
    } catch (err) {
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to cancel this booking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, cancel it!'
    });

    if (result.isConfirmed) {
      const actionResult = await dispatch(cancelFacilityBooking(id));
      if (cancelFacilityBooking.fulfilled.match(actionResult)) {
        showToast('Facility booking cancelled.');
        dispatch(fetchResidentBookings({}));
      } else {
        showToast(actionResult.payload || 'Failed to cancel booking', 'error');
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
      header: 'Reserved Date',
      key: 'bookingDate',
      render: (val) => (
        <span className="text-xs text-primary-600 dark:text-slate-400 flex items-center gap-1">
          <Calendar size={12} /> {new Date(val).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Reserved Time',
      key: 'startTime',
      render: (val, row) => (
        <span className="text-xs text-primary-600 dark:text-slate-400 flex items-center gap-1">
          <Clock size={12} /> {row.startTime} - {row.endTime}
        </span>
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
      header: 'Action',
      key: '_id',
      render: (val, row) => {
        if (row.status === 'Pending' || row.status === 'Approved') {
          return (
            <Button size="xs" variant="outline" className="text-red-600 border-red-200 hover:bg-red-500/10" onClick={() => handleCancelBooking(row._id)}>
              <X size={12} className="inline mr-1" /> Cancel
            </Button>
          );
        }
        return <span className="text-xs text-primary-500 italic">No actions</span>;
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

  // Get current date string for min date boundary (residents can only book future dates)
  const todayStr = new Date().toISOString().split('T')[0];

  const filteredBookings = (bookings || []).filter(booking => {
    const matchStatus = statusFilter === 'All' || booking.status === statusFilter;
    const matchFacility = facilityFilter === 'All' || booking.facilityName === facilityFilter;
    return matchStatus && matchFacility;
  });

  return (
    <div className="flex flex-col gap-6 animate-slide-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-900 dark:text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="text-accent-600" size={24} />
            Facility Bookings
          </h1>
          <p className="text-sm text-primary-500 dark:text-slate-400">Book and manage society amenities.</p>
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
            <PlusCircle size={16} /> New Booking
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
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Rejected">Rejected</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select 
            value={facilityFilter}
            onChange={(e) => setFacilityFilter(e.target.value)}
            className="pl-9 pr-8 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500/20 appearance-none text-slate-700 dark:text-slate-300 shadow-sm"
          >
            <option value="All">All Facilities</option>
            <option value="Club House">Club House</option>
            <option value="Gym">Gym</option>
            <option value="Community Hall">Community Hall</option>
            <option value="Swimming Pool">Swimming Pool</option>
            <option value="Sports Court">Sports Court</option>
            <option value="Garden Area">Garden Area</option>
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
            data={filteredBookings}
            emptyMessage="No facility bookings match your current filters."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <Card key={booking._id} className="p-5 border-slate-200 dark:border-slate-800 ring-1 ring-slate-100 dark:ring-slate-800/50 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">{booking.facilityName}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2">
                      <Calendar size={12} /> {new Date(booking.bookingDate).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant={booking.status === 'Approved' ? 'success' : booking.status === 'Pending' ? 'warning' : booking.status === 'Cancelled' ? 'error' : 'gray'}>
                    {booking.status}
                  </Badge>
                </div>
                <div className="flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2"><Clock size={14} /> Time</span> 
                    <span className="font-semibold text-slate-900 dark:text-slate-200">{booking.startTime} - {booking.endTime}</span>
                  </div>
                </div>
                {(booking.status === 'Pending' || booking.status === 'Approved') && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <Button size="xs" variant="outline" className="text-red-600 border-red-200 hover:bg-red-500/10" onClick={() => handleCancelBooking(booking._id)}>
                      <X size={12} className="inline mr-1" /> Cancel
                    </Button>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl mb-4">
                  <CalendarCheck size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No bookings found</h3>
                <p className="text-slate-500 mt-1 max-w-sm">No facility bookings match your current filters.</p>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Book Facility Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Amenity Reservation"
        description="Select a society facility and time slot to submit a booking request for approval."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit(onSubmitBooking)}
              disabled={submitLoading}
            >
              {submitLoading ? 'Reserving...' : 'Submit Request'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmitBooking)} className="flex flex-col gap-4">
          <Select
            label="Select Amenity"
            options={[
              { value: 'Club House', label: 'Club House' },
              { value: 'Gym', label: 'Gym' },
              { value: 'Community Hall', label: 'Community Hall' },
              { value: 'Swimming Pool', label: 'Swimming Pool' },
              { value: 'Sports Court', label: 'Sports Court' },
              { value: 'Garden Area', label: 'Garden Area' },
            ]}
            {...register('facilityName')}
          />

          <Input
            label="Booking Date"
            type="date"
            min={todayStr}
            error={errors.bookingDate?.message}
            {...register('bookingDate', { required: 'Booking date is required' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="time"
              error={errors.startTime?.message}
              {...register('startTime', { required: 'Start time is required' })}
            />

            <Input
              label="End Time"
              type="time"
              error={errors.endTime?.message}
              {...register('endTime', { required: 'End time is required' })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BookingsResident;


