import axios from 'axios';

// Create axios instance with default configuration
const axiosInstance = axios.create({
  withCredentials: true, // Always send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token from localStorage if available
axiosInstance.interceptors.request.use(
  (config) => {
    // Only try to access localStorage on the client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on 401 errors
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;