import { Trophy } from 'lucide-react';

export const RankCard = ({ rank, name, points, department, eventsParticipated }) => (
  <div className="card flex items-center gap-lg">
    <div className="p-md bg-primary/10 rounded-full">
      <Trophy size={32} className="text-primary" />
    </div>
    <div className="flex-1">
      <p className="text-text-secondary text-sm">Your Global Rank</p>
      <p className="text-[40px] font-bold text-primary leading-none">#{rank}</p>
      <p className="text-text-secondary text-sm mt-xs">{name} · {department}</p>
    </div>
    <div className="text-right">
      <p className="text-text-secondary text-sm">Points</p>
      <p className="text-2xl font-semibold text-text-primary">{points}</p>
      <p className="text-text-secondary text-sm mt-xs">{eventsParticipated} events</p>
    </div>
  </div>
);
