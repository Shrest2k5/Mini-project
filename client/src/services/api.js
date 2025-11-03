import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const reportsAPI = {
  getAll: (params) => api.get('/reports', { params }),
  getById: (id) => api.get(`/reports/${id}`),
  create: (formData) => api.post('/reports', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  claim: (id, userId) => api.post(`/reports/${id}/claim`, { userId }),
  submitCleanup: (id, formData) => api.post(`/reports/${id}/cleanup`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const usersAPI = {
  getById: (id) => api.get(`/users/${id}`),
  login: (email, password) => api.post('/users/login', { email, password }),
  register: (username, email, password) => api.post('/users/register', { username, email, password }),
};

export const leaderboardAPI = {
  get: () => api.get('/leaderboard'),
};

export const statisticsAPI = {
  get: () => api.get('/statistics'),
};

export default api;
