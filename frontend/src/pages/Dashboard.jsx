import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { eventsAPI, walletAPI, submissionsAPI } from "../api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { format } from "date-fns";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      eventsAPI.enrolled(),
      walletAPI.balance(),
      submissionsAPI.list(),
    ]).then(([e, w, s]) => {
      setEnrolled(e.data);
      setWallet(w.data);
      setSubmissions(s.data.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  const completedCount = enrolled.filter((e) => e.enrollment_status === "completed").length;
  const pendingApprovals = submissions.filter((s) => s.status === "pending").length;

  const stats = [
    { icon: "explore",          label: "Enrolled",   value: enrolled.length,             color: "primary"   },
    { icon: "check_circle",     label: "Completed",  value: completedCount,              color: "secondary" },
    { icon: "stars",            label: "Points",     value: (wallet?.total_points || 0).toLocaleString(), color: "gold" },
    { icon: "military_tech",    label: "Badges",     value: wallet?.badges?.length || 0, color: "accent"    },
  ];

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Dashboard" />
        <div className="page-container">

          {/* Welcome Banner */}
          <div className="dashboard-hero card animate-fade-in">
            <div className="dashboard-hero-left">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Profile" className="avatar avatar-xl" style={{ objectFit: "cover" }} />
              ) : (
                <div className="avatar avatar-xl">{initials}</div>
              )}
              <div>
                <h2 className="dashboard-welcome">Welcome back, {user?.name?.split(" ")[0]}!</h2>
                <p className="text-muted">{user?.department} · {user?.role}</p>
                <div className="dashboard-badges-row">
                  {wallet?.badges?.slice(0, 4).map((b) => (
                    <span key={b} className="badge badge-primary">{b}</span>
                  ))}
                  {(wallet?.badges?.length || 0) > 4 && (
                    <span className="badge badge-muted">+{wallet.badges.length - 4} more</span>
                  )}
                </div>
              </div>
            </div>
            <div className="dashboard-hero-cta">
              <Link to="/events" className="btn btn-primary">
                <span className="material-icons-round">explore</span> Browse Events
              </Link>
              <Link to="/leaderboard" className="btn btn-secondary">
                <span className="material-icons-round">emoji_events</span> Leaderboard
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid-4 stagger mt-lg">
            {stats.map((s) => (
              <div key={s.label} className="card hover-lift animate-fade-in">
                <div className="flex-between">
                  <div className="stat-card">
                    <p className="stat-label">{s.label}</p>
                    <p className={`stat-value stat-value-${s.color}`}>{s.value}</p>
                  </div>
                  <div className={`dash-stat-icon dash-stat-icon-${s.color}`}>
                    <span className="material-icons-round">{s.icon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid-2 mt-lg">
            {/* Active Events */}
            <div className="card animate-slide-left">
              <div className="section-header">
                <h3 className="section-title">Active Events</h3>
                <Link to="/progress" className="btn btn-secondary btn-sm">View All</Link>
              </div>
              {loading ? (
                <div className="flex-center" style={{height: 120}}><div className="spinner" /></div>
              ) : enrolled.length === 0 ? (
                <div className="empty-state">
                  <span className="material-icons-round">explore</span>
                  <p>No events yet. Browse and enroll!</p>
                </div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:"var(--space-sm)"}}>
                  {enrolled.slice(0, 4).map((init) => (
                    <div key={init.id} className="dash-event-item">
                      <div>
                        <p className="font-semibold text-sm">{init.title}</p>
                        <p className="text-xs text-muted">{init.type} · {init.difficulty}</p>
                      </div>
                      <div style={{textAlign:"right", flexShrink: 0}}>
                        <p className="text-sm font-bold text-primary">{init.progress || 0}%</p>
                        <div className="progress-bar-wrap" style={{width: 80, marginTop: 4}}>
                          <div className="progress-bar-fill" style={{width: `${init.progress || 0}%`}} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Submissions */}
            <div className="card animate-slide-right">
              <div className="section-header">
                <h3 className="section-title">Recent Submissions</h3>
                <Link to="/submit" className="btn btn-secondary btn-sm">Submit New</Link>
              </div>
              {loading ? (
                <div className="flex-center" style={{height: 120}}><div className="spinner" /></div>
              ) : submissions.length === 0 ? (
                <div className="empty-state">
                  <span className="material-icons-round">upload_file</span>
                  <p>No submissions yet.</p>
                </div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:"var(--space-sm)"}}>
                  {submissions.map((s) => (
                    <div key={s.id} className="dash-submission-item">
                      <div>
                        <p className="font-semibold text-sm">{s.event_title}</p>
                        <p className="text-xs text-muted">{format(new Date(s.submitted_at), "MMM d, yyyy")}</p>
                      </div>
                      <span className={`badge status-${s.status}`}>{s.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card mt-lg animate-fade-in">
            <h3 className="section-title mb-md">Quick Actions</h3>
            <div className="dash-quick-actions">
              {[
                { icon: "explore",         label: "Browse Events",  to: "/events",  color: "primary"   },
                { icon: "upload_file",     label: "Submit Proof",        to: "/submit",       color: "secondary" },
                { icon: "account_balance_wallet", label: "My Wallet",   to: "/wallet",       color: "gold"      },
                { icon: "emoji_events",    label: "Leaderboard",         to: "/leaderboard",  color: "accent"    },
              ].map((a) => (
                <Link key={a.to} to={a.to} className={`dash-quick-btn dash-quick-btn-${a.color}`}>
                  <span className="material-icons-round">{a.icon}</span>
                  <span>{a.label}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
