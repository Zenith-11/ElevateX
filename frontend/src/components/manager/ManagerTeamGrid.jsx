export default function ManagerTeamGrid({ team }) {
  return (
    <div className="animate-fade-in">
      {team.length === 0 ? (
        <div className="empty-state card">
          <span className="material-icons-round">group</span>
          <p>No team members in your department yet.</p>
        </div>
      ) : (
        <div className="manager-team-grid">
          {team.map((member) => (
            <div key={member.id} className="card hover-lift manager-member-card animate-fade-in">
              <div className="manager-member-top">
                {member.avatar_url ? (
                  <img src={member.avatar_url} alt="" className="avatar avatar-lg" style={{ objectFit: "cover" }} />
                ) : (
                  <div className="avatar avatar-lg">{member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</div>
                )}
                <div>
                  <h4 className="manager-member-name">{member.name}</h4>
                  <p className="text-muted text-sm">{member.department}</p>
                  <span className={`badge ${member.role === "manager" ? "badge-warning" : "badge-success"}`}>
                    {member.role}
                  </span>
                </div>
              </div>
              <div className="manager-member-stats">
                <div className="manager-member-stat">
                  <p className="text-xs text-muted">Points</p>
                  <p className="font-bold text-gold">{(member.points || 0).toLocaleString()}</p>
                </div>
                <div className="manager-member-stat">
                  <p className="text-xs text-muted">Badges</p>
                  <p className="font-bold">{member.badges.length}</p>
                </div>
              </div>
              {member.badges.length > 0 && (
                <div className="flex flex-wrap flex-gap-sm">
                  {member.badges.slice(0, 3).map((b) => (
                    <span key={b} className="badge badge-primary text-xs">{b}</span>
                  ))}
                  {member.badges.length > 3 && (
                    <span className="badge badge-muted text-xs">+{member.badges.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
