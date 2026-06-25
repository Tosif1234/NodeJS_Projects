import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResidentBills, payInvoice } from '../../store/slices/billingSlice.js';
import Card from '../../components/Card.jsx';
import Table from '../../components/Table.jsx';
import Badge from '../../components/Badge.jsx';
import Button from '../../components/Button.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import Alert from '../../components/Alert.jsx';
import { CreditCard, DollarSign, Clock, CheckCircle, LayoutGrid, List as ListIcon, Filter, ChevronDown } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext.jsx';
import ResidentPaymentModal from './ResidentPaymentModal.jsx';
import { io } from 'socket.io-client';

export const BillingResident = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { bills, status, error } = useSelector((state) => state.billing);
  const [viewMode, setViewMode] = useState('list');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    dispatch(fetchResidentBills({}));

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socket.on('bill_updated', () => {
      dispatch(fetchResidentBills({}));
    });

    return () => socket.disconnect();
  }, [dispatch]);

  const openPaymentModal = (bill) => {
    setSelectedBill(bill);
    setPaymentModalOpen(true);
  };

  const columns = [
    {
      header: 'Invoice Number',
      key: 'invoiceNumber',
      render: (val) => <span className="font-mono text-xs text-primary-600 dark:text-slate-300 font-semibold">{val}</span>,
    },
    {
      header: 'Billing Cycle',
      key: 'month',
      render: (val, row) => (
        <span className="text-xs text-primary-600 dark:text-slate-300">
          {new Date(row.year, row.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
      ),
    },
    {
      header: 'Amount Due',
      key: 'amount',
      render: (val) => <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">${val.toFixed(2)}</span>,
    },
    {
      header: 'Due Date',
      key: 'dueDate',
      render: (val) => <span className="text-xs text-primary-500 dark:text-slate-400">{new Date(val).toLocaleDateString()}</span>,
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
      header: 'Action',
      key: '_id',
      render: (val, row) => {
        if (row.status === 'Paid') {
          return (
            <span className="text-xs text-emerald-600 flex items-center gap-1">
              <CheckCircle size={13} /> Cleared
            </span>
          );
        }
        return (
          <Button size="xs" variant="primary" onClick={() => openPaymentModal(row)}>
            Pay Now
          </Button>
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

  const filteredBills = (bills || []).filter(bill => {
    return statusFilter === 'All' || bill.status === statusFilter;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-900 dark:text-white tracking-tight flex items-center gap-2">
            <CreditCard className="text-accent-600" size={24} />
            My Invoices & Bills
          </h1>
          <p className="text-sm text-primary-500 dark:text-slate-400">View and settle your housing maintenance assessments and penalties.</p>
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
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
            <option value="Partially Paid">Partially Paid</option>
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
            data={filteredBills}
            emptyMessage="No billing records match your current filters."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBills.length > 0 ? (
            filteredBills.map((bill) => (
              <Card key={bill._id} className="p-5 border-slate-200 dark:border-slate-800 ring-1 ring-slate-100 dark:ring-slate-800/50 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">${bill.amount.toFixed(2)}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(bill.year, bill.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <Badge variant={bill.status === 'Paid' ? 'success' : bill.status === 'Pending' ? 'warning' : bill.status === 'Overdue' ? 'error' : 'accent'}>
                    {bill.status}
                  </Badge>
                </div>
                
                <div className="flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Invoice No</span> 
                    <span className="font-mono text-xs text-primary-600 dark:text-primary-400 font-semibold">{bill.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-2">
                    <span className="text-xs">Due Date</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200 text-xs">{new Date(bill.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  {bill.status === 'Paid' ? (
                    <span className="text-xs text-emerald-600 flex items-center gap-1">
                      <CheckCircle size={13} /> Cleared
                    </span>
                  ) : (
                    <Button size="xs" variant="primary" onClick={() => openPaymentModal(bill)}>
                      Pay Now
                    </Button>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl mb-4">
                  <DollarSign size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No invoices found</h3>
                <p className="text-slate-500 mt-1 max-w-sm">No billing records match your current filters.</p>
              </Card>
            </div>
          )}
        </div>
      )}

      <ResidentPaymentModal 
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        bill={selectedBill}
      />
    </div>
  );
};

export default BillingResident;

