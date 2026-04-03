import { format } from "date-fns";

export default function AdminEventsGrid({ 
  events, 
  showForm, 
  form, 
  setForm, 
  creating, 
  handleCreateEvent, 
  handleDeleteInit, 
  handleApproveInit 
}) {
  return (
    <>
      {/* Create Form */}
      {showForm && (
        <div className="card mb-lg animate-scale-in">
          <h3 className="section-title mb-lg">Create Event</h3>
          <form onSubmit={handleCreateEvent} className="admin-form">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input 
                className="form-input" 
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
                required 
              />
            </div>
            <div className="form-group" style={{ gridColumn: "1/-1" }}>
              <label className="form-label">Description *</label>
              <textarea 
                className="form-textarea" 
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select 
                className="form-select" 
                value={form.type} 
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {["hackathon", "course", "campaign", "training", "challenge"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select 
                className="form-select" 
                value={form.department} 
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              >
                {["All", "Engineering", "Design", "Marketing", "HR", "Finance", "Operations"].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select 
                className="form-select" 
                value={form.difficulty} 
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              >
                {["Easy", "Medium", "Hard"].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Deadline *</label>
              <input 
                type="datetime-local" 
                className="form-input" 
                value={form.deadline} 
                onChange={(e) => setForm({ ...form, deadline: e.target.value })} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Reward Points *</label>
              <input 
                type="number" 
                className="form-input" 
                min="1" 
                value={form.reward_points} 
                onChange={(e) => setForm({ ...form, reward_points: e.target.value })} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Max Participants</label>
              <input 
                type="number" 
                className="form-input" 
                placeholder="Unlimited" 
                value={form.max_participants} 
                onChange={(e) => setForm({ ...form, max_participants: e.target.value })} 
              />
            </div>
            <div className="form-group" style={{ gridColumn: "1/-1" }}>
              <label className="form-label">Tags (comma-separated)</label>
              <input 
                className="form-input" 
                placeholder="python, learning, backend" 
                value={form.tags} 
                onChange={(e) => setForm({ ...form, tags: e.target.value })} 
              />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <button className="btn btn-primary" type="submit" disabled={creating}>
                {creating ? <span className="spinner spinner-sm" /> : <span className="material-icons-round">add_circle</span>}
                {creating ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card animate-fade-in">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Type</th>
                <th>Dept</th>
                <th>Difficulty</th>
                <th>Reward</th>
                <th>Enrolled</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((i) => (
                <tr key={i.id}>
                  <td className="font-semibold">{i.title}</td>
                  <td>
                    <span className={`badge ${i.status === "active" ? "badge-success" : "badge-warning"}`}>
                      {i.status}
                    </span>
                  </td>
                  <td><span className="badge badge-muted">{i.type}</span></td>
                  <td className="text-muted text-sm">{i.department}</td>
                  <td>
                    <span className={`badge ${i.difficulty === "Easy" ? "badge-success" : i.difficulty === "Medium" ? "badge-warning" : "badge-danger"}`}>
                      {i.difficulty}
                    </span>
                  </td>
                  <td className="text-gold font-bold">{i.reward_points} pts</td>
                  <td>{i.enrolled_count}</td>
                  <td className="text-muted text-sm">{format(new Date(i.deadline), "MMM d, yyyy")}</td>
                  <td>
                    <div className="flex flex-gap-sm">
                      {i.status === "pending" && (
                        <button className="btn btn-success btn-sm" onClick={() => handleApproveInit(i.id)} title="Approve">
                          <span className="material-icons-round">check</span>
                        </button>
                      )}
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteInit(i.id)} title="Delete">
                        <span className="material-icons-round">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
