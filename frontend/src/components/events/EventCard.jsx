import React from 'react';
import { Link } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import { Calendar, Users, Award, Tag } from 'lucide-react';

export default function EventCard({ event }) {
  const isUrgent = differenceInDays(new Date(event.deadline), new Date()) <= 3;

  return (
    <Link 
      to={`/events/${event._id}`} 
      className="group block overflow-hidden rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-lg transition-all duration-200 flex flex-col h-full"
    >
      <div className="p-6 flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            {event.type}
          </span>
          <span className={`text-xs font-semibold ${
            event.status === 'active' ? 'text-[var(--color-success)]' : 'text-[var(--color-text-secondary)]'
          }`}>
            • {event.status.toUpperCase()}
          </span>
        </div>
        
        <div className="space-y-1">
          <h3 className="group-hover:text-[var(--color-primary-hover)] transition-colors">{event.title}</h3>
          <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
            {event.description}
          </p>
        </div>

        <div className="mt-auto pt-4 space-y-3">
          <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className={isUrgent ? 'text-[var(--color-error)]' : ''} />
              <span className={isUrgent ? 'text-[var(--color-error)] font-medium' : ''}>
                {format(new Date(event.deadline), 'MMM d, yyyy')}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={14} />
              <span>{event.current_participants} / {event.max_participants}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4 mt-2">
            <div className="flex items-center gap-1.5 text-[var(--color-warning)] font-semibold text-sm">
              <Award size={16} />
              <span>{event.reward_points} pts</span>
            </div>
            <div className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1">
              <Tag size={12} /> {event.department}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
