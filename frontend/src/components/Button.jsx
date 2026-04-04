export default function Button({ children, onClick, variant = "primary" }) {
  const base = "h-10 px-4 rounded-md text-sm transition";

  const styles = {
    primary: "bg-primary text-white hover:bg-primaryHover",
    secondary: "border border-border text-textPrimary hover:bg-surface"
  };

  return (
    <button onClick={onClick} className={`${base} ${styles[variant]}`}>
      {children}
    </button>
  );
}
