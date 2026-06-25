import axiosInstance from './axios.js';

export const visitorService = {
  getSecurityDashboard: async () => {
    const res = await axiosInstance.get('/visitors/security-dashboard');
    return res.data.data;
  },

  getResidentVisitors: async (params = {}) => {
    const res = await axiosInstance.get('/visitors/resident-log', { params });
    return res.data.data;
  },

  getAdminVisitorLogs: async (params = {}) => {
    const res = await axiosInstance.get('/visitors/admin-log', { params });
    return res.data.data;
  },

  createVisitor: async (formData) => {
    const isMultipart = formData instanceof FormData;
    const res = await axiosInstance.post('/visitors', formData, {
      headers: {
        'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
      },
    });
    return res.data.data;
  },

  updateVisitorStatus: async (id, status) => {
    const res = await axiosInstance.put(`/visitors/${id}/status`, { status });
    return res.data.data;
  },

  checkInVisitor: async (id) => {
    const res = await axiosInstance.put(`/visitors/${id}/check-in`);
    return res.data.data;
  },

  checkOutVisitor: async (id) => {
    const res = await axiosInstance.put(`/visitors/${id}/check-out`);
    return res.data.data;
  },

  updateVisitor: async (id, updateData) => {
    const res = await axiosInstance.put(`/visitors/${id}`, updateData);
    return res.data.data;
  },

  deleteVisitor: async (id) => {
    const res = await axiosInstance.delete(`/visitors/${id}`);
    return res.data.data;
  },
};

export default visitorService;
