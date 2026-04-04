export default function Card({ children }) {
  return (
   <div className="bg-surface border border-border rounded-xl p-6 transition hover:border-primary">
      {children}
    </div>
  );
}