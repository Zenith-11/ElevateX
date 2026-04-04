import "./RedeemModal.css";

export default function RedeemModal({ reward, userPoints, isRedeeming, onConfirm, onCancel }) {
  const hasEnoughPoints = userPoints >= reward.cost_points;
  const pointsShort = reward.cost_points - userPoints;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content redeem-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCancel}>
          ✕
        </button>

        <div className="modal-header">
          <div className="reward-icon-large">
            <span className="material-icons-round">card_giftcard</span>
          </div>
          <h2>{reward.name}</h2>
        </div>

        <div className="modal-body">
          <p className="reward-description">{reward.description}</p>

          <div className="redemption-info">
            <div className="info-row">
              <span className="label">Points Required:</span>
              <span className="value">{reward.cost_points.toLocaleString()}</span>
            </div>
            <div className="info-row">
              <span className="label">Your Points:</span>
              <span className={`value ${hasEnoughPoints ? "text-secondary" : "text-accent"}`}>
                {userPoints.toLocaleString()}
              </span>
            </div>
            {!hasEnoughPoints && (
              <div className="info-row error">
                <span className="material-icons-round">error_outline</span>
                <span>You need {pointsShort.toLocaleString()} more points</span>
              </div>
            )}
            {reward.inventory <= 5 && reward.inventory > 0 && (
              <div className="info-row warning">
                <span className="material-icons-round">warning</span>
                <span>Only {reward.inventory} left in stock</span>
              </div>
            )}
            {reward.inventory === 0 && (
              <div className="info-row error">
                <span className="material-icons-round">error_outline</span>
                <span>This reward is out of stock</span>
              </div>
            )}
          </div>

          {hasEnoughPoints && reward.inventory > 0 && (
            <div className="modal-message success">
              <span className="material-icons-round">check_circle</span>
              <span>You have enough points to redeem this reward!</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel} disabled={isRedeeming}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={!hasEnoughPoints || reward.inventory === 0 || isRedeeming}
          >
            {isRedeeming ? (
              <>
                <span className="spinner spinner-sm" />
                Redeeming...
              </>
            ) : (
              "Confirm Redemption"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
