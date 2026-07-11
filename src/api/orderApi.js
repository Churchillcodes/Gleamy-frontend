import axiosInstance from './axiosInstance';

export const orderApi = {
  getAllOrders: async () => {
    const response = await axiosInstance.get('/orders');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await axiosInstance.post('/orders', orderData);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  cancelOrder: async (id) => {
    const response = await axiosInstance.patch(`/orders/${id}/cancel`);
    return response.data;
  }
};
