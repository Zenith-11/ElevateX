export default function Input({ label, id, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-content">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`h-10 w-full rounded-lg border border-edge bg-background px-4 text-sm text-content placeholder:text-muted transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${className}`}
        {...props}
      />
    </div>
  );
}
