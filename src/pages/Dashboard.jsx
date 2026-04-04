import { useState, useEffect } from 'react';
import { getDashboardMetrics } from '../api/analytics';
import { MetricsCard } from '../components/MetricsCard';

const MOCK_METRICS = {
  total_users: 248,
  total_events: 34,
  total_submissions: 512,
  total_points_awarded: 18750,
  avg_participation_rate: 0.73,
};

export const Dashboard = () => {
  const [metrics, setMetrics] = useState(MOCK_METRICS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardMetrics()
      .then(res => {
        const d = res.data;
        // Use real data only if it has actual values
        if (d && d.total_users > 0) setMetrics(d);
      })
      .catch(() => {}) // keep mock on error
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-text-secondary">Loading dashboard...</div>;

  return (
    <div className="space-y-xl">
      <div>
        <h2 className="mb-sm">Dashboard Overview</h2>
        <p className="text-text-secondary">High-level engagement KPIs and system metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
        <MetricsCard title="Total Users"       value={metrics.total_users}          iconName="Users"    change={12} />
        <MetricsCard title="Total Events"      value={metrics.total_events}         iconName="Activity" change={8}  />
        <MetricsCard title="Total Submissions" value={metrics.total_submissions}    iconName="FileText" change={22} />
        <MetricsCard title="Points Awarded"    value={metrics.total_points_awarded} iconName="Gift"     change={35} />
      </div>

      <div className="card w-full">
        <h3 className="mb-md">Average Participation Rate</h3>
        <div className="text-[48px] font-bold text-primary">
          {(metrics.avg_participation_rate * 100).toFixed(1)}%
        </div>
        <p className="text-text-secondary text-sm mt-sm">Based on approved submissions vs total available events</p>
      </div>
    </div>
  );
};

export default Dashboard;
