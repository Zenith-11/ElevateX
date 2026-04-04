const config = {
  pending: {
    bg: "bg-warning/10",
    text: "text-warning",
    dot: "bg-warning",
  },
  approved: {
    bg: "bg-success/10",
    text: "text-success",
    dot: "bg-success",
  },
  rejected: {
    bg: "bg-error/10",
    text: "text-error",
    dot: "bg-error",
  },
};

export default function StatusBadge({ status }) {
  const style = config[status] || config.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${style.bg} ${style.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}