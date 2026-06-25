import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookingService from '../../services/bookingService.js';

export const fetchResidentBookings = createAsyncThunk(
  'booking/fetchResidentBookings',
  async (params, { rejectWithValue }) => {
    try {
      return await bookingService.getResidentBookings(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch bookings list');
    }
  }
);

export const fetchAdminBookings = createAsyncThunk(
  'booking/fetchAdminBookings',
  async (params, { rejectWithValue }) => {
    try {
      return await bookingService.getAdminBookings(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch bookings list');
    }
  }
);

export const fetchFacilityAnalytics = createAsyncThunk(
  'booking/fetchFacilityAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      return await bookingService.getFacilityUsageAnalytics();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch analytics');
    }
  }
);

export const updateBooking = createAsyncThunk(
  'booking/updateBooking',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      return await bookingService.updateBooking(id, updateData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update booking');
    }
  }
);

export const deleteBooking = createAsyncThunk(
  'booking/deleteBooking',
  async (id, { rejectWithValue }) => {
    try {
      await bookingService.deleteBooking(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete booking');
    }
  }
);

export const checkSlotAvailability = createAsyncThunk(
  'booking/checkSlotAvailability',
  async (params, { rejectWithValue }) => {
    try {
      return await bookingService.checkAvailability(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Slot availability check failed');
    }
  }
);

export const createFacilityBooking = createAsyncThunk(
  'booking/createFacilityBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      return await bookingService.createBooking(bookingData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to reserve facility booking');
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'booking/updateBookingStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await bookingService.approveOrRejectBooking(id, status);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update booking status');
    }
  }
);

export const cancelFacilityBooking = createAsyncThunk(
  'booking/cancelFacilityBooking',
  async (id, { rejectWithValue }) => {
    try {
      return await bookingService.cancelBooking(id);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to cancel facility reservation');
    }
  }
);

const initialState = {
  bookings: [],
  analytics: null,
  availability: null,
  status: 'idle',
  error: null,
  lastFetched: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    resetBookingStatus: (state) => {
      state.status = 'idle';
      state.error = null;
      state.availability = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch resident bookings
      .addCase(fetchResidentBookings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchResidentBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookings = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchResidentBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch admin bookings
      .addCase(fetchAdminBookings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAdminBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookings = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchAdminBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Analytics
      .addCase(fetchFacilityAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.analytics = action.payload;
        state.lastFetched = Date.now();
      })
      // Availability check
      .addCase(checkSlotAvailability.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.availability = action.payload;
      })
      // Booking creation
      .addCase(createFacilityBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookings.unshift(action.payload);
      })
      // Status update / Cancellation (optimistic updates)
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(cancelFacilityBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      // Update Booking
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      // Delete Booking
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookings = state.bookings.filter(b => b._id !== action.payload);
      })
      .addMatcher(
        (action) =>
          [
            checkSlotAvailability.pending,
            createFacilityBooking.pending,
            updateBookingStatus.pending,
            cancelFacilityBooking.pending,
            updateBooking.pending,
            deleteBooking.pending,
          ].some((t) => action.type === t.type),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          [
            checkSlotAvailability.rejected,
            createFacilityBooking.rejected,
            updateBookingStatus.rejected,
            cancelFacilityBooking.rejected,
            updateBooking.rejected,
            deleteBooking.rejected,
          ].some((t) => action.type === t.type),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export const { resetBookingStatus } = bookingSlice.actions;
export default bookingSlice.reducer;
