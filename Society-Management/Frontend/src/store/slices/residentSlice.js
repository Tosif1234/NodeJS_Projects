import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import residentService from '../../services/residentService.js';

export const createProfile = createAsyncThunk(
  'resident/createProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      return await residentService.createProfile(profileData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create profile');
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'resident/fetchProfile',
  async (id, { rejectWithValue }) => {
    try {
      return await residentService.getProfile(id);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'resident/updateProfile',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      return await residentService.updateProfile(id, formData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

export const fetchResidentsList = createAsyncThunk(
  'resident/fetchResidentsList',
  async (params, { rejectWithValue }) => {
    try {
      return await residentService.listResidents(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch residents list');
    }
  }
);

export const deleteResidentProfile = createAsyncThunk(
  'resident/deleteProfile',
  async (id, { rejectWithValue }) => {
    try {
      await residentService.deleteProfile(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete profile');
    }
  }
);

export const addFamilyMember = createAsyncThunk(
  'resident/addFamilyMember',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await residentService.addFamilyMember(id, data);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add family member');
    }
  }
);

export const removeFamilyMember = createAsyncThunk(
  'resident/removeFamilyMember',
  async ({ id, familyId }, { rejectWithValue }) => {
    try {
      return await residentService.removeFamilyMember(id, familyId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove family member');
    }
  }
);

export const addVehicle = createAsyncThunk(
  'resident/addVehicle',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await residentService.addVehicle(id, data);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add vehicle');
    }
  }
);

export const removeVehicle = createAsyncThunk(
  'resident/removeVehicle',
  async ({ id, vehicleId }, { rejectWithValue }) => {
    try {
      return await residentService.removeVehicle(id, vehicleId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove vehicle');
    }
  }
);

export const updateFamilyMember = createAsyncThunk(
  'resident/updateFamilyMember',
  async ({ id, familyId, data }, { rejectWithValue }) => {
    try {
      return await residentService.updateFamilyMember(id, familyId, data);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update family member');
    }
  }
);

export const updateVehicle = createAsyncThunk(
  'resident/updateVehicle',
  async ({ id, vehicleId, data }, { rejectWithValue }) => {
    try {
      return await residentService.updateVehicle(id, vehicleId, data);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update vehicle');
    }
  }
);

const initialState = {
  profile: null,
  residentsList: [],
  status: 'idle',
  error: null,
  lastFetched: null,
};

const residentSlice = createSlice({
  name: 'resident',
  initialState,
  reducers: {
    resetResidentStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Create profile
      .addCase(createProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch residents list
      .addCase(fetchResidentsList.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchResidentsList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.residentsList = action.payload.data;
        state.lastFetched = Date.now();
      })
      .addCase(fetchResidentsList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Delete resident
      .addCase(deleteResidentProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteResidentProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.residentsList = state.residentsList.filter(r => r.user?._id !== action.payload);
      })
      .addCase(deleteResidentProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Add/Remove family/vehicles (updates profile inline)
      .addMatcher(
        (action) =>
          [
            addFamilyMember.fulfilled,
            removeFamilyMember.fulfilled,
            updateFamilyMember.fulfilled,
            addVehicle.fulfilled,
            removeVehicle.fulfilled,
            updateVehicle.fulfilled,
          ].some((t) => action.type === t.type),
        (state, action) => {
          state.status = 'succeeded';
          if (state.profile) {
            if (action.type.includes('Family')) {
              state.profile.familyMembers = action.payload;
            } else if (action.type.includes('Vehicle')) {
              state.profile.vehicles = action.payload;
            }
          }
        }
      )
      .addMatcher(
        (action) =>
          [
            addFamilyMember.pending,
            removeFamilyMember.pending,
            updateFamilyMember.pending,
            addVehicle.pending,
            removeVehicle.pending,
            updateVehicle.pending,
          ].some((t) => action.type === t.type),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          [
            addFamilyMember.rejected,
            removeFamilyMember.rejected,
            updateFamilyMember.rejected,
            addVehicle.rejected,
            removeVehicle.rejected,
            updateVehicle.rejected,
          ].some((t) => action.type === t.type),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export const { resetResidentStatus } = residentSlice.actions;
export default residentSlice.reducer;
