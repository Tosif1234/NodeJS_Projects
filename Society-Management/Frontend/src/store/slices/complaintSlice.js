import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import complaintService from '../../services/complaintService.js';

export const fetchResidentComplaints = createAsyncThunk(
  'complaint/fetchResidentComplaints',
  async (params, { rejectWithValue }) => {
    try {
      return await complaintService.getResidentComplaints(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch complaints');
    }
  }
);

export const fetchMaintenanceDashboard = createAsyncThunk(
  'complaint/fetchMaintenanceDashboard',
  async (params, { rejectWithValue }) => {
    try {
      return await complaintService.getMaintenanceDashboard(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch assigned tasks');
    }
  }
);

export const fetchAdminComplaints = createAsyncThunk(
  'complaint/fetchAdminComplaints',
  async (params, { rejectWithValue }) => {
    try {
      return await complaintService.getAdminComplaints(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch admin complaints');
    }
  }
);

export const fetchAdminAnalytics = createAsyncThunk(
  'complaint/fetchAdminAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      return await complaintService.getAdminAnalytics();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch complaints analytics');
    }
  }
);

export const updateComplaint = createAsyncThunk(
  'complaint/updateComplaint',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      return await complaintService.updateComplaint(id, updateData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update complaint');
    }
  }
);

export const deleteComplaint = createAsyncThunk(
  'complaint/deleteComplaint',
  async (id, { rejectWithValue }) => {
    try {
      await complaintService.deleteComplaint(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete complaint');
    }
  }
);

export const fetchMaintenanceStaff = createAsyncThunk(
  'complaint/fetchMaintenanceStaff',
  async (_, { rejectWithValue }) => {
    try {
      return await complaintService.getMaintenanceStaff();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch maintenance staff');
    }
  }
);


export const createComplaint = createAsyncThunk(
  'complaint/createComplaint',
  async (formData, { rejectWithValue }) => {
    try {
      return await complaintService.createComplaint(formData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create complaint');
    }
  }
);

export const assignComplaint = createAsyncThunk(
  'complaint/assignComplaint',
  async ({ id, staffId }, { rejectWithValue }) => {
    try {
      return await complaintService.assignComplaint(id, staffId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to assign complaint');
    }
  }
);

export const updateComplaintStatus = createAsyncThunk(
  'complaint/updateComplaintStatus',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await complaintService.updateComplaintStatus(id, data);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update complaint status');
    }
  }
);

export const addComplaintComment = createAsyncThunk(
  'complaint/addComment',
  async ({ id, text }, { rejectWithValue }) => {
    try {
      return await complaintService.addComment(id, text);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to submit comment');
    }
  }
);

const initialState = {
  complaints: [],
  analytics: null,
  maintenanceStaff: [],
  status: 'idle',
  error: null,
  lastFetched: null,
};

const complaintSlice = createSlice({
  name: 'complaint',
  initialState,
  reducers: {
    resetComplaintStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch list cases
      .addCase(fetchResidentComplaints.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchResidentComplaints.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.complaints = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchResidentComplaints.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchMaintenanceDashboard.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMaintenanceDashboard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { activeWork = [], resolvedWork = [] } = action.payload || {};
        state.complaints = [...activeWork, ...resolvedWork];
        state.lastFetched = Date.now();
      })
      .addCase(fetchMaintenanceDashboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchAdminComplaints.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAdminComplaints.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.complaints = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchAdminComplaints.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch analytics cases
      .addCase(fetchAdminAnalytics.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAdminAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.analytics = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchAdminAnalytics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch maintenance staff cases
      .addCase(fetchMaintenanceStaff.pending, (state) => {
        // Not setting status to 'loading' here to avoid full page loaders just for a dropdown,
        // but we could if we wanted a specific loading state.
      })
      .addCase(fetchMaintenanceStaff.fulfilled, (state, action) => {
        state.maintenanceStaff = action.payload;
      })
      .addCase(fetchMaintenanceStaff.rejected, (state, action) => {
        // Optional error handling for this specific fetch
      })
      // Optimistic updates
      .addCase(updateComplaintStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.complaints.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.complaints[index] = action.payload;
        }
      })
      .addCase(assignComplaint.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.complaints.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.complaints[index] = action.payload;
        }
      })
      .addCase(addComplaintComment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.complaints.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.complaints[index] = action.payload;
        }
      })
      .addCase(updateComplaint.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.complaints.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.complaints[index] = action.payload;
        }
      })
      .addCase(deleteComplaint.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.complaints = state.complaints.filter(c => c._id !== action.payload);
      })
      .addMatcher(
        (action) => [createComplaint.pending, assignComplaint.pending, updateComplaintStatus.pending, addComplaintComment.pending, updateComplaint.pending, deleteComplaint.pending].some(t => action.type === t.type),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        (action) => [createComplaint.rejected, assignComplaint.rejected, updateComplaintStatus.rejected, addComplaintComment.rejected, updateComplaint.rejected, deleteComplaint.rejected].some(t => action.type === t.type),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export const { resetComplaintStatus } = complaintSlice.actions;
export default complaintSlice.reducer;
