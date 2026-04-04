import { useState, useEffect, useCallback } from 'react';
import { getGlobalLeaderboard, getDepartmentLeaderboard } from '../api/leaderboard';
import { LeaderboardTable } from '../components/LeaderboardTable';

const DEPARTMENTS = ['All', 'Engineering', 'Marketing', 'Sales', 'HR', 'Design'];
const REFRESH_INTERVAL = 30000;

const MOCK_DATA = [
  { user_id: '1', rank: 1, name: 'Aisha Patel',      department: 'Engineering', events_participated: 12, submissions_approved: 11, points: 1850 },
  { user_id: '2', rank: 2, name: 'Rohan Mehta',      department: 'Marketing',   events_participated: 10, submissions_approved: 9,  points: 1620 },
  { user_id: '3', rank: 3, name: 'Priya Sharma',     department: 'Design',      events_participated: 11, submissions_approved: 10, points: 1540 },
  { user_id: '4', rank: 4, name: 'Karan Singh',      department: 'Sales',       events_participated: 9,  submissions_approved: 8,  points: 1380 },
  { user_id: '5', rank: 5, name: 'Neha Gupta',       department: 'HR',          events_participated: 8,  submissions_approved: 7,  points: 1200 },
  { user_id: '6', rank: 6, name: 'Arjun Verma',      department: 'Engineering', events_participated: 10, submissions_approved: 8,  points: 1150 },
  { user_id: '7', rank: 7, name: 'Sneha Reddy',      department: 'Marketing',   events_participated: 7,  submissions_approved: 6,  points: 980  },
  { user_id: '8', rank: 8, name: 'Vikram Nair',      department: 'Sales',       events_participated: 8,  submissions_approved: 7,  points: 920  },
  { user_id: '9', rank: 9, name: 'Divya Krishnan',   department: 'Design',      events_participated: 6,  submissions_approved: 5,  points: 860  },
  { user_id:'10', rank:10, name: 'Amit Joshi',        department: 'Engineering', events_participated: 7,  submissions_approved: 6,  points: 810  },
  { user_id:'11', rank:11, name: 'Pooja Iyer',        department: 'HR',          events_participated: 6,  submissions_approved: 5,  points: 760  },
  { user_id:'12', rank:12, name: 'Rahul Desai',       department: 'Marketing',   events_participated: 5,  submissions_approved: 4,  points: 700  },
];

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState(MOCK_DATA);
  const [department, setDepartment] = useState('All');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(MOCK_DATA.length);
  const [loading, setLoading] = useState(false);
  const limit = 20;

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      if (department === 'All') {
        const res = await getGlobalLeaderboard(page, limit);
        const data = res.data.data || [];
        if (data.length > 0) { setLeaderboard(data); setTotal(res.data.total || data.length); }
        else { setLeaderboard(MOCK_DATA); setTotal(MOCK_DATA.length); }
      } else {
        const res = await getDepartmentLeaderboard(department);
        const data = res.data.data || res.data || [];
        if (data.length > 0) { setLeaderboard(data); setTotal(data.length); }
        else {
          const filtered = MOCK_DATA.filter(u => u.department === department).map((u, i) => ({ ...u, rank: i + 1 }));
          setLeaderboard(filtered); setTotal(filtered.length);
        }
      }
    } catch {
      const filtered = department === 'All' ? MOCK_DATA : MOCK_DATA.filter(u => u.department === department).map((u, i) => ({ ...u, rank: i + 1 }));
      setLeaderboard(filtered); setTotal(filtered.length);
    } finally {
      setLoading(false);
    }
  }, [department, page]);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
        <div>
          <h2 className="mb-sm">Leaderboard</h2>
          <p className="text-text-secondary">Top performers — refreshes every 30s.</p>
        </div>
        <div className="flex items-center space-x-sm">
          <span className="text-sm font-medium text-text-secondary">Department:</span>
          <select
            className="input-field w-[180px]"
            value={department}
            onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
          >
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading
          ? <div className="p-xl text-center text-text-secondary">Loading...</div>
          : <LeaderboardTable data={leaderboard} />
        }
      </div>

      {department === 'All' && totalPages > 1 && (
        <div className="flex items-center justify-center gap-sm">
          <button className="btn-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
          <span className="text-text-secondary text-sm">Page {page} of {totalPages}</span>
          <button className="btn-secondary" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
