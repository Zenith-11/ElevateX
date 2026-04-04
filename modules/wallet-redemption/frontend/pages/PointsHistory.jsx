import { useState, useEffect } from "react";
import { walletAPI } from "../api/walletAPI";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import TransactionsList from "../components/TransactionsList";
import PointsBreakdown from "../components/PointsBreakdown";
import "./PointsHistory.css";

export default function PointsHistory() {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [skip, setSkip] = useState(0);
  const limit = 15;

  const fetchData = async (offset = 0) => {
    try {
      const [balanceRes, txRes] = await Promise.all([
        walletAPI.balance(),
        walletAPI.transactions(offset, limit),
      ]);
      setBalance(balanceRes.data);
      setTransactions(txRes.data.data);
      setSkip(offset);
    } catch (e) {
      console.error("Failed to load data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTransactions = transactions.filter(t => {
    if (filter === "all") return true;
    return t.type === filter;
  });

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Points History" />
        <div className="page-container">
          <div className="page-header">
            <h2 className="page-title">Points History</h2>
            <p className="page-subtitle">Track all your point transactions and earnings.</p>
          </div>

          {loading ? (
            <div className="flex-center" style={{ height: 400 }}>
              <div className="spinner" />
            </div>
          ) : (
            <>
              {/* Points Breakdown Card */}
              <div className="history-grid">
                <PointsBreakdown balance={balance} />
              </div>

              {/* Type Filter */}
              <div className="history-filter mt-lg mb-lg">
                <label className="text-xs text-muted font-semibold">Filter by Type:</label>
                <div className="filter-buttons">
                  {["all", "earn", "redeem"].map((type) => (
                    <button
                      key={type}
                      className={`filter-btn ${filter === type ? "active" : ""}`}
                      onClick={() => { setFilter(type); setSkip(0); }}
                    >
                      <span className="material-icons-round">
                        {type === "earn" ? "trending_up" : type === "redeem" ? "shopping_cart" : "receipt_long"}
                      </span>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transactions Table */}
              <div className="card animate-fade-in">
                {filteredTransactions.length === 0 ? (
                  <div className="empty-state">
                    <span className="material-icons-round">receipt_long</span>
                    <p>No {filter === "all" ? "" : filter} transactions yet.</p>
                  </div>
                ) : (
                  <>
                    <TransactionsList transactions={filteredTransactions} />

                    {/* Pagination */}
                    <div className="pagination-controls mt-lg" style={{ borderTop: "1px solid var(--border)", paddingTop: "var(--space-lg)" }}>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
