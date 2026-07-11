import axiosInstance from './axiosInstance';

export const salesApi = {
  getAllSales: async () => {
    const response = await axiosInstance.get('/sales');
    return response.data;
  },

  getSaleById: async (id) => {
    const response = await axiosInstance.get(`/sales/${id}`);
    return response.data;
  },

  getTopProducts: async () => {
    const response = await axiosInstance.get('/sales/analytics/top-products');
    return response.data;
  },

  getRevenueTrends: async () => {
    const response = await axiosInstance.get('/sales/analytics/revenue-trends');
    return response.data;
  },

  getSalesBreakdown: async () => {
    const response = await axiosInstance.get('/sales/analytics/sales-breakdown');
    return response.data;
  },

  getCustomerHistory: async (phone) => {
    const response = await axiosInstance.get(`/sales/analytics/customer-history?phone=${phone}`);
    return response.data;
  }
};
