import axiosInstance from './axiosInstance';

export const dashboardApi = {
  getSummary: async () => {
    const response = await axiosInstance.get('/dashboard/summary');
    return response.data;
  },

  getRevenue: async () => {
    const response = await axiosInstance.get('/dashboard/revenue');
    return response.data;
  }
};
