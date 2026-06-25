import axiosInstance from './axios.js';

export const billingService = {
  getResidentBills: async (params = {}) => {
    const res = await axiosInstance.get('/billing/resident', { params });
    return res.data.data;
  },

  getAdminBillingDashboard: async (params = {}) => {
    const res = await axiosInstance.get('/billing/admin', { params });
    return res.data.data;
  },

  createBill: async (data) => {
    const res = await axiosInstance.post('/billing', data);
    return res.data.data;
  },

  createBillsBulk: async (data) => {
    const res = await axiosInstance.post('/billing/bulk', data);
    return res.data.data;
  },

  recordPayment: async (id, paymentData) => {
    const res = await axiosInstance.put(`/billing/${id}/pay`, paymentData);
    return res.data.data;
  },

  runLateFeeCheck: async () => {
    const res = await axiosInstance.post('/billing/late-fee-check');
    return res.data.data;
  },

  updateBill: async (id, updateData) => {
    const res = await axiosInstance.put(`/billing/${id}`, updateData);
    return res.data.data;
  },

  deleteBill: async (id) => {
    const res = await axiosInstance.delete(`/billing/${id}`);
    return res.data.data;
  },

  downloadInvoicePdf: async (id) => {
    const response = await axiosInstance.get(`/billing/${id}/invoice-pdf`, {
      responseType: 'blob',
    });
    
    // Create download URL
    const file = new Blob([response.data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = fileURL;
    link.setAttribute('download', `invoice-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(fileURL);
  },
};

export default billingService;
