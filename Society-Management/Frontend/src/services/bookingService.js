import axiosInstance from './axios.js';

export const bookingService = {
  getResidentBookings: async (params = {}) => {
    const res = await axiosInstance.get('/bookings/resident', { params });
    return res.data.data;
  },

  getAdminBookings: async (params = {}) => {
    const res = await axiosInstance.get('/bookings/admin', { params });
    return res.data.data;
  },

  getFacilityUsageAnalytics: async () => {
    const res = await axiosInstance.get('/bookings/admin/analytics');
    return res.data.data;
  },

  updateBooking: async (id, updateData) => {
    const res = await axiosInstance.put(`/bookings/${id}`, updateData);
    return res.data.data;
  },

  deleteBooking: async (id) => {
    const res = await axiosInstance.delete(`/bookings/${id}`);
    return res.data.data;
  },

  checkAvailability: async (params) => {
    const res = await axiosInstance.get('/bookings/check-availability', { params });
    return res.data.data;
  },

  createBooking: async (bookingData) => {
    const res = await axiosInstance.post('/bookings', bookingData);
    return res.data.data;
  },

  approveOrRejectBooking: async (id, status) => {
    const res = await axiosInstance.put(`/bookings/${id}/status`, { status });
    return res.data.data;
  },

  cancelBooking: async (id) => {
    const res = await axiosInstance.put(`/bookings/${id}/cancel`);
    return res.data.data;
  },
};

export default bookingService;
