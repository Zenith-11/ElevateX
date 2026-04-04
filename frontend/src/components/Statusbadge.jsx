export default function StatusBadge({ status }) {
  const styles = {
    pending: "text-yellow-400",
    approved: "text-green-400",
    rejected: "text-red-400"
  };

  return (
    <span className={`text-sm font-medium ${styles[status]}`}>
      {status.toUpperCase()}
    </span>
  );
}