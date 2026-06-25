import axiosInstance from './axios.js';

export const notificationService = {
  getFeed: async (params = {}) => {
    const res = await axiosInstance.get('/notifications', { params });
    return res.data.data;
  },

  getUnreadCount: async () => {
    const res = await axiosInstance.get('/notifications/unread-count');
    return res.data.data;
  },

  markRead: async (id) => {
    const res = await axiosInstance.put(`/notifications/${id}/read`);
    return res.data.data;
  },

  markAllRead: async () => {
    const res = await axiosInstance.put('/notifications/read-all');
    return res.data.data;
  },

  updatePreferences: async (preferences) => {
    const res = await axiosInstance.put('/notifications/preferences', preferences);
    return res.data.data;
  },
};

export default notificationService;
