import "./PointsBreakdown.css";

export default function PointsBreakdown({ balance }) {
  if (!balance) return null;

  const total = balance.earned_points || 0;
  const spent = balance.redeemed_points || 0;
  const remaining = balance.total_points || 0;

  const earnedPercent = total > 0 ? (remaining / total) * 100 : 0;
  const spentPercent = total > 0 ? (spent / total) * 100 : 0;

  return (
    <div className="points-breakdown card animate-fade-in">
      <h3 className="section-title mb-lg">Points Breakdown</h3>

      <div className="breakdown-stats">
        <div className="stat-item">
          <div className="stat-icon earned">
            <span className="material-icons-round">trending_up</span>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Earned</p>
            <p className="stat-value">{total.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon redeemed">
            <span className="material-icons-round">shopping_cart</span>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Redeemed</p>
            <p className="stat-value">{spent.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon remaining">
            <span className="material-icons-round">account_balance_wallet</span>
          </div>
          <div className="stat-content">
            <p className="stat-label">Remaining</p>
            <p className="stat-value">{remaining.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {total > 0 && (
        <div className="breakdown-chart">
          <p className="chart-label text-xs text-muted">Distribution</p>
          <div className="progress-bar">
            <div
              className="progress-segment earned"
              style={{ width: `${earnedPercent}%` }}
              title={`Remaining: ${remaining} (${Math.round(earnedPercent)}%)`}
            />
            <div
              className="progress-segment redeemed"
              style={{ width: `${spentPercent}%` }}
              title={`Redeemed: ${spent} (${Math.round(spentPercent)}%)`}
            />
          </div>
          <div className="progress-legend">
            <div className="legend-item">
              <span className="legend-indicator earned" />
              <span className="text-xs">Remaining ({Math.round(earnedPercent)}%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-indicator redeemed" />
              <span className="text-xs">Redeemed ({Math.round(spentPercent)}%)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
