import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminBillingDashboard, createNewBillsBulk, triggerLateFeeCheck } from '../../store/slices/billingSlice.js';
import Card from '../../components/Card.jsx';
import Table from '../../components/Table.jsx';
import Badge from '../../components/Badge.jsx';
import Button from '../../components/Button.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import Alert from '../../components/Alert.jsx';
import { CreditCard, DollarSign, Calendar, RefreshCw, CheckCircle, Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext.jsx';
import PaymentModal from './PaymentModal.jsx';
import GenerateBillsModal from './GenerateBillsModal.jsx';
import EditBillModal from './EditBillModal.jsx';
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';

export const BillingAdmin = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { bills, dashboardStats, status, error } = useSelector((state) => state.billing);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchFilters = { 
      status: statusFilter || undefined,
      search: debouncedSearch || undefined
    };
    dispatch(fetchAdminBillingDashboard(fetchFilters));

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socket.on('bill_updated', () => {
      const fetchFilters = { 
        status: statusFilter || undefined,
        search: debouncedSearch || undefined
      };
      dispatch(fetchAdminBillingDashboard(fetchFilters));
    });

    return () => socket.disconnect();
  }, [dispatch, statusFilter, debouncedSearch]);

  const sortedBills = [...(bills || [])].sort((a, b) => {
    // Unpaid first (Pending, Overdue, Partially Paid)
    const aIsUnpaid = a.status !== 'Paid';
    const bIsUnpaid = b.status !== 'Paid';
    
    if (aIsUnpaid && !bIsUnpaid) return -1;
    if (!aIsUnpaid && bIsUnpaid) return 1;
    
    // Sort by due date (closest first)
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const handleBulkGenerate = () => {
    setGenerateModalOpen(true);
  };

  const handleLateFeeCalculator = async () => {
    const result = await dispatch(triggerLateFeeCheck());
    if (triggerLateFeeCheck.fulfilled.match(result)) {
      showToast('Successfully ran late penalty fee check!');
      dispatch(fetchAdminBillingDashboard({}));
    } else {
      showToast(result.payload || 'Failed to trigger penalty check', 'error');
    }
  };

  const openPaymentModal = (bill) => {
    setSelectedBill(bill);
    setPaymentModalOpen(true);
  };

  const openEditModal = (bill) => {
    setSelectedBill(bill);
    setEditModalOpen(true);
  };

  const handleDeleteBill = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this bill? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    });
    
    if (result.isConfirmed) {
      try {
        const { deleteBill } = await import('../../store/slices/billingSlice.js');
        const actionResult = await dispatch(deleteBill(id));
        if (deleteBill.fulfilled.match(actionResult)) {
          showToast('Bill deleted successfully!', 'success');
          dispatch(fetchAdminBillingDashboard({}));
        } else {
          showToast(actionResult.payload || 'Failed to delete bill', 'error');
        }
      } catch (err) {
        showToast('Error deleting bill', 'error');
      }
    }
  };

  const columns = [
    {
      header: 'Invoice Number',
      key: 'invoiceNumber',
      render: (val) => <span className="font-mono text-xs text-primary-600 dark:text-slate-300 font-semibold">{val}</span>,
    },
    {
      header: 'Resident',
      key: 'resident.name',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="text-sm text-primary-900 dark:text-slate-100 font-medium">{row.resident?.name || 'Resident'}</span>
          <span className="text-xs text-primary-500 dark:text-slate-400">Flat {row.resident?.flatNumber || ''}</span>
        </div>
      ),
    },
    {
      header: 'Billing Month',
      key: 'month',
      render: (val, row) => (
        <span className="text-xs text-primary-600 dark:text-slate-300">
          {new Date(row.year, row.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
      ),
    },
    {
      header: 'Amount',
      key: 'amount',
      render: (val) => <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">${val.toFixed(2)}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => {
        const variants = {
          Paid: 'success',
          Pending: 'warning',
          Overdue: 'error',
          'Partially Paid': 'accent',
        };
        return <Badge variant={variants[val] || 'gray'}>{val}</Badge>;
      },
    },
    {
      header: 'Due Date',
      key: 'dueDate',
      render: (val) => <span className="text-xs text-primary-500 dark:text-slate-400">{new Date(val).toLocaleDateString()}</span>,
    },
    {
      header: 'Actions',
      key: '_id',
      render: (val, row) => (
        <div className="flex justify-end gap-1.5">
          {row.status !== 'Paid' && (
            <Button size="xs" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 !px-2" onClick={() => openPaymentModal(row)} title="Pay">
              <CheckCircle size={13} />
            </Button>
          )}
          <Button size="xs" variant="outline" className="text-primary-600 border-primary-200 dark:border-slate-700 dark:text-slate-300 !px-2" onClick={() => openEditModal(row)} title="Edit">
            <Edit size={13} />
          </Button>
          <Button size="xs" variant="outline" className="text-red-600 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 !px-2" onClick={() => handleDeleteBill(row._id)} title="Delete">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton variant="card" className="h-28 bg-primary-50 dark:bg-slate-800" />
          <Skeleton variant="card" className="h-28 bg-primary-50 dark:bg-slate-800" />
          <Skeleton variant="card" className="h-28 bg-primary-50 dark:bg-slate-800" />
        </div>
        <Skeleton variant="card" className="h-96 bg-primary-50 dark:bg-slate-800" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <CreditCard className="text-accent-600 dark:text-accent-400" size={24} />
            Billing & Invoices Administration
          </h1>
          <p className="text-sm text-primary-500 dark:text-slate-400">Generate monthly society bills, collect payments, and track overdue penalizations.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={handleLateFeeCalculator} className="flex items-center gap-1.5">
            <RefreshCw size={14} /> Calculate Penalties
          </Button>
          <Button variant="primary" size="sm" onClick={handleBulkGenerate} className="flex items-center gap-1.5">
            <DollarSign size={14} /> Generate Bills
          </Button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-primary-200 dark:border-slate-800 items-center">
        <div className="relative flex-1 w-full xl:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-primary-200 dark:border-slate-700 rounded-lg text-sm bg-primary-50 dark:bg-slate-800 text-primary-900 dark:text-slate-100 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
            placeholder="Search by invoice number or resident name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto ml-auto">
          <select
            className="border border-primary-200 dark:border-slate-700 rounded-lg text-sm py-2 px-3 bg-primary-50 dark:bg-slate-800 text-primary-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500 flex-1 sm:flex-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
            <option value="Partially Paid">Partially Paid</option>
          </select>
          {statusFilter && (
             <button
               onClick={() => setStatusFilter('')}
               className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
             >
               Clear Filters
             </button>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="error" title="API Fetch Error">
          {error}
        </Alert>
      )}

      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex flex-col p-6 bg-white dark:bg-slate-900 border-primary-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-primary-500 dark:text-slate-400 tracking-wider uppercase">Collected Revenue</span>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">${dashboardStats.totalRevenue.toLocaleString()}</span>
          </Card>
          <Card className="flex flex-col p-6 bg-white dark:bg-slate-900 border-primary-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-primary-500 dark:text-slate-400 tracking-wider uppercase">Pending Invoices</span>
            <span className="text-2xl font-bold text-amber-500 dark:text-amber-400 mt-2">${dashboardStats.pendingAmount.toLocaleString()}</span>
          </Card>
          <Card className="flex flex-col p-6 bg-white dark:bg-slate-900 border-primary-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-primary-500 dark:text-slate-400 tracking-wider uppercase">Collection Rate</span>
            <span className="text-2xl font-bold text-accent-600 dark:text-accent-400 mt-2">{Math.round(dashboardStats.collectionRate)}%</span>
          </Card>
        </div>
      )}

      <Card className="p-0 overflow-hidden bg-white dark:bg-slate-900 border-primary-200 dark:border-slate-800">
        <Table
          columns={columns}
          data={sortedBills}
          emptyMessage="No invoices generated in database records."
        />
      </Card>

      <PaymentModal 
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        bill={selectedBill}
      />
      
      <GenerateBillsModal 
        isOpen={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
      />

      <EditBillModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        bill={selectedBill}
      />
    </div>
  );
};

export default BillingAdmin;

