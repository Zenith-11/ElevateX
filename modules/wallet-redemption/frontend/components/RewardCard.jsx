import "./RewardCard.css";

export default function RewardCard({ reward, onRedeem, canAfford = true }) {
  return (
    <div className={`reward-card card hover-lift ${!canAfford ? "reward-locked" : ""}`}>
      <div className="reward-icon">
        <span className="material-icons-round">card_giftcard</span>
      </div>

      <h4 className="reward-name">{reward.name}</h4>
      <p className="reward-desc">{reward.description}</p>

      {reward.category && (
        <div className="reward-category">
          <span className="badge badge-secondary">{reward.category}</span>
        </div>
      )}

      <div className="reward-footer">
        <div className="reward-cost">
          <span className="material-icons-round">stars</span>
          <span>{reward.cost_points.toLocaleString()} pts</span>
        </div>
        <button
          className={`btn btn-sm ${canAfford ? "btn-primary" : "btn-secondary"}`}
          onClick={() => onRedeem(reward)}
          disabled={!canAfford || reward.inventory === 0}
        >
          {reward.inventory === 0 ? "Out of Stock" : canAfford ? "Redeem" : "Insufficient"}
        </button>
      </div>

      {reward.inventory > 0 && (
        <p className="text-xs text-muted mt-sm">{reward.inventory} left in stock</p>
      )}
    </div>
  );
}
