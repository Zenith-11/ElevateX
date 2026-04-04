import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-bg">
      {/* Subtle gradient orbs for visual interest */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-[420px] animate-fade-in-up">
        {/* Logo / Branding */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-card bg-primary flex items-center justify-center">
            <Zap size={22} className="text-white" />
          </div>
          <span className="text-2xl font-semibold text-text-primary tracking-tight">
            ElevateX
          </span>
        </Link>

        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-6">
            {title && (
              <h1 className="text-2xl font-semibold text-text-primary">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-text-secondary mt-2">{subtitle}</p>
            )}
          </div>
        )}

        {/* Card Content */}
        <div className="bg-surface border border-border rounded-card p-6 shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.08)]">
          {children}
        </div>
      </div>
    </div>
  );
}
