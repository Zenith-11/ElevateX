const roleStyles = {
  admin: 'bg-primary-bg text-primary-light border-primary/20',
  manager: 'bg-warning-bg text-warning border-warning/20',
  employee: 'bg-surface-hover text-text-secondary border-border',
};

export default function Badge({ role, className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center
        px-2.5 py-0.5
        text-xs font-medium
        border rounded-full
        capitalize
        ${roleStyles[role] || roleStyles.employee}
        ${className}
      `}
    >
      {role}
    </span>
  );
}
