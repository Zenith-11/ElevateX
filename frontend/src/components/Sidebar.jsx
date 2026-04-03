import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const employeeNav = [
  { to: "/dashboard",    icon: "dashboard",        label: "Dashboard"    },
  { to: "/events",  icon: "explore",          label: "Events"  },
  { to: "/progress",     icon: "track_changes",    label: "My Progress"  },
  { to: "/submit",       icon: "upload_file",      label: "Submit Proof" },
  { to: "/wallet",       icon: "account_balance_wallet", label: "Wallet" },
  { to: "/leaderboard",  icon: "emoji_events",     label: "Leaderboard"  },
  { to: "/profile",      icon: "manage_accounts",  label: "My Profile"   },
];

const managerNav = [
  { to: "/dashboard",    icon: "dashboard",            label: "Dashboard"    },
  { to: "/events",  icon: "explore",              label: "Events"  },
  { to: "/progress",     icon: "track_changes",        label: "My Progress"  },
  { to: "/submit",       icon: "upload_file",          label: "Submit Proof" },
  { to: "/wallet",       icon: "account_balance_wallet", label: "Wallet" },
  { to: "/manager",      icon: "supervisor_account",   label: "Team Overview"},
  { to: "/leaderboard",  icon: "emoji_events",         label: "Leaderboard"  },
  { to: "/analytics",    icon: "bar_chart",            label: "Analytics"    },
  { to: "/profile",      icon: "manage_accounts",      label: "My Profile"   },
];

const adminNav = [
  { to: "/admin",       icon: "admin_panel_settings", label: "Admin Panel"  },
  { to: "/analytics",   icon: "bar_chart",            label: "Analytics"    },
  { to: "/manager",     icon: "supervisor_account",   label: "Team Overview" },
  { to: "/leaderboard", icon: "emoji_events",         label: "Leaderboard"  },
  { to: "/profile",     icon: "manage_accounts",      label: "My Profile"   },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems =
    user?.role === "admin"   ? adminNav   :
    user?.role === "manager" ? managerNav : employeeNav;

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon material-icons-round">bolt</span>
        <span className="sidebar-logo-text">ElevateX</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <span className="material-icons-round">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="Profile" className="avatar avatar-sm" style={{ objectFit: "cover" }} />
          ) : (
            <div className="avatar avatar-sm">{initials}</div>
          )}
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{user?.name}</p>
            <p className="sidebar-user-role">{user?.role}</p>
          </div>
        </div>
        <button className="btn btn-icon sidebar-logout" onClick={handleLogout} title="Logout">
          <span className="material-icons-round">logout</span>
        </button>
      </div>
    </aside>
  );
}
