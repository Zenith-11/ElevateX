export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center h-10 px-4 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-hover active:scale-[0.98]",
    secondary:
      "border border-edge text-content hover:bg-surface active:scale-[0.98]",
    ghost: "text-muted hover:text-content hover:bg-surface",
    success:
      "bg-success text-white hover:bg-success/90 active:scale-[0.98]",
    danger:
      "bg-error text-white hover:bg-error/90 active:scale-[0.98]",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
