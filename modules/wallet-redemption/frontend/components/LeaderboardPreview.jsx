import { useState, useEffect } from "react";
import { walletAPI } from "../api/walletAPI";
import "./LeaderboardPreview.css";

export default function LeaderboardPreview() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await walletAPI.leaderboard(0, 5);
        setLeaderboard(res.data.data);
      } catch (e) {
        console.error("Failed to load leaderboard", e);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div className="spinner" />;
  }

  return (
    <div className="leaderboard-preview card">
      <div className="leaderboard-header">
        <h3 className="section-title">Top Earners</h3>
        <a href="/leaderboard" className="text-xs text-primary">View All →</a>
      </div>

      <div className="leaderboard-list">
        {leaderboard.map((entry, idx) => (
          <div key={entry.user_id} className="leaderboard-item">
            <div className="leaderboard-rank">
              {idx === 0 && <span className="material-icons-round" style={{ color: "#FFB800" }}>emoji_events</span>}
              {idx === 1 && <span className="material-icons-round" style={{ color: "#C0C0C0" }}>emoji_events</span>}
              {idx === 2 && <span className="material-icons-round" style={{ color: "#CD7F32" }}>emoji_events</span>}
              {idx > 2 && <span className="rank-number">#{idx + 1}</span>}
            </div>
            <div className="leaderboard-user">
              <p className="user-name">{entry.username || entry.email}</p>
              <p className="user-points">{entry.points.toLocaleString()} pts</p>
            </div>
          </div>
        ))}
      </div>

      <a href="/leaderboard" className="btn btn-sm btn-secondary" style={{ marginTop: "var(--space-md)" }}>
        View Full Leaderboard
      </a>
    </div>
  );
}
