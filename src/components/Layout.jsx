import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, TrendingUp, Target } from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  const navItems = [
    { name: 'Dashboard',   path: '/',            icon: LayoutDashboard },
    { name: 'Analytics',   path: '/analytics',   icon: TrendingUp },
    { name: 'Leaderboard', path: '/leaderboard', icon: Users },
    { name: 'My Progress', path: '/progress',    icon: Target },
  ];

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 bg-surface border-r border-border flex-shrink-0 shadow-sm">
        <div className="h-16 flex items-center px-lg border-b border-border">
          <div className="flex items-center gap-sm">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <h1 className="text-xl font-bold text-text-primary">ElevateX</h1>
          </div>
        </div>
        <nav className="p-md space-y-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-md px-md py-sm rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:bg-background hover:text-text-primary'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="max-w-[1200px] mx-auto p-xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
