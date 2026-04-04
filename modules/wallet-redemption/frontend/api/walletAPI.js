import api from '../../../api/index';

// Wallet & Redemption API Endpoints
export const walletAPI = {
  // User Wallet Endpoints
  balance: () => api.get("/api/wallet/balance"),
  
  transactions: (skip = 0, limit = 20) => 
    api.get("/api/wallet/history", { params: { skip, limit } }),
  
  rewards: (skip = 0, limit = 20) => 
    api.get("/api/wallet/rewards", { params: { skip, limit } }),
  
  redeem: (reward_id) => 
    api.post("/api/wallet/redeem", { reward_id }),
  
  leaderboard: (skip = 0, limit = 50) => 
    api.get("/api/wallet/leaderboard", { params: { skip, limit } }),
  
  summary: () => 
    api.get("/api/wallet/summary"),
  
  getUserPoints: (user_id) => 
    api.get(`/api/wallet/users/${user_id}/points`),

  // Admin Reward Management Endpoints
  createReward: (data) => 
    api.post("/api/wallet/admin/rewards", data),
  
  updateReward: (reward_id, data) => 
    api.put(`/api/wallet/admin/rewards/${reward_id}`, data),
  
  deleteReward: (reward_id) => 
    api.delete(`/api/wallet/admin/rewards/${reward_id}`),
  
  getAllRewards: (skip = 0, limit = 50) => 
    api.get("/api/wallet/admin/rewards", { params: { skip, limit } }),
};

export default walletAPI;

