import axiosClient from './axiosClient';

export const getGlobalLeaderboard = (page = 1, limit = 100) =>
  axiosClient.get('/leaderboard', { params: { page, limit } });

export const getDepartmentLeaderboard = (department) =>
  axiosClient.get('/leaderboard/department', { params: { department } });

export const getUserRank = (userId) =>
  axiosClient.get(`/leaderboard/${userId}/rank`);
