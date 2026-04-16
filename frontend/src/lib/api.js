import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for attaching JWT token
api.interceptors.request.use(
  (config) => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const { token } = JSON.parse(user);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Error parsing user from localStorage', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors (like 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Auto logout on 401
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
