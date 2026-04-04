import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvent, joinEvent } from '../api';
import { format } from 'date-fns';
import { Calendar, Users, Award, ChevronLeft } from 'lucide-react';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const { data } = await getEvent(id);
      setEvent(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setJoining(true);
    try {
      await joinEvent(id);
      await fetchEvent();
    } catch (e) {
      console.error(e);
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <div className="py-20 text-center">Loading event...</div>;
  if (!event) return <div className="py-20 text-center">Event not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button 
        onClick={() => navigate('/events')}
        className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
      >
        <ChevronLeft size={16} /> Back to Events
      </button>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 md:p-12 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-[var(--color-border)] pb-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                {event.type}
              </span>
              <span className={`text-xs font-semibold ${event.status === 'active' ? 'text-[var(--color-success)]' : 'text-[var(--color-text-secondary)]'}`}>
                {event.status.toUpperCase()}
              </span>
            </div>
            <h1>{event.title}</h1>
            <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed max-w-2xl">
              {event.description}
            </p>
          </div>
          <div className="flex-shrink-0 w-full md:w-auto">
            <button 
              onClick={handleJoin}
              disabled={joining || event.current_participants >= event.max_participants || event.status !== 'active'}
              className="w-full md:w-auto h-12 px-8 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {joining ? 'Joining...' : event.current_participants >= event.max_participants ? 'Event Full' : 'Join Event'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-secondary)] text-[var(--color-primary)]">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-1">Deadline</p>
              <p className="font-medium text-[var(--color-text-primary)]">{format(new Date(event.deadline), 'PPp')}</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-secondary)] text-[var(--color-primary)]">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-1">Participants</p>
              <p className="font-medium text-[var(--color-text-primary)]">{event.current_participants} / {event.max_participants}</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-[var(--color-warning)]">
              <Award size={24} />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-1">Reward</p>
              <p className="font-medium text-[var(--color-text-primary)]">{event.reward_points} Points</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
