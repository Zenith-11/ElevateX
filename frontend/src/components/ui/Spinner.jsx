import { Loader2 } from 'lucide-react';

export default function Spinner({ size = 24, className = '' }) {
  return (
    <Loader2
      size={size}
      className={`animate-spin text-primary ${className}`}
    />
  );
}

export function PageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={32} className="animate-spin text-primary" />
        <p className="text-sm text-text-secondary">Loading...</p>
      </div>
    </div>
  );
}
