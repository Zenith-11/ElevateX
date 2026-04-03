import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;

// --- Auth ---
export const authAPI = {
  login: (data) => api.post("/api/auth/login", data),
  register: (data) => api.post("/api/auth/register", data),
  me: () => api.get("/api/auth/me"),
};

// --- Users ---
export const usersAPI = {
  list: () => api.get("/api/users/"),
  team: () => api.get("/api/users/team"),
  get: (id) => api.get(`/api/users/${id}`),
  updateRole: (id, role) => api.put(`/api/users/${id}/role?role=${role}`),
  delete: (id) => api.delete(`/api/users/${id}`),
  updateProfile: (data) => api.put("/api/users/profile", data),
  uploadProfileImage: (formData) => api.post("/api/users/profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
};

// --- Events ---
export const eventsAPI = {
  list: (params) => api.get("/api/events/", { params }),
  listAll: () => api.get("/api/events/all"),
  enrolled: () => api.get("/api/events/enrolled"),
  get: (id) => api.get(`/api/events/${id}`),
  create: (data) => api.post("/api/events/", data),
  update: (id, data) => api.put(`/api/events/${id}`, data),
  approve: (id) => api.put(`/api/events/${id}/approve`),
  delete: (id) => api.delete(`/api/events/${id}`),
  enroll: (id) => api.post(`/api/events/${id}/enroll`),
  unenroll: (id) => api.delete(`/api/events/${id}/unenroll`),
};

// --- Submissions ---
export const submissionsAPI = {
  list: () => api.get("/api/submissions/"),
  create: (data) => api.post("/api/submissions/", data),
  uploadFile: (formData) =>
    api.post("/api/submissions/upload-file", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  review: (id, data) => api.put(`/api/submissions/${id}/review`, data),
};

// --- Wallet ---
export const walletAPI = {
  balance: () => api.get("/api/wallet/balance"),
  transactions: () => api.get("/api/wallet/transactions"),
  rewards: () => api.get("/api/wallet/rewards"),
  redeem: (reward_id) => api.post("/api/wallet/redeem", { reward_id }),
};

// --- Leaderboard ---
export const leaderboardAPI = {
  get: (params) => api.get("/api/leaderboard/", { params }),
};

// --- Analytics ---
export const analyticsAPI = {
  overview: () => api.get("/api/analytics/overview"),
  department: () => api.get("/api/analytics/department"),
  topPerformers: (limit = 10) => api.get(`/api/analytics/top-performers?limit=${limit}`),
  eventStats: () => api.get("/api/analytics/event-stats"),
  exportCsv: () => api.get("/api/analytics/export-csv", { responseType: 'blob' }),
};
