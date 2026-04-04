import api from './api';

export const authApi = {
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),

  register: (data) =>
    api.post('/api/auth/register', data),

  logout: () =>
    api.post('/api/auth/logout'),

  getMe: () =>
    api.get('/api/auth/me'),

  refreshToken: () =>
    api.post('/api/auth/refresh-token'),

  forgotPassword: (email) =>
    api.post('/api/auth/forgot-password', { email }),

  resetPassword: (token, newPassword) =>
    api.post('/api/auth/reset-password', { token, new_password: newPassword }),
};
