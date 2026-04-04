import { useState, useEffect } from 'react';
import { getUserAnalytics } from '../api/analytics';
import { getUserRank } from '../api/leaderboard';
import { RankCard } from '../components/RankCard';
import { CheckCircle, Clock, XCircle, Target } from 'lucide-react';

const MOCK_USER_ID = 'mock_user_123';

const MOCK_ANALYTICS = {
  user_id: MOCK_USER_ID,
  events_participated: 9,
  submissions_status_breakdown: { approved: 7, pending: 1, rejected: 1 },
  ranking_progress: [],
  points_earned_over_time: [],
};

const MOCK_RANK = {
  user_id: MOCK_USER_ID,
  rank: 4,
  name: 'Karan Singh',
  points: 1380,
  department: 'Sales',
  events_participated: 9,
};

export const Progress = () => {
  const [analytics, setAnalytics] = useState(MOCK_ANALYTICS);
  const [rankInfo, setRankInfo]   = useState(MOCK_RANK);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.allSettled([
      getUserAnalytics(MOCK_USER_ID),
      getUserRank(MOCK_USER_ID),
    ]).then(([analyticsResult, rankResult]) => {
      if (analyticsResult.status === 'fulfilled' && analyticsResult.value.data?.events_participated > 0)
        setAnalytics(analyticsResult.value.data);
      if (rankResult.status === 'fulfilled' && rankResult.value.data?.rank)
        setRankInfo(rankResult.value.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-text-secondary">Loading progress...</div>;

  const stats = analytics?.submissions_status_breakdown || {};
  const total = (stats.approved || 0) + (stats.pending || 0) + (stats.rejected || 0);
  const engagementPct = total > 0 ? Math.round(((stats.approved || 0) / total) * 100) : 0;

  return (
    <div className="space-y-xl">
      <div>
        <h2 className="mb-sm">My Progress</h2>
        <p className="text-text-secondary">Track your engagement, points, and event completions.</p>
      </div>

      {rankInfo && (
        <RankCard
          rank={rankInfo.rank}
          name={rankInfo.name}
          points={rankInfo.points}
          department={rankInfo.department}
          eventsParticipated={rankInfo.events_participated}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <div className="card text-center">
          <div className="mx-auto w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-md">
            <CheckCircle className="text-status-success" size={24} />
          </div>
          <h3 className="text-text-secondary text-sm">Approved</h3>
          <p className="text-2xl font-semibold mt-xs text-text-primary">{stats.approved || 0}</p>
        </div>

        <div className="card text-center">
          <div className="mx-auto w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mb-md">
            <Clock className="text-status-warning" size={24} />
          </div>
          <h3 className="text-text-secondary text-sm">Pending</h3>
          <p className="text-2xl font-semibold mt-xs text-text-primary">{stats.pending || 0}</p>
        </div>

        <div className="card text-center">
          <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-md">
            <XCircle className="text-status-error" size={24} />
          </div>
          <h3 className="text-text-secondary text-sm">Rejected</h3>
          <p className="text-2xl font-semibold mt-xs text-text-primary">{stats.rejected || 0}</p>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-lg flex items-center gap-sm">
          <Target className="text-primary" size={20} />
          Approval Rate
        </h3>
        <div className="w-full bg-background rounded-full h-4 mb-sm border border-border">
          <div
            className="bg-primary h-4 rounded-full transition-all duration-500 relative"
            style={{ width: `${engagementPct}%` }}
          >
            {engagementPct > 5 && (
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full shadow-sm border border-border" />
            )}
          </div>
        </div>
        <p className="text-right text-sm text-text-secondary font-medium">{engagementPct}% approval rate</p>
      </div>
    </div>
  );
};

export default Progress;
