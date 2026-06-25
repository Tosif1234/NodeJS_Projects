import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required to send HTTP-only refresh token cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Access Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh & Retries
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Retry failed requests ONCE if unauthorized (401) and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint to get new access token
        const refreshRes = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = refreshRes.data.data;
        localStorage.setItem('accessToken', accessToken);

        axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        isRefreshing = false;

        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        isRefreshing = false;

        // Clear local storage and dispatch global logout event
        localStorage.removeItem('accessToken');
        window.dispatchEvent(new Event('auth-logout'));

        return Promise.reject(refreshErr);
      }
    }

    // Global Error Handler formatting
    const parsedError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      errors: error.response?.data?.errors || null,
    };

    return Promise.reject(parsedError);
  }
);

export default axiosInstance;
