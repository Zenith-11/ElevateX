import { useState, useEffect } from "react";
import { walletAPI } from "../api/walletAPI";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import RedeemModal from "../components/RedeemModal";
import "./RewardsStore.css";

export default function RewardsStore() {
  const [rewards, setRewards] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });
  const [filter, setFilter] = useState("all");
  const [skip, setSkip] = useState(0);
  const limit = 12;

  const fetchData = async (offset = 0) => {
    try {
      const [balanceRes, rewardsRes] = await Promise.all([
        walletAPI.balance(),
        walletAPI.rewards(offset, limit),
      ]);
      setBalance(balanceRes.data);
      setRewards(rewardsRes.data.data);
      setSkip(offset);
    } catch (e) {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3500);
  };

  const handleRedeemClick = (reward) => {
    setSelectedReward(reward);
    setShowModal(true);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedReward) return;
    
    setRedeeming(true);
    try {
      await walletAPI.redeem(selectedReward.id);
      showToast(`Redeemed "${selectedReward.name}" successfully!`);
      setShowModal(false);
      setSelectedReward(null);
      await fetchData(skip);
    } catch (e) {
      showToast(e.response?.data?.detail || "Redemption failed", "error");
    } finally {
      setRedeeming(false);
    }
  };

  const filteredRewards = rewards.filter(r => {
    if (filter === "all") return true;
    return r.category === filter;
  });

  const categories = ["all", ...new Set(rewards.map(r => r.category))];
  const canAfford = (rewardPoints) => (balance?.total_points || 0) >= rewardPoints;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Rewards Store" />
        <div className="page-container">
          <div className="page-header">
            <h2 className="page-title">Rewards Store</h2>
            <p className="page-subtitle">Browse and redeem your earned points for amazing rewards.</p>
          </div>

          {toast.msg && (
            <div className={`alert alert-${toast.type} mb-md animate-fade-in`}>
              <span className="material-icons-round">
                {toast.type === "error" ? "error_outline" : "check_circle"}
              </span>
              {toast.msg}
            </div>
          )}

          {/* Balance Summary Card */}
          <div className="rewards-balance-card card animate-fade-in">
            <div className="balance-content">
              <p className="balance-label">Your Points Available</p>
              <p className="balance-value">{(balance?.total_points || 0).toLocaleString()}</p>
            </div>
            <div className="balance-actions">
              <a href="/wallet" className="btn btn-sm btn-secondary">
                View Wallet
              </a>
              <a href="/wallet#history" className="btn btn-sm btn-secondary">
                History
              </a>
            </div>
          </div>

          {/* Category Filter */}
          <div className="rewards-filter mt-lg mb-lg">
            <label className="text-xs text-muted font-semibold">Filter by Category:</label>
            <div className="filter-buttons">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn ${filter === cat ? "active" : ""}`}
                  onClick={() => { setFilter(cat); setSkip(0); }}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex-center" style={{ height: 400 }}>
              <div className="spinner" />
            </div>
          ) : filteredRewards.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons-round">card_giftcard</span>
              <p>No rewards available in this category</p>
            </div>
          ) : (
            <>
              {/* Rewards Grid */}
              <div className="rewards-grid">
                {filteredRewards.map((reward) => {
                  const affordable = canAfford(reward.cost_points);
                  return (
                    <div
                      key={reward.id}
                      className={`card reward-card ${!affordable ? "reward-locked" : ""}`}
                    >
                      <div className="reward-header">
                        <div className="reward-icon">
                          <span className="material-icons-round">card_giftcard</span>
                        </div>
                        {reward.inventory <= 5 && reward.inventory > 0 && (
                          <span className="reward-stock-warn">Only {reward.inventory} left</span>
                        )}
                        {reward.inventory === 0 && (
                          <span className="reward-stock-out">Out of Stock</span>
                        )}
                      </div>

                      <h4 className="reward-name">{reward.name}</h4>
                      <p className="reward-desc">{reward.description}</p>

                      <div className="reward-category">
                        <span className="badge badge-secondary">{reward.category}</span>
                      </div>

                      <div className="reward-footer">
                        <div className="reward-cost">
                          <span className="material-icons-round">stars</span>
                          <span>{reward.cost_points.toLocaleString()} pts</span>
                        </div>
                        <button
                          className={`btn btn-sm ${affordable ? "btn-primary" : "btn-secondary"}`}
                          onClick={() => handleRedeemClick(reward)}
                          disabled={!affordable || reward.inventory === 0}
                        >
                          {reward.inventory === 0 ? "Out of Stock" : affordable ? "Redeem" : "Insufficient"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="pagination-controls mt-lg">
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => fetchData(Math.max(0, skip - limit))}
                  disabled={skip === 0}
                >
                  ← Previous
                </button>
                <span className="text-muted">Page {Math.floor(skip / limit) + 1}</span>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => fetchData(skip + limit)}
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Redeem Modal */}
      {showModal && selectedReward && (
        <RedeemModal
          reward={selectedReward}
          userPoints={balance?.total_points || 0}
          isRedeeming={redeeming}
          onConfirm={handleConfirmRedeem}
          onCancel={() => {
            setShowModal(false);
            setSelectedReward(null);
          }}
        />
      )}
    </div>
  );
}
