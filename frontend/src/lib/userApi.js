import api from './api';

export const userApi = {
  listUsers: (skip = 0, limit = 20) =>
    api.get('/api/users/', { params: { skip, limit } }),

  getUser: (userId) =>
    api.get(`/api/users/${userId}`),

  updateUser: (userId, data) =>
    api.put(`/api/users/${userId}`, data),

  updateUserRole: (userId, role) =>
    api.put(`/api/users/${userId}/role`, { role }),

  deleteUser: (userId) =>
    api.delete(`/api/users/${userId}`),
};
