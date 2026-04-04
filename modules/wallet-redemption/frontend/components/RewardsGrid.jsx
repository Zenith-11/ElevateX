import RewardCard from "./RewardCard";
import "./RewardsGrid.css";

export default function RewardsGrid({ rewards, onRedeem, userPoints }) {
  if (!rewards || rewards.length === 0) {
    return (
      <div className="empty-state">
        <span className="material-icons-round">card_giftcard</span>
        <p>No rewards available</p>
      </div>
    );
  }

  return (
    <div className="rewards-grid">
      {rewards.map((reward) => (
        <RewardCard
          key={reward.id}
          reward={reward}
          onRedeem={onRedeem}
          canAfford={userPoints >= reward.cost_points}
        />
      ))}
    </div>
  );
}
