import axiosInstance from './axios.js';

export const residentService = {
  createProfile: async (profileData) => {
    const res = await axiosInstance.post('/residents', profileData);
    return res.data.data;
  },

  getProfile: async (id = 'me') => {
    const res = await axiosInstance.get(`/residents/${id}`);
    return res.data.data;
  },

  updateProfile: async (id = 'me', formData) => {
    const isMultipart = formData instanceof FormData;
    const res = await axiosInstance.put(`/residents/${id}`, formData, {
      headers: {
        'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
      },
    });
    return res.data.data;
  },

  listResidents: async (params = {}) => {
    const res = await axiosInstance.get('/residents', { params });
    return res.data;
  },

  deleteProfile: async (id) => {
    const res = await axiosInstance.delete(`/residents/${id}`);
    return res.data.data;
  },

  addFamilyMember: async (id = 'me', memberData) => {
    const res = await axiosInstance.post(`/residents/${id}/family`, memberData);
    return res.data.data;
  },

  updateFamilyMember: async (id = 'me', familyId, memberData) => {
    const res = await axiosInstance.put(`/residents/${id}/family/${familyId}`, memberData);
    return res.data.data;
  },

  removeFamilyMember: async (id = 'me', familyId) => {
    const res = await axiosInstance.delete(`/residents/${id}/family/${familyId}`);
    return res.data.data;
  },

  addVehicle: async (id = 'me', vehicleData) => {
    const res = await axiosInstance.post(`/residents/${id}/vehicles`, vehicleData);
    return res.data.data;
  },

  updateVehicle: async (id = 'me', vehicleId, vehicleData) => {
    const res = await axiosInstance.put(`/residents/${id}/vehicles/${vehicleId}`, vehicleData);
    return res.data.data;
  },

  removeVehicle: async (id = 'me', vehicleId) => {
    const res = await axiosInstance.delete(`/residents/${id}/vehicles/${vehicleId}`);
    return res.data.data;
  },
};

export default residentService;
