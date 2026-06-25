import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api.js';

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { accessToken, user } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      return { user, accessToken };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      const validationErrors = error.response?.data?.errors || null;
      return rejectWithValue({ message, errors: validationErrors });
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      const validationErrors = error.response?.data?.errors || null;
      return rejectWithValue({ message, errors: validationErrors });
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Logout API failed, proceeding with local state wipe');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put('/auth/profile', userData);
      return response.data.data; // updatedUser object
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      return rejectWithValue({ message });
    }
  }
);

const storedToken = localStorage.getItem('accessToken');
const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

const initialState = {
  user: storedUser,
  isAuthenticated: !!storedToken && !!storedUser,
  loading: false,
  error: null,
  validationErrors: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthError: (state) => {
      state.error = null;
      state.validationErrors = null;
    },
    localLogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload.message;
        state.validationErrors = action.payload.errors;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.validationErrors = action.payload.errors;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { resetAuthError, localLogout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
