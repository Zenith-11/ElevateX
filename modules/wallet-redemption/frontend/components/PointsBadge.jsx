import "./PointsBadge.css";

export default function PointsBadge({ points = 0, size = "default" }) {
  return (
    <div className={`points-badge points-badge-${size}`}>
      <span className="material-icons-round">stars</span>
      <span className="points-value">{points.toLocaleString()}</span>
    </div>
  );
}
