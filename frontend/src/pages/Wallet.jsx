import { useState, useEffect } from "react";
import { walletAPI } from "../api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { format } from "date-fns";
import "./Wallet.css";

const BADGE_INFO = {
  "First Steps":    { icon: "flag",            color: "#6C3FE6" },
  "Getting Started":{ icon: "rocket_launch",   color: "#00D4AA" },
  "Achiever":       { icon: "star",            color: "#FFB800" },
  "Champion":       { icon: "emoji_events",    color: "#FF6B6B" },
  "Point Hunter":   { icon: "monetization_on", color: "#6C3FE6" },
  "High Scorer":    { icon: "diamond",         color: "#00D4AA" },
  "Elite":          { icon: "crown",           color: "#FFB800" },
};

export default function Wallet() {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);
  const [toast, setToast] = useState({ msg:"", type:"" });
  const [activeTab, setActiveTab] = useState("transactions");

  const fetchData = async () => {
    const [b, t, r] = await Promise.all([walletAPI.balance(), walletAPI.transactions(), walletAPI.rewards()]);
    setBalance(b.data); setTransactions(t.data); setRewards(r.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const showToast = (msg, type="success") => {
    setToast({msg,type}); setTimeout(()=>setToast({msg:"",type:""}),3500);
  };

  const handleRedeem = async (rewardId, name) => {
    setRedeeming(rewardId);
    try {
      await walletAPI.redeem(rewardId);
      showToast(`Redeemed "${name}" successfully!`);
      await fetchData();
    } catch(e) {
      showToast(e.response?.data?.detail || "Redemption failed", "error");
    } finally { setRedeeming(null); }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Digital Wallet" />
        <div className="page-container">

          <div className="page-header">
            <h2 className="page-title">Digital Wallet</h2>
            <p className="page-subtitle">Track your points, badges, and redeem rewards.</p>
          </div>

          {toast.msg && (
            <div className={`alert alert-${toast.type} mb-md animate-fade-in`}>
              <span className="material-icons-round">{toast.type==="error"?"error_outline":"check_circle"}</span>
              {toast.msg}
            </div>
          )}

          {loading ? (
            <div className="flex-center" style={{height:200}}><div className="spinner"/></div>
          ) : (
            <>
              {/* Balance Card */}
              <div className="wallet-balance-card card animate-fade-in">
                <div className="wallet-balance-left">
                  <p className="wallet-balance-label">Total Points Balance</p>
                  <p className="wallet-balance-value">{(balance?.total_points||0).toLocaleString()}</p>
                  <div className="wallet-balance-row">
                    <div className="wallet-balance-stat">
                      <span className="material-icons-round">trending_up</span>
                      <div>
                        <p className="text-xs text-muted">Earned</p>
                        <p className="font-bold text-secondary">+{(balance?.earned_points||0).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="wallet-balance-stat">
                      <span className="material-icons-round">shopping_cart</span>
                      <div>
                        <p className="text-xs text-muted">Redeemed</p>
                        <p className="font-bold text-accent">-{(balance?.redeemed_points||0).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="wallet-balance-stat">
                      <span className="material-icons-round">receipt_long</span>
                      <div>
                        <p className="text-xs text-muted">Transactions</p>
                        <p className="font-bold">{balance?.transaction_count||0}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="wallet-badge-showcase">
                  <p className="text-xs text-muted font-semibold" style={{textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"var(--space-sm)"}}>Badges Earned</p>
                  {balance?.badges?.length === 0 ? (
                    <p className="text-muted text-sm">Complete events to earn badges!</p>
                  ) : (
                    <div className="wallet-badges-grid">
                      {balance?.badges?.map((b) => {
                        const info = BADGE_INFO[b] || {icon:"star",color:"#6C3FE6"};
                        return (
                          <div key={b} className="wallet-badge-item" title={b}>
                            <div className="wallet-badge-icon" style={{background:`${info.color}22`,border:`1px solid ${info.color}44`}}>
                              <span className="material-icons-round" style={{color:info.color}}>{info.icon}</span>
                            </div>
                            <p className="wallet-badge-label">{b}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="wallet-tabs mt-lg">
                {["transactions","rewards"].map((t) => (
                  <button key={t} className={`wallet-tab ${activeTab===t?"active":""}`} onClick={()=>setActiveTab(t)}>
                    <span className="material-icons-round">{t==="transactions"?"receipt_long":"redeem"}</span>
                    {t.charAt(0).toUpperCase()+t.slice(1)}
                  </button>
                ))}
              </div>

              {activeTab === "transactions" && (
                <div className="card mt-md animate-fade-in">
                  <h3 className="section-title mb-lg">Transaction History</h3>
                  {transactions.length === 0 ? (
                    <div className="empty-state"><span className="material-icons-round">receipt_long</span><p>No transactions yet.</p></div>
                  ) : (
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead><tr><th>Description</th><th>Type</th><th>Amount</th><th>Date</th></tr></thead>
                        <tbody>
                          {transactions.map((t) => (
                            <tr key={t.id}>
                              <td className="font-semibold">{t.description}</td>
                              <td><span className={`badge ${t.type==="earn"?"badge-success":"badge-warning"}`}>{t.type}</span></td>
                              <td className={`font-bold ${t.type==="earn"?"text-secondary":"text-accent"}`}>
                                {t.type==="earn"?"+":"-"}{t.amount.toLocaleString()} pts
                              </td>
                              <td className="text-muted text-sm">{format(new Date(t.timestamp),"MMM d, yyyy HH:mm")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "rewards" && (
                <div className="mt-md animate-fade-in">
                  <div className="rewards-grid">
                    {rewards.map((r) => {
                      const canAfford = (balance?.total_points||0) >= r.cost_points;
                      return (
                        <div key={r.id} className={`card hover-lift reward-card ${!canAfford?"reward-card-locked":""}`}>
                          <div className="reward-icon">
                            <span className="material-icons-round">redeem</span>
                          </div>
                          <h4 className="reward-name">{r.name}</h4>
                          <p className="reward-desc">{r.description}</p>
                          <div className="reward-footer">
                            <div className="reward-cost">
                              <span className="material-icons-round">stars</span>
                              <span>{r.cost_points.toLocaleString()} pts</span>
                            </div>
                            <button
                              className={`btn btn-sm ${canAfford?"btn-primary":"btn-secondary"}`}
                              onClick={() => handleRedeem(r.id, r.name)}
                              disabled={!canAfford || redeeming===r.id}
                            >
                              {redeeming===r.id ? <span className="spinner spinner-sm"/> : null}
                              {canAfford ? "Redeem" : "Insufficient"}
                            </button>
                          </div>
                          {r.inventory > 0 && <p className="text-xs text-muted mt-sm">{r.inventory} left in stock</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
