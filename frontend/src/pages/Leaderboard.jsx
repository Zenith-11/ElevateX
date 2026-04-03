import { useState, useEffect } from "react";
import { leaderboardAPI } from "../api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "./Leaderboard.css";

const SCOPES  = ["org", "department"];
const PERIODS = ["all", "monthly", "weekly"];

export default function Leaderboard() {
  const [board, setBoard]   = useState([]);
  const [scope, setScope]   = useState("org");
  const [period, setPeriod] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    leaderboardAPI.get({ scope, period })
      .then((r) => setBoard(r.data))
      .finally(() => setLoading(false));
  }, [scope, period]);

  const rankIcon  = (rank) => rank === 1 ? "looks_one" : rank === 2 ? "looks_two" : rank === 3 ? "looks_3" : null;
  const rankColor = (rank) => rank === 1 ? "gold" : rank === 2 ? "silver" : rank === 3 ? "bronze" : "default";

  const top3 = board.slice(0, 3);
  const rest  = board.slice(3);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Leaderboard" />
        <div className="page-container">

          <div className="page-header">
            <h2 className="page-title">Leaderboard</h2>
            <p className="page-subtitle">See how you stack up against your colleagues.</p>
          </div>

          {/* Controls */}
          <div className="lb-controls card mb-lg">
            <div className="lb-toggle-group">
              <p className="text-xs text-muted font-semibold" style={{textTransform:"uppercase",letterSpacing:"0.06em"}}>Scope</p>
              <div className="lb-pills">
                {SCOPES.map((s) => (
                  <button key={s} className={`lb-pill ${scope===s?"active":""}`} onClick={() => setScope(s)}>
                    <span className="material-icons-round">{s==="org"?"corporate_fare":"group"}</span>
                    {s === "org" ? "Organization" : "Department"}
                  </button>
                ))}
              </div>
            </div>
            <div className="lb-toggle-group">
              <p className="text-xs text-muted font-semibold" style={{textTransform:"uppercase",letterSpacing:"0.06em"}}>Period</p>
              <div className="lb-pills">
                {PERIODS.map((p) => (
                  <button key={p} className={`lb-pill ${period===p?"active":""}`} onClick={() => setPeriod(p)}>
                    <span className="material-icons-round">{p==="all"?"all_inclusive":p==="monthly"?"calendar_month":"date_range"}</span>
                    {p.charAt(0).toUpperCase()+p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex-center" style={{height:200}}><div className="spinner"/></div>
          ) : board.length === 0 ? (
            <div className="empty-state card"><span className="material-icons-round">emoji_events</span><p>No data for this period yet.</p></div>
          ) : (
            <>
              {/* Top 3 Podium */}
              {top3.length >= 3 && (
                <div className="lb-podium mb-lg animate-scale-in">
                  {[top3[1], top3[0], top3[2]].map((entry, podiumIdx) => {
                    const actualRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
                    const colors = { 1:"var(--gold)", 2:"var(--text-secondary)", 3:"#cd7f32" };
                    return (
                      <div key={entry.user_id} className={`lb-podium-item lb-podium-${actualRank} ${entry.is_current_user?"lb-me":""}`}>
                        <div className="lb-podium-avatar avatar avatar-lg" style={{border:`3px solid ${colors[actualRank]}`, padding: 0, overflow: 'hidden'}}>
                          {entry.avatar_url ? (
                            <img src={entry.avatar_url} alt="" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}} />
                          ) : (
                            entry.name.split(" ").map((n)=>n[0]).join("").slice(0,2)
                          )}
                        </div>
                        <p className="lb-podium-name">{entry.name}</p>
                        <p className="text-xs text-muted">{entry.department}</p>
                        <div className="lb-podium-pts" style={{color:colors[actualRank]}}>
                          <span className="material-icons-round">stars</span>
                          {entry.points.toLocaleString()}
                        </div>
                        <div className="lb-podium-rank" style={{background:colors[actualRank]}}>#{actualRank}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Full list */}
              <div className="card animate-fade-in">
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Badges</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {board.map((entry) => (
                        <tr key={entry.user_id} className={entry.is_current_user ? "lb-current-user-row" : ""}>
                          <td>
                            <div className={`lb-rank lb-rank-${rankColor(entry.rank)}`}>
                              {entry.rank <= 3 ? (
                                <span className="material-icons-round">{rankIcon(entry.rank)}</span>
                              ) : `#${entry.rank}`}
                            </div>
                          </td>
                          <td>
                            <div className="flex flex-gap-sm" style={{alignItems:"center"}}>
                              <div className="avatar avatar-sm" style={entry.avatar_url ? {padding: 0, overflow: 'hidden'} : {}}>
                                {entry.avatar_url ? (
                                  <img src={entry.avatar_url} alt="" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}} />
                                ) : (
                                  entry.name.split(" ").map((n)=>n[0]).join("").slice(0,2)
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{entry.name}{entry.is_current_user && <span className="badge badge-primary" style={{marginLeft:6,fontSize:"0.65rem"}}>You</span>}</p>
                              </div>
                            </div>
                          </td>
                          <td className="text-muted">{entry.department}</td>
                          <td>
                            <span className="badge badge-muted">{entry.badges?.length || 0} badges</span>
                          </td>
                          <td>
                            <span className="font-bold text-gold">{entry.points.toLocaleString()} pts</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
