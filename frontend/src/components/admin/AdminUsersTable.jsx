export default function AdminUsersTable({ 
  users, 
  handleRoleChange 
}) {
  return (
    <div className="card animate-fade-in">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Role</th>
              <th>Points</th>
              <th>Badges</th>
              <th>Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="flex flex-gap-sm" style={{ alignItems: "center" }}>
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt="" className="avatar avatar-sm" style={{ objectFit: "cover" }} />
                    ) : (
                      <div className="avatar avatar-sm">{u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</div>
                    )}
                    <span className="font-semibold">{u.name}</span>
                  </div>
                </td>
                <td className="text-muted text-sm">{u.email}</td>
                <td className="text-muted">{u.department}</td>
                <td>
                  <span className={`badge ${u.role === "admin" ? "badge-primary" : u.role === "manager" ? "badge-warning" : "badge-success"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="text-gold font-bold">{u.points.toLocaleString()}</td>
                <td>{u.badges.length}</td>
                <td>
                  <select 
                    className="form-select" 
                    style={{ width: "auto", padding: "4px 8px", fontSize: "0.8rem" }}
                    value={u.role} 
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
