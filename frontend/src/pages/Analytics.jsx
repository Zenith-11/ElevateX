import { useState, useEffect } from "react";
import { analyticsAPI } from "../api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import "./Analytics.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

const CHART_OPTS = {
  responsive: true,
  plugins: { legend: { labels: { color: "#a8a8cc", font: { family: "Inter" } } } },
  scales: {
    x: { ticks: { color: "#6868a0" }, grid: { color: "rgba(255,255,255,0.04)" } },
    y: { ticks: { color: "#6868a0" }, grid: { color: "rgba(255,255,255,0.04)" } },
  },
};

export default function Analytics() {
  const [overview, setOverview] = useState(null);
  const [deptData, setDeptData] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([analyticsAPI.overview(), analyticsAPI.department(), analyticsAPI.topPerformers(8)])
      .then(([o, d, t]) => { setOverview(o.data); setDeptData(d.data); setTopPerformers(t.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Analytics" />
        <div className="flex-center" style={{height:"80vh"}}><div className="spinner"/></div>
      </div>
    </div>
  );

  const monthlyChart = {
    labels: overview?.monthly_trend?.map((m) => m.month) || [],
    datasets: [{
      label: "Enrollments",
      data: overview?.monthly_trend?.map((m) => m.enrollments) || [],
      backgroundColor: "rgba(108,63,230,0.3)",
      borderColor: "#6C3FE6",
      borderWidth: 2,
      fill: true,
      tension: 0.4,
    }],
  };

  const deptEngagement = {
    labels: deptData.map((d) => d.department),
    datasets: [
      { label: "Enrolled",  data: deptData.map((d) => d.enrolled),  backgroundColor: "rgba(108,63,230,0.7)"  },
      { label: "Completed", data: deptData.map((d) => d.completed), backgroundColor: "rgba(0,212,170,0.7)"  },
    ],
  };

  const completionDoughnut = {
    labels: ["Completed", "In Progress", "Pending"],
    datasets: [{
      data: [overview?.total_completions||0, (overview?.total_enrollments||0)-(overview?.total_completions||0), overview?.total_pending||0],
      backgroundColor: ["rgba(0,212,170,0.8)", "rgba(108,63,230,0.8)", "rgba(255,184,0,0.8)"],
      borderColor: ["#00D4AA","#6C3FE6","#FFB800"],
      borderWidth: 2,
    }],
  };

  const statCards = [
    { label:"Total Employees", value:overview?.total_users||0,            icon:"group",          color:"primary"   },
    { label:"Events",     value:overview?.total_events||0,      icon:"explore",        color:"secondary" },
    { label:"Participation",   value:`${overview?.participation_rate||0}%`, icon:"bar_chart",    color:"gold"      },
    { label:"Completion Rate", value:`${overview?.completion_rate||0}%`,  icon:"check_circle",   color:"accent"    },
  ];

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Analytics" />
        <div className="page-container">

          <div className="page-header flex-between">
            <div>
              <h2 className="page-title">Analytics Dashboard</h2>
              <p className="page-subtitle">Real-time engagement metrics and organizational insights.</p>
            </div>
          </div>

          <div className="grid-4 stagger mb-lg">
            {statCards.map((s)=>(
              <div key={s.label} className="card flex-between hover-lift animate-fade-in">
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

          <div className="grid-2 mb-lg">
            <div className="card animate-slide-left">
              <h3 className="section-title mb-lg">Enrollment Trend (6 months)</h3>
              <Line data={monthlyChart} options={{...CHART_OPTS, plugins:{...CHART_OPTS.plugins, legend:{display:false}}}} />
            </div>
            <div className="card animate-slide-right">
              <h3 className="section-title mb-lg">Completion Overview</h3>
              <div style={{maxWidth:280,margin:"0 auto"}}>
                <Doughnut data={completionDoughnut} options={{plugins:{legend:{labels:{color:"#a8a8cc",font:{family:"Inter"}}}}}} />
              </div>
            </div>
          </div>

          <div className="card mb-lg animate-fade-in">
            <h3 className="section-title mb-lg">Department Engagement</h3>
            <Bar data={deptEngagement} options={CHART_OPTS} />
          </div>

          <div className="card animate-fade-in">
            <h3 className="section-title mb-lg">Top Performers</h3>
            <div className="table-wrapper">
              <table className="data-table">
                <thead><tr><th>Rank</th><th>Employee</th><th>Dept</th><th>Completions</th><th>Badges</th><th>Points</th></tr></thead>
                <tbody>
                  {topPerformers.map((p)=>(
                    <tr key={p.user_id}>
                      <td>
                        <span className={`font-bold ${p.rank===1?"text-gold":p.rank===2?"text-secondary":p.rank===3?"text-accent":"text-muted"}`}>
                          #{p.rank}
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-gap-sm" style={{alignItems:"center"}}>
                          <div className="avatar avatar-sm">{p.name.split(" ").map((n)=>n[0]).join("").slice(0,2)}</div>
                          <span className="font-semibold">{p.name}</span>
                        </div>
                      </td>
                      <td className="text-muted">{p.department}</td>
                      <td>{p.completions}</td>
                      <td>{p.badge_count}</td>
                      <td className="text-gold font-bold">{p.points.toLocaleString()} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
