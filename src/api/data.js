import axiosClient from './axiosClient';

export const addUser       = (data) => axiosClient.post('/data/user', data);
export const addEvent      = (data) => axiosClient.post('/data/event', data);
export const addSubmission = (data) => axiosClient.post('/data/submission', data);
export const listEvents    = ()     => axiosClient.get('/data/events');
export const listUsers     = ()     => axiosClient.get('/data/users');
