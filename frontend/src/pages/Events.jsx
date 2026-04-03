import { useState, useEffect } from "react";
import { eventsAPI } from "../api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import "./Events.css";

const TYPES = ["All", "hackathon", "course", "campaign", "training", "challenge"];
const DEPTS = ["All", "Engineering", "Design", "Marketing", "HR", "Finance", "Operations"];
const DIFFS = ["All", "Easy", "Medium", "Hard"];

const diffColor = { Easy: "badge-success", Medium: "badge-warning", Hard: "badge-danger" };
const typeIcon  = { hackathon: "code", course: "school", campaign: "campaign", training: "fitness_center", challenge: "emoji_events" };

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [type, setType]       = useState("All");
  const [dept, setDept]       = useState("All");
  const [diff, setDiff]       = useState("All");
  const [enrolling, setEnrolling] = useState(null);
  const [toast, setToast]     = useState("");

  const fetchEvents = async () => {
    setLoading(true);
    const params = { status: "active" };
    if (type !== "All") params.type = type;
    if (dept !== "All") params.department = dept;
    if (diff !== "All") params.difficulty = diff;
    if (search)         params.search = search;
    const res = await eventsAPI.list(params);
    setEvents(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, [type, dept, diff]);

  useEffect(() => {
    const id = setTimeout(fetchEvents, 400);
    return () => clearTimeout(id);
  }, [search]);

  const handleEnroll = async (id, isEnrolled) => {
    setEnrolling(id);
    try {
      if (isEnrolled) await eventsAPI.unenroll(id);
      else            await eventsAPI.enroll(id);
      setToast(isEnrolled ? "Unenrolled successfully" : "Enrolled successfully!");
      await fetchEvents();
    } catch (e) {
      setToast(e.response?.data?.detail || "Action failed");
    } finally {
      setEnrolling(null);
      setTimeout(() => setToast(""), 3000);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Events" />
        <div className="page-container">

          <div className="page-header">
            <h2 className="page-title">Discover Events</h2>
            <p className="page-subtitle">Browse, filter, and enroll in programs that match your goals.</p>
          </div>

          {/* Toast */}
          {toast && <div className="alert alert-success mb-md animate-fade-in"><span className="material-icons-round">check_circle</span>{toast}</div>}

          {/* Filters */}
          <div className="card events-filters mb-lg">
            <div className="events-search-wrap">
              <span className="material-icons-round events-search-icon">search</span>
              <input className="form-input events-search" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="events-filter-group">
              {TYPES.map((t) => (
                <button key={t} className={`filter-pill ${type === t ? "active" : ""}`} onClick={() => setType(t)}>
                  {t !== "All" && <span className="material-icons-round">{typeIcon[t]}</span>}{t}
                </button>
              ))}
            </div>
            <div className="flex flex-gap-sm flex-wrap">
              <select className="form-select" style={{width:"auto"}} value={dept} onChange={(e) => setDept(e.target.value)}>
                {DEPTS.map((d) => <option key={d}>{d}</option>)}
              </select>
              <select className="form-select" style={{width:"auto"}} value={diff} onChange={(e) => setDiff(e.target.value)}>
                {DIFFS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex-center" style={{height: 200}}><div className="spinner" /></div>
          ) : events.length === 0 ? (
            <div className="empty-state card"><span className="material-icons-round">search_off</span><p>No events found. Try adjusting filters.</p></div>
          ) : (
            <div className="events-grid stagger">
              {events.map((init) => (
                <div key={init.id} className={`card hover-lift event-card animate-fade-in ${init.is_enrolled ? "event-card-enrolled" : ""}`}>
                  <div className="event-card-header">
                    <div className={`event-type-icon event-type-${init.type}`}>
                      <span className="material-icons-round">{typeIcon[init.type] || "star"}</span>
                    </div>
                    <div className="event-meta">
                      <span className={`badge ${diffColor[init.difficulty] || "badge-muted"}`}>{init.difficulty}</span>
                      <span className="badge badge-muted">{init.department}</span>
                    </div>
                  </div>
                  <h3 className="event-title">{init.title}</h3>
                  <p className="event-desc">{init.description}</p>
                  <div className="event-tags">
                    {init.tags?.slice(0, 3).map((tag) => (
                      <span key={tag} className="event-tag">#{tag}</span>
                    ))}
                  </div>
                  <div className="event-footer">
                    <div className="event-info">
                      <div className="event-info-item">
                        <span className="material-icons-round">schedule</span>
                        <span>{format(new Date(init.deadline), "MMM d, yyyy")}</span>
                      </div>
                      <div className="event-info-item">
                        <span className="material-icons-round">stars</span>
                        <span className="text-gold">{init.reward_points} pts</span>
                      </div>
                      <div className="event-info-item">
                        <span className="material-icons-round">group</span>
                        <span>{init.enrolled_count} enrolled</span>
                      </div>
                    </div>
                    {user?.role === "employee" && (
                      <button
                        className={`btn btn-sm ${init.is_enrolled ? "btn-danger" : "btn-primary"}`}
                        onClick={() => handleEnroll(init.id, init.is_enrolled)}
                        disabled={enrolling === init.id}
                      >
                        {enrolling === init.id ? <span className="spinner spinner-sm" /> :
                          <span className="material-icons-round">{init.is_enrolled ? "remove_circle" : "add_circle"}</span>}
                        {init.is_enrolled ? "Unenroll" : "Enroll"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
