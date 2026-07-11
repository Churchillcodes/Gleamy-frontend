import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

let accessToken = null;
let refreshSubscribers = [];
let isRefreshing = false;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => {
  return accessToken;
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for HTTP-only cookies (refresh token)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach bearer token to authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    if (accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Subscribe to token refreshes
const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

// Notify subscribers with new token
const onRefreshed = (token) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

// Response Interceptor: Handle 403 Forbidden (typical for expired access tokens)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const originalRequest = config;

    // If 403 and has not been retried yet (avoid infinite loop)
    // Note: Skip refreshing if it is the login or register requests to prevent loops
    if (
      response &&
      (response.status === 403 || response.status === 401) &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/register')
    ) {
      if (isRefreshing) {
        // Queue the request until token is refreshed
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Request a new access token
        const refreshResponse = await axios.get(`${API_BASE_URL}/auth/refresh`, {
          withCredentials: true,
        });
        
        const newAccessToken = refreshResponse.data.accessToken;
        setAccessToken(newAccessToken);
        
        isRefreshing = false;
        onRefreshed(newAccessToken);

        // Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        // Token refresh failed (e.g. refresh token expired or missing)
        setAccessToken(null);
        // Custom event so that AuthContext can capture failure and redirect to login
        window.dispatchEvent(new Event('auth-session-expired'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
