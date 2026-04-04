import { Activity, Users, FileText, Gift, Percent } from 'lucide-react';

const iconMap = {
  Users, Activity, FileText, Gift, Percent
};

export const MetricsCard = ({ title, value, iconName, change }) => {
  const Icon = iconMap[iconName] || Activity;
  const isPositive = change > 0;
  
  return (
    <div className="card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-md">
        <h3 className="text-text-secondary text-sm font-medium">{title}</h3>
        <div className="p-sm bg-primary/10 rounded-md">
          <Icon size={18} className="text-primary" />
        </div>
      </div>
      <div>
        <div className="text-[32px] font-semibold text-text-primary">{value}</div>
        {change !== undefined && (
          <div className={`text-sm mt-xs flex items-center space-x-xs ${isPositive ? 'text-status-success' : 'text-status-error'}`}>
            <span>{isPositive ? '+' : ''}{change}%</span>
            <span className="text-text-secondary ml-sm">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};
