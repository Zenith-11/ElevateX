import axiosClient from './axiosClient';

export const getDashboardMetrics = () =>
  axiosClient.get('/analytics/dashboard');

export const getEngagementTrends = () =>
  axiosClient.get('/analytics/engagement');

export const getUserAnalytics = (userId) =>
  axiosClient.get(`/analytics/user/${userId}`);

export const getReports = () =>
  axiosClient.get('/analytics/reports');

export const generateReport = () =>
  axiosClient.post('/analytics/reports');
