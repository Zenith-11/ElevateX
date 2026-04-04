import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // FastAPI default port
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getEvents = (params) => api.get('/events', { params });
export const getEvent = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post('/events', data);
export const joinEvent = (id) => api.post(`/events/${id}/join`);

export default api;
