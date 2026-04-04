import { useState, useEffect } from 'react';
import { getEngagementTrends } from '../api/analytics';
import { LineChart, BarChart } from '../components/ChartWrapper';

const MOCK_TRENDS = [
  { date: '01 Mar', points: 320,  submissions: 18, participation: 0.52 },
  { date: '08 Mar', points: 480,  submissions: 24, participation: 0.61 },
  { date: '15 Mar', points: 390,  submissions: 20, participation: 0.58 },
  { date: '22 Mar', points: 610,  submissions: 31, participation: 0.70 },
  { date: '29 Mar', points: 540,  submissions: 27, participation: 0.65 },
  { date: '05 Apr', points: 720,  submissions: 36, participation: 0.78 },
  { date: '12 Apr', points: 850,  submissions: 42, participation: 0.83 },
];

export const Analytics = () => {
  const [trends, setTrends] = useState(MOCK_TRENDS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEngagementTrends()
      .then(res => { if (res.data?.length > 0) setTrends(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-text-secondary">Loading analytics...</div>;

  const labels = trends.map(t => t.date);

  const pointsData = {
    labels,
    datasets: [{
      label: 'Points Earned',
      data: trends.map(t => t.points),
      borderColor: '#6366F1',
      backgroundColor: 'rgba(99, 102, 241, 0.08)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#6366F1',
    }],
  };

  const submissionsData = {
    labels,
    datasets: [{
      label: 'Submissions',
      data: trends.map(t => t.submissions),
      backgroundColor: '#10B981',
      borderRadius: 6,
    }],
  };

  const participationData = {
    labels,
    datasets: [{
      label: 'Participation Rate (%)',
      data: trends.map(t => (t.participation * 100).toFixed(1)),
      borderColor: '#F59E0B',
      backgroundColor: 'rgba(245, 158, 11, 0.08)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#F59E0B',
    }],
  };

  return (
    <div className="space-y-xl">
      <div>
        <h2 className="mb-sm">Analytics</h2>
        <p className="text-text-secondary">Engagement and performance trends over time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <div className="card"><LineChart data={pointsData}       title="Points Engagement Trend" /></div>
        <div className="card"><BarChart  data={submissionsData}  title="Weekly Submissions" /></div>
        <div className="card lg:col-span-2"><LineChart data={participationData} title="Participation Rate (%)" /></div>
      </div>
    </div>
  );
};

export default Analytics;
