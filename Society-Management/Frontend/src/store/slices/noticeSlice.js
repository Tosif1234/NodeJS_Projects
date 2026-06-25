import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import noticeService from '../../services/noticeService.js';

export const fetchNoticeFeed = createAsyncThunk(
  'notice/fetchNoticeFeed',
  async (params, { rejectWithValue }) => {
    try {
      return await noticeService.getFeed(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch notice board announcements');
    }
  }
);

export const fetchAdminNotices = createAsyncThunk(
  'notice/fetchAdminNotices',
  async (params, { rejectWithValue }) => {
    try {
      return await noticeService.getAdminList(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch notice list');
    }
  }
);

export const createNewNotice = createAsyncThunk(
  'notice/createNewNotice',
  async (formData, { rejectWithValue }) => {
    try {
      return await noticeService.createNotice(formData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create notice');
    }
  }
);

export const updateExistingNotice = createAsyncThunk(
  'notice/updateExistingNotice',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      return await noticeService.updateNotice(id, formData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update notice');
    }
  }
);

export const publishExistingNotice = createAsyncThunk(
  'notice/publishExistingNotice',
  async (id, { rejectWithValue }) => {
    try {
      return await noticeService.publishNotice(id);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to publish notice');
    }
  }
);

export const deleteExistingNotice = createAsyncThunk(
  'notice/deleteExistingNotice',
  async (id, { rejectWithValue }) => {
    try {
      await noticeService.deleteNotice(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete notice');
    }
  }
);

export const markNoticeRead = createAsyncThunk(
  'notice/markNoticeRead',
  async (id, { rejectWithValue }) => {
    try {
      return await noticeService.markRead(id);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to mark notice as read');
    }
  }
);

const initialState = {
  feed: [],
  adminNotices: [],
  status: 'idle',
  error: null,
  lastFetched: null,
};

const noticeSlice = createSlice({
  name: 'notice',
  initialState,
  reducers: {
    resetNoticeStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch feed
      .addCase(fetchNoticeFeed.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchNoticeFeed.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.feed = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchNoticeFeed.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch admin notices
      .addCase(fetchAdminNotices.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAdminNotices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.adminNotices = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchAdminNotices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Mark Read
      .addCase(markNoticeRead.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.feed.findIndex((n) => n._id === action.payload._id);
        if (index !== -1) {
          state.feed[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteExistingNotice.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.adminNotices = state.adminNotices.filter((n) => n._id !== action.payload);
      })
      .addMatcher(
        (action) =>
          [
            createNewNotice.pending,
            updateExistingNotice.pending,
            publishExistingNotice.pending,
            deleteExistingNotice.pending,
            markNoticeRead.pending,
          ].some((t) => action.type === t.type),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          [
            createNewNotice.rejected,
            updateExistingNotice.rejected,
            publishExistingNotice.rejected,
            deleteExistingNotice.rejected,
            markNoticeRead.rejected,
          ].some((t) => action.type === t.type),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export const { resetNoticeStatus } = noticeSlice.actions;
export default noticeSlice.reducer;
