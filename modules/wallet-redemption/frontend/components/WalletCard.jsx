import "./WalletCard.css";

export default function WalletCard({ balance, onClick }) {
  return (
    <div className="wallet-card card hover-lift" onClick={onClick}>
      <div className="wallet-card-header">
        <span className="material-icons-round">account_balance_wallet</span>
        <h3 className="section-title">Your Balance</h3>
      </div>

      <div className="wallet-card-content">
        <p className="wallet-label">Available Points</p>
        <p className="wallet-amount">{(balance?.total_points || 0).toLocaleString()}</p>
      </div>

      <div className="wallet-card-footer">
        <div className="wallet-stat">
          <span className="stat-label">Earned</span>
          <span className="stat-value text-secondary">
            +{(balance?.earned_points || 0).toLocaleString()}
          </span>
        </div>
        <div className="wallet-divider" />
        <div className="wallet-stat">
          <span className="stat-label">Redeemed</span>
          <span className="stat-value text-accent">
            -{(balance?.redeemed_points || 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
