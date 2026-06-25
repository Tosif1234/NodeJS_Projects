import axiosInstance from './axios.js';

export const pollService = {
  listPolls: async (params = {}) => {
    const res = await axiosInstance.get('/polls', { params });
    return res.data.data;
  },

  createPoll: async (pollData) => {
    const res = await axiosInstance.post('/polls', pollData);
    return res.data.data;
  },

  getDetails: async (id) => {
    const res = await axiosInstance.get(`/polls/${id}`);
    return res.data.data;
  },

  votePoll: async (id, optionId) => {
    const res = await axiosInstance.post(`/polls/${id}/vote`, { optionIds: [optionId] });
    return res.data.data;
  },

  deletePoll: async (id) => {
    const res = await axiosInstance.delete(`/polls/${id}`);
    return res.data.data;
  },

  getAnalytics: async (id) => {
    const res = await axiosInstance.get(`/polls/${id}/analytics`);
    return res.data.data;
  },
};

export default pollService;
