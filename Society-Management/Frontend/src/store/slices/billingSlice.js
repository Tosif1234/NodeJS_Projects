import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import billingService from '../../services/billingService.js';

export const fetchResidentBills = createAsyncThunk(
  'billing/fetchResidentBills',
  async (params, { rejectWithValue }) => {
    try {
      return await billingService.getResidentBills(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch invoices');
    }
  }
);

export const fetchAdminBillingDashboard = createAsyncThunk(
  'billing/fetchAdminBillingDashboard',
  async (params, { rejectWithValue }) => {
    try {
      return await billingService.getAdminBillingDashboard(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch billing dashboard');
    }
  }
);

export const createNewBill = createAsyncThunk(
  'billing/createNewBill',
  async (billData, { rejectWithValue }) => {
    try {
      return await billingService.createBill(billData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create bill');
    }
  }
);

export const createNewBillsBulk = createAsyncThunk(
  'billing/createNewBillsBulk',
  async (bulkData, { rejectWithValue }) => {
    try {
      return await billingService.createBillsBulk(bulkData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to run bulk bill generation');
    }
  }
);

export const payInvoice = createAsyncThunk(
  'billing/payInvoice',
  async ({ id, paymentData }, { rejectWithValue }) => {
    try {
      return await billingService.recordPayment(id, paymentData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to record invoice payment');
    }
  }
);

export const triggerLateFeeCheck = createAsyncThunk(
  'billing/triggerLateFeeCheck',
  async (_, { rejectWithValue }) => {
    try {
      return await billingService.runLateFeeCheck();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to calculate late fees');
    }
  }
);

export const updateBill = createAsyncThunk(
  'billing/updateBill',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      return await billingService.updateBill(id, updateData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update bill');
    }
  }
);

export const deleteBill = createAsyncThunk(
  'billing/deleteBill',
  async (id, { rejectWithValue }) => {
    try {
      await billingService.deleteBill(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete bill');
    }
  }
);

const initialState = {
  bills: [],
  dashboardStats: null,
  status: 'idle',
  error: null,
  lastFetched: null,
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    resetBillingStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch resident bills
      .addCase(fetchResidentBills.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchResidentBills.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bills = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchResidentBills.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch admin dashboard
      .addCase(fetchAdminBillingDashboard.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAdminBillingDashboard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bills = action.payload.bills || [];
        state.dashboardStats = {
          totalRevenue: action.payload.totalRevenue || 0,
          pendingAmount: action.payload.pendingAmount || 0,
          collectionRate: action.payload.collectionRate || 0,
          overdueCount: action.payload.overdueCount || 0,
          revenueTrends: action.payload.revenueTrends || [],
        };
        state.lastFetched = Date.now();
      })
      .addCase(fetchAdminBillingDashboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Pay invoice
      .addCase(payInvoice.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.bills.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.bills[index] = action.payload;
        }
      })
      // Update bill
      .addCase(updateBill.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.bills.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.bills[index] = action.payload;
        }
      })
      // Delete bill
      .addCase(deleteBill.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bills = state.bills.filter(b => b._id !== action.payload);
      })
      .addMatcher(
        (action) => [createNewBill.pending, createNewBillsBulk.pending, payInvoice.pending, triggerLateFeeCheck.pending, updateBill.pending, deleteBill.pending].some(t => action.type === t.type),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        (action) => [createNewBill.rejected, createNewBillsBulk.rejected, payInvoice.rejected, triggerLateFeeCheck.rejected, updateBill.rejected, deleteBill.rejected].some(t => action.type === t.type),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export const { resetBillingStatus } = billingSlice.actions;
export default billingSlice.reducer;
