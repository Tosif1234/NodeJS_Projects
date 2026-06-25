import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSecurityDashboard, checkOutVisitor } from '../../store/slices/visitorSlice.js';
import Card from '../../components/Card.jsx';
import Table from '../../components/Table.jsx';
import Badge from '../../components/Badge.jsx';
import Button from '../../components/Button.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import Alert from '../../components/Alert.jsx';
import { ShieldCheck, LogOut, Clock, Calendar, Search } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext.jsx';
import { useState } from 'react';

export const SecurityActive = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { activeVisitors, visitorHistory, status, error } = useSelector((state) => state.visitor);

  const [searchTerm, setSearchTerm] = useState('');
  const [visitorTypeFilter, setVisitorTypeFilter] = useState('');

  useEffect(() => {
    dispatch(fetchSecurityDashboard());
  }, [dispatch]);

  const filteredActiveVisitors = (activeVisitors || []).filter(v => {
    const matchesSearch = (v.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (v.phone || '').includes(searchTerm);
    const matchesType = visitorTypeFilter ? v.visitorType === visitorTypeFilter : true;
    return matchesSearch && matchesType;
  });

  const handleCheckOut = async (id, name) => {
    try {
      await dispatch(checkOutVisitor(id)).unwrap();
      showToast(`Visitor ${name} has checked out successfully.`);
      dispatch(fetchSecurityDashboard());
    } catch (err) {
      showToast(err || 'Check-out request failed.', 'error');
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
      header: 'Room Flat',
      key: 'hostResident.flatNumber',
      render: (val, row) => (
        <span className="text-sm text-primary-900 dark:text-slate-100 font-semibold">
          {row.block} - Flat {row.flatNumber}
        </span>
      ),
    },
    {
      header: 'Visitor Type',
      key: 'visitorType',
      render: (val) => <Badge variant="accent">{val}</Badge>,
    },
    {
      header: 'Purpose',
      key: 'purpose',
      render: (val) => <span className="text-xs text-primary-600 dark:text-slate-400">{val}</span>,
    },
    {
      header: 'Check-In Time',
      key: 'checkIn',
      render: (val) => (
        <span className="text-xs text-primary-500 dark:text-slate-400 flex items-center gap-1">
          <Clock size={12} className="text-emerald-600 dark:text-emerald-500" /> {val ? new Date(val).toLocaleTimeString() : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: '_id',
      render: (val, row) => (
        <Button size="xs" variant="outline" className="text-rose-400 border-rose-500/20 hover:bg-rose-500/10 whitespace-nowrap" onClick={() => handleCheckOut(row._id, row.name)}>
          <LogOut size={12} className="inline mr-1" /> Check Out
        </Button>
      ),
    },
  ];

  const historyColumns = [
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
      header: 'Room Flat',
      key: 'hostResident.flatNumber',
      render: (val, row) => (
        <span className="text-sm text-primary-900 dark:text-slate-100 font-semibold">
          {row.block} - Flat {row.flatNumber}
        </span>
      ),
    },
    {
      header: 'Visitor Type',
      key: 'visitorType',
      render: (val) => <Badge variant="gray">{val}</Badge>,
    },
    {
      header: 'Check-In',
      key: 'checkIn',
      render: (val) => (
        <span className="text-xs text-primary-500 dark:text-slate-400">
          {val ? new Date(val).toLocaleTimeString() : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Check-Out Time',
      key: 'checkOut',
      render: (val) => (
        <span className="text-xs font-semibold text-rose-600 dark:text-rose-500 flex items-center gap-1">
          <LogOut size={12} /> {val ? new Date(val).toLocaleTimeString() : 'N/A'}
        </span>
      ),
    },
  ];

  if (status === 'loading' && activeVisitors.length === 0) {
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
          <ShieldCheck className="text-emerald-600 dark:text-emerald-500" size={24} />
          Active Checked-In Visitors
        </h1>
        <p className="text-sm text-primary-500 dark:text-slate-400">Review all visitors currently present in the society compound and log check-out timestamps.</p>
      </div>

      {error && (
        <Alert variant="error" title="API Fetch Error">
          {error}
        </Alert>
      )}

      {/* Filters for Active Visitors */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-primary-200 dark:border-slate-800 items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-primary-200 dark:border-slate-700 rounded-lg text-sm bg-primary-50 dark:bg-slate-800 text-primary-900 dark:text-slate-100 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
            placeholder="Search active visitors by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex w-full sm:w-auto">
          <select
            className="border border-primary-200 dark:border-slate-700 rounded-lg text-sm py-2 px-3 bg-primary-50 dark:bg-slate-800 text-primary-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500 w-full"
            value={visitorTypeFilter}
            onChange={(e) => setVisitorTypeFilter(e.target.value)}
          >
            <option value="">All Visitor Types</option>
            <option value="Guest">Guest</option>
            <option value="Delivery">Delivery</option>
            <option value="Service">Service</option>
            <option value="Maid">Maid</option>
            <option value="Cab">Cab</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <Card className="p-0 overflow-hidden bg-white dark:bg-slate-900 border-primary-200 dark:border-slate-800">
        <Table
          columns={columns}
          data={filteredActiveVisitors}
          emptyMessage="No visitors currently checked in matching your criteria."
        />
      </Card>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-primary-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Calendar className="text-primary-400" size={18} />
          Recent Check-Outs & History
        </h2>
        <Card className="p-0 overflow-hidden bg-white dark:bg-slate-900 border-primary-200 dark:border-slate-800 opacity-80">
          <Table
            columns={historyColumns}
            data={visitorHistory || []}
            emptyMessage="No recent check-outs found."
          />
        </Card>
      </div>
    </div>
  );
};

export default SecurityActive;

