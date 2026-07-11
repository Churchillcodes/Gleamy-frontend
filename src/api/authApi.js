import axiosInstance, { setAccessToken } from './axiosInstance';

export const authApi = {
  login: async (username, password) => {
    const response = await axiosInstance.post('/auth/login', { username, password });
    const { accessToken } = response.data;
    setAccessToken(accessToken);
    return response.data;
  },

  register: async (username, email, password) => {
    const response = await axiosInstance.post('/auth/register', { username, email, password });
    return response.data;
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      setAccessToken(null);
    }
  },

  refresh: async () => {
    const response = await axiosInstance.get('/auth/refresh');
    const { accessToken } = response.data;
    setAccessToken(accessToken);
    return response.data;
  }
};
