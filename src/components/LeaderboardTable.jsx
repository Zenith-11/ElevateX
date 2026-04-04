import React from 'react';

export const LeaderboardTable = ({ data }) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-background text-text-secondary text-sm">
            <th className="py-md px-lg font-medium border-b border-border w-[80px]">Rank</th>
            <th className="py-md px-lg font-medium border-b border-border">User</th>
            <th className="py-md px-lg font-medium border-b border-border">Department</th>
            <th className="py-md px-lg font-medium border-b border-border text-right">Events</th>
            <th className="py-md px-lg font-medium border-b border-border text-right">Submissions</th>
            <th className="py-md px-lg font-medium border-b border-border text-right">Points</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.user_id} className={`border-b border-border/50 hover:bg-background/50 transition-colors ${idx < 3 ? 'bg-primary/5' : ''}`}>
              <td className="py-md px-lg font-semibold">
                {row.rank === 1 && <span className="text-yellow-500">🏆 1</span>}
                {row.rank === 2 && <span className="text-gray-400">🥈 2</span>}
                {row.rank === 3 && <span className="text-amber-700">🥉 3</span>}
                {row.rank > 3 && row.rank}
              </td>
              <td className="py-md px-lg font-medium text-text-primary">{row.name}</td>
              <td className="py-md px-lg text-text-secondary">{row.department}</td>
              <td className="py-md px-lg text-text-secondary text-right">{row.events_participated}</td>
              <td className="py-md px-lg text-text-secondary text-right">{row.submissions_approved}</td>
              <td className="py-md px-lg font-bold text-primary text-right">{row.points}</td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan="6" className="py-xl text-center text-text-secondary">
                No leaderboard data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
