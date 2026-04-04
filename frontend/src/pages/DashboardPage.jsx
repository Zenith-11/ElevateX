import { useAuth } from '../context/AuthContext';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import {
  Users,
  Building2,
  Calendar,
  TrendingUp,
  Shield,
  Zap,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      label: 'Role',
      value: user?.role,
      icon: Shield,
      isBadge: true,
    },
    {
      label: 'Department',
      value: user?.department || 'Not assigned',
      icon: Building2,
    },
    {
      label: 'Member since',
      value: user?.created_at
        ? new Date(user.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : '—',
      icon: Calendar,
    },
  ];

  const quickActions = [
    {
      title: 'Team Management',
      description: 'View and manage team members',
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary-bg',
    },
    {
      title: 'Performance',
      description: 'Track growth and metrics',
      icon: TrendingUp,
      color: 'text-success',
      bg: 'bg-success-bg',
    },
    {
      title: 'Quick Actions',
      description: 'Common tasks at a glance',
      icon: Zap,
      color: 'text-warning',
      bg: 'bg-warning-bg',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-text-secondary mt-1">
          Here&apos;s what&apos;s happening with your account today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-standard bg-surface-hover flex items-center justify-center flex-shrink-0">
                <Icon size={20} className="text-text-secondary" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">{stat.label}</p>
                {stat.isBadge ? (
                  <Badge role={stat.value} className="mt-1" />
                ) : (
                  <p className="text-sm font-medium text-text-primary mt-0.5">
                    {stat.value}
                  </p>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Quick overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.title}
                className="group hover:border-primary/30 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-standard ${action.bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon size={20} className={action.color} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary group-hover:text-primary-light transition-colors">
                      {action.title}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Account Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account details</CardTitle>
          <CardDescription>
            Your profile information at a glance
          </CardDescription>
        </CardHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-text-muted uppercase tracking-wider">Full name</p>
            <p className="text-sm text-text-primary">{user?.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-text-muted uppercase tracking-wider">Email</p>
            <p className="text-sm text-text-primary">{user?.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-text-muted uppercase tracking-wider">Department</p>
            <p className="text-sm text-text-primary">{user?.department || 'Not assigned'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-text-muted uppercase tracking-wider">Last updated</p>
            <p className="text-sm text-text-primary">
              {user?.updated_at
                ? new Date(user.updated_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '—'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
