import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";

export default function Navbar({ title }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const roleColor = {
    admin: "badge-primary",
    manager: "badge-warning",
    employee: "badge-success",
  }[user?.role] || "badge-muted";

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-title">{title || "ElevateX"}</h1>
      </div>
      <div className="navbar-right">
        <div className="navbar-points">
          <span className="material-icons-round">stars</span>
          <span>{(user?.points || 0).toLocaleString()} pts</span>
        </div>
        <span className={`badge ${roleColor}`}>{user?.role}</span>

        {/* Theme Toggle */}
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-label="Toggle theme"
        >
          <span className="material-icons-round">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>

        <div className="navbar-user">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="Profile" className="avatar avatar-sm" style={{ objectFit: "cover" }} />
          ) : (
            <div className="avatar avatar-sm">
              {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U"}
            </div>
          )}
          <span className="navbar-user-name">{user?.name}</span>
        </div>
      </div>
    </header>
  );
}
