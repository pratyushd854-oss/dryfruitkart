import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dryfruitkart_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If token expired, clear local storage
      // Do not redirect on login attempts
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem('dryfruitkart_token');
        localStorage.removeItem('dryfruitkart_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
