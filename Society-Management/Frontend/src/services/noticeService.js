import axiosInstance from './axios.js';

export const noticeService = {
  getFeed: async (params = {}) => {
    const res = await axiosInstance.get('/notices/feed', { params });
    return res.data.data;
  },

  getAdminList: async (params = {}) => {
    const res = await axiosInstance.get('/notices/admin', { params });
    return res.data.data;
  },

  createNotice: async (formData) => {
    const isMultipart = formData instanceof FormData;
    const res = await axiosInstance.post('/notices', formData, {
      headers: {
        'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
      },
    });
    return res.data.data;
  },

  updateNotice: async (id, formData) => {
    const isMultipart = formData instanceof FormData;
    const res = await axiosInstance.put(`/notices/${id}`, formData, {
      headers: {
        'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
      },
    });
    return res.data.data;
  },

  publishNotice: async (id) => {
    const res = await axiosInstance.put(`/notices/${id}/publish`);
    return res.data.data;
  },

  deleteNotice: async (id) => {
    const res = await axiosInstance.delete(`/notices/${id}`);
    return res.data.data;
  },

  markRead: async (id) => {
    const res = await axiosInstance.put(`/notices/${id}/read`);
    return res.data.data;
  },
};

export default noticeService;
