import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import Badge from '../ui/Badge';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-30 h-16 bg-surface/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-text-secondary hover:text-text-primary transition-colors p-2 rounded-standard hover:bg-surface-hover cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>

          <div className="hidden lg:block" />

          {/* User info */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-text-primary leading-tight">
                  {user?.name}
                </p>
                <p className="text-xs text-text-secondary leading-tight">
                  {user?.email}
                </p>
              </div>
              <Badge role={user?.role} />
            </div>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-light">
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="text-text-muted hover:text-error transition-colors p-2 rounded-standard hover:bg-error-bg cursor-pointer"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-[1200px] mx-auto animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
