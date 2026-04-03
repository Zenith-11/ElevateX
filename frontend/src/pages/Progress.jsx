import { useState, useEffect } from "react";
import { eventsAPI } from "../api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { format, formatDistanceToNow } from "date-fns";
import "./Progress.css";

const statusColor = { enrolled: "badge-primary", completed: "badge-success" };

export default function Progress() {
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsAPI.enrolled().then((r) => setEnrolled(r.data)).finally(() => setLoading(false));
  }, []);

  const total = enrolled.length;
  const completed = enrolled.filter((e) => e.enrollment_status === "completed").length;
  const inProgress = enrolled.filter((e) => e.enrollment_status !== "completed").length;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="My Progress" />
        <div className="page-container">

          <div className="page-header">
            <h2 className="page-title">My Progress</h2>
            <p className="page-subtitle">Track all your enrolled events and milestones.</p>
          </div>

          {/* Summary */}
          <div className="grid-3 stagger mb-lg">
            {[
              { icon: "layers",       label: "Total Enrolled", value: total,       color: "primary"   },
              { icon: "pending_actions", label: "In Progress",  value: inProgress,  color: "gold"      },
              { icon: "check_circle", label: "Completed",      value: completed,   color: "secondary" },
            ].map((s) => (
              <div key={s.label} className="card flex-between animate-fade-in">
                <div className="stat-card">
                  <p className="stat-label">{s.label}</p>
                  <p className={`stat-value stat-value-${s.color}`}>{s.value}</p>
                </div>
                <div className={`dash-stat-icon dash-stat-icon-${s.color}`}>
                  <span className="material-icons-round">{s.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Overall Progress */}
          {total > 0 && (
            <div className="card mb-lg animate-fade-in">
              <div className="flex-between mb-sm">
                <p className="font-semibold">Overall Completion</p>
                <p className="text-secondary font-bold">{total > 0 ? Math.round((completed/total)*100) : 0}%</p>
              </div>
              <div className="progress-bar-wrap" style={{height: 10}}>
                <div className="progress-bar-fill" style={{width: `${total > 0 ? (completed/total)*100 : 0}%`}} />
              </div>
              <p className="text-xs text-muted mt-sm">{completed} of {total} events completed</p>
            </div>
          )}

          {/* Event Cards */}
          {loading ? (
            <div className="flex-center" style={{height:200}}><div className="spinner"/></div>
          ) : enrolled.length === 0 ? (
            <div className="empty-state card"><span className="material-icons-round">explore</span><p>No enrolled events. Browse and enroll!</p></div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:"var(--space-md)"}}>
              {enrolled.map((init, i) => {
                const deadlinePassed = new Date(init.deadline) < new Date();
                return (
                  <div key={init.id} className={`card progress-item animate-fade-in ${init.enrollment_status === "completed" ? "progress-item-done" : ""}`} style={{animationDelay:`${i*0.05}s`}}>
                    <div className="progress-item-header">
                      <div>
                        <h3 className="progress-item-title">{init.title}</h3>
                        <div className="flex flex-gap-sm flex-wrap mt-sm">
                          <span className="badge badge-muted">{init.type}</span>
                          <span className="badge badge-muted">{init.department}</span>
                          <span className={`badge ${statusColor[init.enrollment_status] || "badge-muted"}`}>{init.enrollment_status}</span>
                        </div>
                      </div>
                      <div className="progress-item-pts">
                        <span className="material-icons-round">stars</span>
                        <span>{init.reward_points} pts</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex-between mb-sm">
                        <p className="text-sm text-muted">Progress</p>
                        <p className="text-sm font-bold">{init.progress || 0}%</p>
                      </div>
                      <div className="progress-bar-wrap" style={{height:8}}>
                        <div className="progress-bar-fill" style={{width:`${init.progress||0}%`}} />
                      </div>
                    </div>
                    <div className="progress-item-footer">
                      <div className="progress-item-deadline">
                        <span className="material-icons-round" style={{color: deadlinePassed && init.enrollment_status!=="completed" ? "var(--accent)" : "var(--text-muted)"}}>schedule</span>
                        <span className={deadlinePassed && init.enrollment_status!=="completed" ? "text-accent" : "text-muted"}>
                          {deadlinePassed ? "Deadline passed" : `Due ${formatDistanceToNow(new Date(init.deadline), {addSuffix: true})}`}
                        </span>
                      </div>
                      {init.enrolled_at && (
                        <p className="text-xs text-muted">Enrolled {format(new Date(init.enrolled_at), "MMM d, yyyy")}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
