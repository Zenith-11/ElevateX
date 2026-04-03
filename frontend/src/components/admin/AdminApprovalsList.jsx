import { format } from "date-fns";

export default function AdminApprovalsList({ 
  pendingSubmissions, 
  handleReview, 
  reviewing 
}) {
  return (
    <div className="card animate-fade-in">
      {pendingSubmissions.length === 0 ? (
        <div className="empty-state">
          <span className="material-icons-round">task_alt</span>
          <p>No pending submissions!</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Event</th>
                <th>Proof Type</th>
                <th>Proof</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingSubmissions.map((s) => (
                <tr key={s.id}>
                  <td className="font-semibold">{s.user_name}</td>
                  <td>{s.event_title}</td>
                  <td><span className="badge badge-muted">{s.proof_type}</span></td>
                  <td>
                    <a 
                      href={s.proof_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn btn-secondary btn-sm"
                    >
                      <span className="material-icons-round">open_in_new</span>
                    </a>
                  </td>
                  <td className="text-muted text-sm">{format(new Date(s.submitted_at), "MMM d, yyyy")}</td>
                  <td>
                    <div className="flex flex-gap-sm">
                      <button 
                        className="btn btn-success btn-sm" 
                        onClick={() => handleReview(s.id, "approved")} 
                        disabled={reviewing === s.id}
                      >
                        <span className="material-icons-round">check</span> Approve
                      </button>
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => handleReview(s.id, "rejected")} 
                        disabled={reviewing === s.id}
                      >
                        <span className="material-icons-round">close</span> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
