import axiosInstance from './axiosInstance';

export const productApi = {
  // Public
  getAllProducts: async () => {
    const response = await axiosInstance.get('/products');
    return response.data; // Raw array of active products
  },

  getProductById: async (id) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  // Admin
  getArchivedProducts: async () => {
    const response = await axiosInstance.get('/products/archived');
    return response.data;
  },

  getLowStockProducts: async (threshold = 5) => {
    const response = await axiosInstance.get(`/products/low-stock?threshold=${threshold}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await axiosInstance.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await axiosInstance.patch(`/products/${id}`, productData);
    return response.data;
  },

  archiveProduct: async (id) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  },

  restoreProduct: async (id) => {
    const response = await axiosInstance.patch(`/products/${id}/restore`);
    return response.data;
  },

  increaseStock: async (id, quantity) => {
    const response = await axiosInstance.patch(`/products/${id}/increase-stock`, { quantity });
    return response.data;
  },

  reduceStock: async (id, quantity) => {
    const response = await axiosInstance.patch(`/products/${id}/reduce-stock`, { quantity });
    return response.data;
  },

  uploadImages: async (id, formData) => {
    // formData must contain files in key 'images'
    const response = await axiosInstance.post(`/products/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteImage: async (productId, imageId) => {
    const response = await axiosInstance.delete(`/products/${productId}/images/${imageId}`);
    return response.data;
  }
};
