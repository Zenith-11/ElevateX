import React, { useEffect, useState } from 'react';
import { getEvents } from '../api';
import EventCard from '../components/events/EventCard';
import { Filter, Search } from 'lucide-react';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDep, setFilterDep] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [filterDep]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await getEvents(filterDep ? { department: filterDep } : {});
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-[var(--color-border)] pb-6">
        <div>
          <h1 className="text-[var(--color-text-primary)]">Discover Events</h1>
          <p className="text-[var(--color-text-secondary)] mt-2">Find and join upcoming activities safely.</p>
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={18} />
            <input 
              type="text" 
              placeholder="Search events..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            />
          </div>
          <div className="relative w-full md:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={18} />
            <select 
              value={filterDep}
              onChange={(e) => setFilterDep(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors appearance-none"
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="HR">HR</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-[var(--color-text-secondary)]">Loading events...</div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-xl">
          <h3 className="text-[var(--color-text-secondary)]">No events found.</h3>
        </div>
      )}
    </div>
  );
}
