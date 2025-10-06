import axios from 'axios';

// Unified axios instance: relies solely on NextAuth cookies; no manual Authorization header.
const axiosInstance = axios.create({
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

export default axiosInstance;