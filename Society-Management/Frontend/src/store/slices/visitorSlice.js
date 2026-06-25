import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import visitorService from '../../services/visitorService.js';

export const fetchSecurityDashboard = createAsyncThunk(
  'visitor/fetchSecurityDashboard',
  async (_, { rejectWithValue }) => {
    try {
      return await visitorService.getSecurityDashboard();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch security dashboard');
    }
  }
);

export const fetchResidentVisitors = createAsyncThunk(
  'visitor/fetchResidentVisitors',
  async (params, { rejectWithValue }) => {
    try {
      return await visitorService.getResidentVisitors(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch resident visitors log');
    }
  }
);

export const fetchAdminVisitorLogs = createAsyncThunk(
  'visitor/fetchAdminVisitorLogs',
  async (params, { rejectWithValue }) => {
    try {
      return await visitorService.getAdminVisitorLogs(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch admin visitors log');
    }
  }
);

export const registerVisitor = createAsyncThunk(
  'visitor/registerVisitor',
  async (formData, { rejectWithValue }) => {
    try {
      return await visitorService.createVisitor(formData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to register visitor');
    }
  }
);

export const updateVisitorStatus = createAsyncThunk(
  'visitor/updateVisitorStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await visitorService.updateVisitorStatus(id, status);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update visitor status');
    }
  }
);

export const checkInVisitor = createAsyncThunk(
  'visitor/checkInVisitor',
  async (id, { rejectWithValue }) => {
    try {
      return await visitorService.checkInVisitor(id);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to check-in visitor');
    }
  }
);

export const checkOutVisitor = createAsyncThunk(
  'visitor/checkOutVisitor',
  async (id, { rejectWithValue }) => {
    try {
      return await visitorService.checkOutVisitor(id);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to check-out visitor');
    }
  }
);

export const updateVisitor = createAsyncThunk(
  'visitor/updateVisitor',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      return await visitorService.updateVisitor(id, updateData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update visitor');
    }
  }
);

export const deleteVisitor = createAsyncThunk(
  'visitor/deleteVisitor',
  async (id, { rejectWithValue }) => {
    try {
      await visitorService.deleteVisitor(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete visitor');
    }
  }
);

const initialState = {
  activeVisitors: [],
  visitorHistory: [],
  logs: [],
  securityStats: null,
  status: 'idle',
  error: null,
  lastFetched: null,
};

const visitorSlice = createSlice({
  name: 'visitor',
  initialState,
  reducers: {
    resetVisitorStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch security dashboard
      .addCase(fetchSecurityDashboard.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSecurityDashboard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.activeVisitors = action.payload.activeVisitors || [];
        state.visitorHistory = action.payload.visitorHistory || [];
        state.securityStats = {
          todayCount: action.payload.todayCount || 0,
          activeCount: action.payload.activeCount || 0,
          pendingCount: action.payload.pendingCount || 0,
        };
        state.lastFetched = Date.now();
      })
      .addCase(fetchSecurityDashboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch resident visitors
      .addCase(fetchResidentVisitors.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchResidentVisitors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.logs = [
          ...(action.payload.activeRequests || []),
          ...(action.payload.history || [])
        ];
        state.lastFetched = Date.now();
      })
      .addCase(fetchResidentVisitors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch admin logs
      .addCase(fetchAdminVisitorLogs.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAdminVisitorLogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.logs = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchAdminVisitorLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Check in
      .addCase(checkInVisitor.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.activeVisitors.findIndex(v => v._id === action.payload._id);
        if (index !== -1) {
          state.activeVisitors[index] = action.payload;
        }
      })
      // Check out
      .addCase(checkOutVisitor.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.activeVisitors = state.activeVisitors.filter(v => v._id !== action.payload._id);
        if (state.securityStats) {
          state.securityStats.activeCount = Math.max(0, state.securityStats.activeCount - 1);
        }
      })
      // Optimistic Status Updates on Resident Panel
      .addCase(updateVisitorStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.logs = state.logs.filter(v => v._id !== action.payload._id);
      })
      // Update
      .addCase(updateVisitor.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (state.logs && Array.isArray(state.logs.logs)) {
          const index = state.logs.logs.findIndex(v => v._id === action.payload._id);
          if (index !== -1) {
            state.logs.logs[index] = action.payload;
          }
        } else if (state.logs && Array.isArray(state.logs)) {
          const index = state.logs.findIndex(v => v._id === action.payload._id);
          if (index !== -1) {
            state.logs[index] = action.payload;
          }
        }
      })
      // Delete
      .addCase(deleteVisitor.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (state.logs && Array.isArray(state.logs.logs)) {
          state.logs.logs = state.logs.logs.filter(v => v._id !== action.payload);
        } else if (state.logs && Array.isArray(state.logs)) {
          state.logs = state.logs.filter(v => v._id !== action.payload);
        }
      })
      .addMatcher(
        (action) => [registerVisitor.pending, checkInVisitor.pending, checkOutVisitor.pending, updateVisitorStatus.pending, updateVisitor.pending, deleteVisitor.pending].some(t => action.type === t.type),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        (action) => [registerVisitor.rejected, checkInVisitor.rejected, checkOutVisitor.rejected, updateVisitorStatus.rejected, updateVisitor.rejected, deleteVisitor.rejected].some(t => action.type === t.type),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export const { resetVisitorStatus } = visitorSlice.actions;
export default visitorSlice.reducer;
