import axiosInstance from './axios.js';

export const authService = {
  login: async (credentials) => {
    const res = await axiosInstance.post('/auth/login', credentials);
    return res.data.data;
  },

  register: async (userData) => {
    const res = await axiosInstance.post('/auth/register', userData);
    return res.data.data;
  },

  logout: async () => {
    const res = await axiosInstance.post('/auth/logout');
    return res.data;
  },

  forgotPassword: async (data) => {
    const res = await axiosInstance.post('/auth/forgot-password', data);
    return res.data;
  },

  resetPassword: async (data) => {
    const res = await axiosInstance.post('/auth/reset-password', data);
    return res.data;
  },

  verifyEmail: async (email, token) => {
    const res = await axiosInstance.get(
      `/auth/verify-email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`
    );
    return res.data;
  },

  changePassword: async (data) => {
    const res = await axiosInstance.post('/auth/change-password', data);
    return res.data;
  },
};

export default authService;
