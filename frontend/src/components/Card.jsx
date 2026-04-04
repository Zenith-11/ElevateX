export default function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-edge bg-surface p-6 transition-all duration-200 ${className}`}
    >
      {children}
    </div>
  );
}