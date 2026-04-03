import { useState, useEffect } from "react";
import { usersAPI, submissionsAPI, eventsAPI } from "../api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import "./Manager.css";

import ManagerTeamGrid from "../components/manager/ManagerTeamGrid";
import ManagerApprovalsList from "../components/manager/ManagerApprovalsList";
import ManagerEventsTable from "../components/manager/ManagerEventsTable";

const INIT_FORM = { title:"", description:"", type:"hackathon", department:"All", difficulty:"Medium", deadline:"", reward_points:100, max_participants:"", tags:"" };

export default function Manager() {
  const { user } = useAuth();
  const [team, setTeam]           = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [events, setEvents] = useState([]);
  const [reviewing, setReviewing] = useState(null);
  const [feedbacks, setFeedbacks] = useState({});
  const [toast, setToast]         = useState({ msg:"", type:"" });
  const [activeTab, setActiveTab] = useState("team");

  // Create event state
  const [form, setForm]             = useState(INIT_FORM);
  const [creating, setCreating]     = useState(false);
  const [showForm, setShowForm]     = useState(false);

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast({msg:"",type:""}),3500); };

  useEffect(() => {
    Promise.all([usersAPI.team(), submissionsAPI.list(), eventsAPI.listAll()])
      .then(([t, s, i]) => { setTeam(t.data); setSubmissions(s.data); setEvents(i.data); });
  }, []);

  const handleReview = async (id, status) => {
    setReviewing(id);
    try {
      await submissionsAPI.review(id, { status, feedback: feedbacks[id] || (status==="approved"?"Approved!":"Needs revision.") });
      showToast(status==="approved" ? "Approved and points awarded!" : "Submission rejected.");
      const s = await submissionsAPI.list();
      setSubmissions(s.data);
    } catch(e) { showToast(e.response?.data?.detail || "Failed","error"); }
    finally { setReviewing(null); }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = {
        ...form,
        reward_points: parseInt(form.reward_points),
        max_participants: form.max_participants ? parseInt(form.max_participants) : null,
        deadline: new Date(form.deadline).toISOString(),
        tags: form.tags.split(",").map((t)=>t.trim()).filter(Boolean),
      };
      await eventsAPI.create(payload);
      showToast("Event created successfully! It is now pending Admin approval.");
      setForm(INIT_FORM); setShowForm(false);
      const i = await eventsAPI.listAll();
      setEvents(i.data);
    } catch(e) { showToast(e.response?.data?.detail || "Create failed","error"); }
    finally { setCreating(false); }
  };

  const pending = submissions.filter((s)=>s.status==="pending");
  const tabs = [
    { key:"team",      icon:"group",           label:"Team",      badge: team.length },
    { key:"approvals", icon:"pending_actions", label:"Approvals", badge: pending.length },
    { key:"events", icon:"explore",       label:"Events", badge: events.length },
  ];

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Manager View" />
        <div className="page-container">

          <div className="page-header flex-between">
            <div>
              <h2 className="page-title">Team Management</h2>
              <p className="page-subtitle">Monitor {user?.department} team engagement and approve submissions.</p>
            </div>
            {activeTab === "events" && (
              <button className="btn btn-primary" onClick={()=>setShowForm(!showForm)}>
                <span className="material-icons-round">{showForm?"close":"add"}</span>
                {showForm ? "Cancel" : "New Event"}
              </button>
            )}
          </div>

          {toast.msg && (
            <div className={`alert alert-${toast.type} mb-md animate-fade-in`}>
              <span className="material-icons-round">{toast.type==="error"?"error_outline":"check_circle"}</span>
              {toast.msg}
            </div>
          )}

          {/* Summary */}
          <div className="grid-3 stagger mb-lg">
            {[
              { icon:"group",          label:"Team Members",     value:team.length,     color:"primary"   },
              { icon:"pending_actions",label:"Pending Approvals",value:pending.length,  color:"gold"      },
              { icon:"bar_chart",      label:"Events",      value:events.length,color:"secondary"},
            ].map((s)=>(
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

          {/* Tabs */}
          <div className="wallet-tabs mb-lg">
            {tabs.map((t)=>(
              <button key={t.key} className={`wallet-tab ${activeTab===t.key?"active":""}`} onClick={()=>setActiveTab(t.key)}>
                <span className="material-icons-round">{t.icon}</span>
                {t.label}
                {t.badge > 0 && <span className="admin-tab-badge">{t.badge}</span>}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "team" && (
            <ManagerTeamGrid team={team} />
          )}

          {activeTab === "approvals" && (
            <ManagerApprovalsList 
              pending={pending}
              feedbacks={feedbacks}
              setFeedbacks={setFeedbacks}
              handleReview={handleReview}
              reviewing={reviewing}
            />
          )}

          {activeTab === "events" && (
            <ManagerEventsTable 
              events={events}
              showForm={showForm}
              form={form}
              setForm={setForm}
              handleCreateEvent={handleCreateEvent}
              creating={creating}
            />
          )}

        </div>
      </div>
    </div>
  );
}
