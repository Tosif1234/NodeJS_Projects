import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import pollService from '../../services/pollService.js';

export const fetchPollsList = createAsyncThunk(
  'poll/fetchPollsList',
  async (params, { rejectWithValue }) => {
    try {
      return await pollService.listPolls(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch polls list');
    }
  }
);

export const fetchPollDetails = createAsyncThunk(
  'poll/fetchPollDetails',
  async (id, { rejectWithValue }) => {
    try {
      return await pollService.getDetails(id);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch poll details');
    }
  }
);

export const createNewPoll = createAsyncThunk(
  'poll/createNewPoll',
  async (pollData, { rejectWithValue }) => {
    try {
      return await pollService.createPoll(pollData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create poll');
    }
  }
);

export const submitPollVote = createAsyncThunk(
  'poll/submitPollVote',
  async ({ id, optionId }, { rejectWithValue }) => {
    try {
      return await pollService.votePoll(id, optionId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to register your vote');
    }
  }
);

export const deleteExistingPoll = createAsyncThunk(
  'poll/deleteExistingPoll',
  async (id, { rejectWithValue }) => {
    try {
      await pollService.deletePoll(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete poll');
    }
  }
);

export const fetchPollAnalytics = createAsyncThunk(
  'poll/fetchPollAnalytics',
  async (id, { rejectWithValue }) => {
    try {
      return await pollService.getAnalytics(id);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch poll analytics');
    }
  }
);

const initialState = {
  polls: [],
  currentPoll: null,
  analytics: null,
  status: 'idle',
  error: null,
  lastFetched: null,
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    resetPollStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchPollsList.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPollsList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.polls = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchPollsList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch details
      .addCase(fetchPollDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentPoll = action.payload;
      })
      // Analytics
      .addCase(fetchPollAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.analytics = action.payload;
      })
      // Vote (updates detail view and list view)
      .addCase(submitPollVote.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentPoll = action.payload;
        const index = state.polls.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.polls[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteExistingPoll.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.polls = state.polls.filter((p) => p._id !== action.payload);
      })
      .addMatcher(
        (action) =>
          [
            fetchPollDetails.pending,
            createNewPoll.pending,
            submitPollVote.pending,
            deleteExistingPoll.pending,
            fetchPollAnalytics.pending,
          ].some((t) => action.type === t.type),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          [
            fetchPollDetails.rejected,
            createNewPoll.rejected,
            submitPollVote.rejected,
            deleteExistingPoll.rejected,
            fetchPollAnalytics.rejected,
          ].some((t) => action.type === t.type),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export const { resetPollStatus } = pollSlice.actions;
export default pollSlice.reducer;
