import { useState, useEffect } from "react";
import { submissionsAPI, eventsAPI } from "../api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { format } from "date-fns";
import "./Submit.css";

const PROOF_TYPES = ["url", "certificate", "repository", "video", "file"];
const proofIcon = { url:"link", certificate:"workspace_premium", repository:"code", video:"videocam", file:"attach_file" };

export default function Submit() {
  const [enrolled, setEnrolled] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [form, setForm] = useState({ event_id:"", proof_type:"url", proof_url:"", notes:"" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg:"", type:"" });

  useEffect(() => {
    eventsAPI.enrolled().then((r) => setEnrolled(r.data.filter((e) => e.enrollment_status !== "completed")));
    submissionsAPI.list().then((r) => setSubmissions(r.data));
  }, []);

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:"", type:"" }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.event_id) return showToast("Select an event", "error");
    setLoading(true);
    try {
      let proof_url = form.proof_url;

      // If file proof, upload first
      if (form.proof_type === "file" && file) {
        const fd = new FormData();
        fd.append("file", file);
        const up = await submissionsAPI.uploadFile(fd);
        proof_url = up.data.file_url;
      }

      await submissionsAPI.create({ ...form, proof_url });
      showToast("Submission sent successfully! Awaiting review.");
      setForm({ event_id:"", proof_type:"url", proof_url:"", notes:"" });
      setFile(null);

      const [e2, s2] = await Promise.all([eventsAPI.enrolled(), submissionsAPI.list()]);
      setEnrolled(e2.data.filter((e) => e.enrollment_status !== "completed"));
      setSubmissions(s2.data);
    } catch (err) {
      showToast(err.response?.data?.detail || "Submission failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const statusIcon = { pending:"hourglass_empty", approved:"check_circle", rejected:"cancel" };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Submit Proof" />
        <div className="page-container">

          <div className="page-header">
            <h2 className="page-title">Activity Submission</h2>
            <p className="page-subtitle">Submit proof of completion for your enrolled events.</p>
          </div>

          {toast.msg && (
            <div className={`alert alert-${toast.type} mb-md animate-fade-in`}>
              <span className="material-icons-round">{toast.type==="error"?"error_outline":"check_circle"}</span>
              {toast.msg}
            </div>
          )}

          <div className="submit-layout">

            {/* Form */}
            <div className="card animate-slide-left">
              <h3 className="section-title mb-lg">New Submission</h3>
              <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:"var(--space-md)"}}>

                <div className="form-group">
                  <label className="form-label">Event *</label>
                  <select className="form-select" value={form.event_id} onChange={(e) => setForm({...form, event_id:e.target.value})} required>
                    <option value="">Select an event...</option>
                    {enrolled.map((i) => <option key={i.id} value={i.id}>{i.title}</option>)}
                  </select>
                  {enrolled.length === 0 && <p className="text-xs text-muted mt-sm">No active enrollments. Enroll in an event first.</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Proof Type *</label>
                  <div className="submit-proof-types">
                    {PROOF_TYPES.map((pt) => (
                      <button key={pt} type="button"
                        className={`submit-proof-pill ${form.proof_type===pt?"active":""}`}
                        onClick={() => setForm({...form, proof_type:pt})}>
                        <span className="material-icons-round">{proofIcon[pt]}</span>
                        {pt.charAt(0).toUpperCase()+pt.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {form.proof_type === "file" ? (
                  <div className="form-group">
                    <label className="form-label">Upload File *</label>
                    <div className="submit-file-drop" onClick={() => document.getElementById("fileInput").click()}>
                      <span className="material-icons-round">cloud_upload</span>
                      <p>{file ? file.name : "Click to select file"}</p>
                      <p className="text-xs">PDF, PNG, JPG, MP4 (max 50MB)</p>
                    </div>
                    <input id="fileInput" type="file" style={{display:"none"}} onChange={(e) => setFile(e.target.files[0])} />
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="form-label">
                      {form.proof_type === "url" ? "URL Link *" : form.proof_type === "certificate" ? "Certificate URL *" : form.proof_type === "repository" ? "Repository URL *" : "Video URL *"}
                    </label>
                    <input className="form-input" type="url"
                      placeholder="https://..."
                      value={form.proof_url}
                      onChange={(e) => setForm({...form, proof_url:e.target.value})}
                      required />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Notes (optional)</label>
                  <textarea className="form-textarea" placeholder="Brief description of your work..." value={form.notes} onChange={(e) => setForm({...form, notes:e.target.value})} />
                </div>

                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? <span className="spinner spinner-sm"/> : <span className="material-icons-round">send</span>}
                  {loading ? "Submitting..." : "Submit Proof"}
                </button>
              </form>
            </div>

            {/* History */}
            <div className="card animate-slide-right">
              <h3 className="section-title mb-lg">Submission History</h3>
              {submissions.length === 0 ? (
                <div className="empty-state"><span className="material-icons-round">history</span><p>No submissions yet.</p></div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:"var(--space-sm)"}}>
                  {submissions.map((s) => (
                    <div key={s.id} className="submit-history-item">
                      <div className={`submit-status-dot submit-status-${s.status}`}>
                        <span className="material-icons-round">{statusIcon[s.status]}</span>
                      </div>
                      <div style={{flex:1}}>
                        <p className="font-semibold text-sm">{s.event_title}</p>
                        <p className="text-xs text-muted">{format(new Date(s.submitted_at), "MMM d, yyyy")}</p>
                        {s.feedback && <p className="text-xs mt-sm" style={{color:"var(--text-secondary)"}}>{s.feedback}</p>}
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <span className={`badge status-${s.status}`}>{s.status}</span>
                        {s.points_awarded && <p className="text-xs text-gold font-bold mt-sm">+{s.points_awarded} pts</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
