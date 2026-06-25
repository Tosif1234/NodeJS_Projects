import axiosInstance from './axios.js';

export const complaintService = {
  getResidentComplaints: async (params = {}) => {
    const res = await axiosInstance.get('/complaints/resident', { params });
    return res.data.data;
  },

  getMaintenanceDashboard: async (params = {}) => {
    const res = await axiosInstance.get('/complaints/maintenance', { params });
    return res.data.data;
  },

  getAdminComplaints: async (params = {}) => {
    const res = await axiosInstance.get('/complaints/admin', { params });
    return res.data.data;
  },

  getAdminAnalytics: async () => {
    const res = await axiosInstance.get('/complaints/admin/analytics');
    return res.data.data;
  },

  updateComplaint: async (id, updateData) => {
    const res = await axiosInstance.put(`/complaints/${id}`, updateData);
    return res.data.data;
  },

  deleteComplaint: async (id) => {
    const res = await axiosInstance.delete(`/complaints/${id}`);
    return res.data.data;
  },

  getMaintenanceStaff: async () => {
    const res = await axiosInstance.get('/complaints/staff');
    return res.data.data;
  },


  createComplaint: async (formData) => {
    const isMultipart = formData instanceof FormData;
    const res = await axiosInstance.post('/complaints', formData, {
      headers: {
        'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
      },
    });
    return res.data.data;
  },

  assignComplaint: async (id, staffId) => {
    const res = await axiosInstance.put(`/complaints/${id}/assign`, { assignedTo: staffId });
    return res.data.data;
  },

  updateComplaintStatus: async (id, data) => {
    const res = await axiosInstance.put(`/complaints/${id}/status`, data);
    return res.data.data;
  },

  addComment: async (id, commentText) => {
    const res = await axiosInstance.post(`/complaints/${id}/comments`, { text: commentText });
    return res.data.data;
  },
};

export default complaintService;
