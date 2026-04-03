import { useState, useEffect } from "react";
import { eventsAPI, submissionsAPI, usersAPI, analyticsAPI } from "../api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { format } from "date-fns";
import "./Admin.css";

import AdminEventsGrid from "../components/admin/AdminEventsGrid";
import AdminApprovalsList from "../components/admin/AdminApprovalsList";
import AdminUsersTable from "../components/admin/AdminUsersTable";

const INIT_FORM = { title:"", description:"", type:"hackathon", department:"All", difficulty:"Medium", deadline:"", reward_points:100, max_participants:"", tags:"" };

export default function Admin() {
  const [tab, setTab]               = useState("events");
  const [events, setEvents] = useState([]);
  const [users, setUsers]           = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [form, setForm]             = useState(INIT_FORM);
  const [creating, setCreating]     = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [toast, setToast]           = useState({ msg:"", type:"" });
  const [reviewing, setReviewing]   = useState(null);

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast({msg:"",type:""}),3500); };

  const fetchAll = async () => {
    const [i, u, s] = await Promise.all([eventsAPI.listAll(), usersAPI.list(), submissionsAPI.list()]);
    setEvents(i.data); setUsers(u.data); setSubmissions(s.data);
  };

  useEffect(() => { fetchAll(); }, []);

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
      showToast("Event created successfully!");
      setForm(INIT_FORM); setShowForm(false);
      await fetchAll();
    } catch(e) { showToast(e.response?.data?.detail || "Create failed","error"); }
    finally { setCreating(false); }
  };

  const handleDeleteInit = async (id) => {
    if (!confirm("Delete this event?")) return;
    await eventsAPI.delete(id);
    showToast("Event deleted");
    await fetchAll();
  };

  const handleApproveInit = async (id) => {
    if (!confirm("Approve this event to make it active?")) return;
    try {
      await eventsAPI.approve(id);
      showToast("Event approved and is now active!");
      await fetchAll();
    } catch(e) { showToast("Failed to approve","error"); }
  };

  const handleReview = async (id, status) => {
    setReviewing(id);
    try {
      await submissionsAPI.review(id, { status, feedback: status==="approved" ? "Great work!" : "Needs revision" });
      showToast(status==="approved" ? "Submission approved! Points awarded." : "Submission rejected.");
      await fetchAll();
    } catch(e) { showToast(e.response?.data?.detail || "Review failed","error"); }
    finally { setReviewing(null); }
  };

  const handleRoleChange = async (userId, role) => {
    await usersAPI.updateRole(userId, role);
    showToast("Role updated");
    await fetchAll();
  };

  const handleExportCsv = async () => {
    try {
      const response = await analyticsAPI.exportCsv();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'participation_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast("CSV downloaded successfully!");
    } catch(e) { showToast("Failed to download CSV", "error"); }
  };

  const pendingSubmissions = submissions.filter((s)=>s.status==="pending");

  const tabs = [
    { key:"events", icon:"explore",              label:"Events",  badge: events.length },
    { key:"approvals",   icon:"pending_actions",      label:"Approvals",    badge: pendingSubmissions.length },
    { key:"users",       icon:"manage_accounts",      label:"Users",        badge: users.length },
  ];

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Admin Panel" />
        <div className="page-container">

          <div className="page-header flex-between">
            <div>
              <h2 className="page-title">Admin Panel</h2>
              <p className="page-subtitle">Manage events, validate submissions, and control user roles.</p>
            </div>
            {tab === "events" && (
              <button className="btn btn-primary" onClick={()=>setShowForm(!showForm)}>
                <span className="material-icons-round">{showForm?"close":"add"}</span>
                {showForm ? "Cancel" : "New Event"}
              </button>
            )}
            {tab === "users" && (
              <button className="btn btn-secondary" onClick={handleExportCsv}>
                <span className="material-icons-round">download</span>
                Export CSV History
              </button>
            )}
          </div>

          {toast.msg && (
            <div className={`alert alert-${toast.type} mb-md animate-fade-in`}>
              <span className="material-icons-round">{toast.type==="error"?"error_outline":"check_circle"}</span>
              {toast.msg}
            </div>
          )}

          {/* Tabs */}
          <div className="wallet-tabs mb-lg">
            {tabs.map((t) => (
              <button key={t.key} className={`wallet-tab ${tab===t.key?"active":""}`} onClick={()=>setTab(t.key)}>
                <span className="material-icons-round">{t.icon}</span>
                {t.label}
                {t.badge > 0 && <span className="admin-tab-badge">{t.badge}</span>}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {tab === "events" && (
            <AdminEventsGrid 
              events={events}
              showForm={showForm}
              form={form}
              setForm={setForm}
              creating={creating}
              handleCreateEvent={handleCreateEvent}
              handleDeleteInit={handleDeleteInit}
              handleApproveInit={handleApproveInit}
            />
          )}

          {tab === "approvals" && (
            <AdminApprovalsList 
              pendingSubmissions={pendingSubmissions}
              handleReview={handleReview}
              reviewing={reviewing}
            />
          )}

          {tab === "users" && (
            <AdminUsersTable 
              users={users}
              handleRoleChange={handleRoleChange}
            />
          )}

        </div>
      </div>
    </div>
  );
}
