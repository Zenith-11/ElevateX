import { format } from "date-fns";

export default function ManagerApprovalsList({ 
  pending, 
  feedbacks, 
  setFeedbacks, 
  handleReview, 
  reviewing 
}) {
  return (
    <div className="animate-fade-in">
      {pending.length === 0 ? (
        <div className="empty-state card">
          <span className="material-icons-round">task_alt</span>
          <p>No pending submissions! Everything is reviewed.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          {pending.map((s) => (
            <div key={s.id} className="card manager-approval-card">
              <div className="manager-approval-header">
                <div>
                  <h4 className="font-semibold">{s.event_title}</h4>
                  <p className="text-sm text-muted">
                    {s.user_name} · Submitted {format(new Date(s.submitted_at), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex flex-gap-sm">
                  <span className="badge badge-muted">{s.proof_type}</span>
                  <a href={s.proof_url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                    <span className="material-icons-round">open_in_new</span>View Proof
                  </a>
                </div>
              </div>
              {s.notes && (
                <p 
                  className="text-sm text-secondary" 
                  style={{ padding: "var(--space-sm) var(--space-md)", background: "var(--bg-glass-light)", borderRadius: "var(--radius-md)" }}
                >
                  {s.notes}
                </p>
              )}
              <div className="manager-approval-actions">
                <textarea 
                  className="form-textarea" 
                  placeholder="Feedback (optional)..." 
                  rows={2}
                  value={feedbacks[s.id] || ""} 
                  onChange={(e) => setFeedbacks({ ...feedbacks, [s.id]: e.target.value })} 
                />
                <div className="flex flex-gap-sm">
                  <button 
                    className="btn btn-success" 
                    onClick={() => handleReview(s.id, "approved")} 
                    disabled={reviewing === s.id}
                  >
                    {reviewing === s.id ? <span className="spinner spinner-sm" /> : <span className="material-icons-round">check_circle</span>}
                    Approve
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleReview(s.id, "rejected")} 
                    disabled={reviewing === s.id}
                  >
                    <span className="material-icons-round">cancel</span>Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
