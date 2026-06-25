import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from '../../services/notificationService.js';

export const fetchNotificationsFeed = createAsyncThunk(
  'notification/fetchFeed',
  async (params, { rejectWithValue }) => {
    try {
      return await notificationService.getFeed(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch notifications feed');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notification/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      return await notificationService.getUnreadCount();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch unread count');
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'notification/markRead',
  async (id, { rejectWithValue }) => {
    try {
      return await notificationService.markRead(id);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to mark notification as read');
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  'notification/markAllRead',
  async (_, { rejectWithValue }) => {
    try {
      return await notificationService.markAllRead();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to clear all notifications');
    }
  }
);

const initialState = {
  feed: [],
  unreadCount: 0,
  status: 'idle',
  error: null,
  lastFetched: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    resetNotificationStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch feed
      .addCase(fetchNotificationsFeed.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchNotificationsFeed.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.feed = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchNotificationsFeed.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      // Mark read (optimistic update to count and list)
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.feed.findIndex((n) => n._id === action.payload._id);
        if (index !== -1) {
          state.feed[index] = action.payload;
        }
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      })
      // Mark all read
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.status = 'succeeded';
        state.feed = state.feed.map((n) => ({ ...n, isRead: true }));
        state.unreadCount = 0;
      });
  },
});

export const { resetNotificationStatus } = notificationSlice.actions;
export default notificationSlice.reducer;
