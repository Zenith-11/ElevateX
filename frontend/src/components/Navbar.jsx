import React from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, Calendar, Plus } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white font-bold">EX</div>
          <span className="font-semibold text-lg tracking-tight">ElevateX</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/events" className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
            <Calendar size={18} />
            <span className="text-sm font-medium">Events</span>
          </Link>
          <Link to="/events/create" className="flex items-center gap-2 outline outline-1 outline-[var(--color-border)] hover:outline-[var(--color-primary)] text-[var(--color-text-primary)] px-4 py-2 rounded-lg transition-all text-sm font-medium">
            <Plus size={16} />
            <span>Create Event</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
