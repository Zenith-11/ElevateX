import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../api';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Workshop',
    department: 'Engineering',
    difficulty: 'Medium',
    deadline: '',
    reward_points: 100,
    max_participants: 50,
    tags: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'reward_points' || name === 'max_participants' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData };
      if(payload.deadline) {
        payload.deadline = new Date(payload.deadline).toISOString();
      } else {
        // default deadline in a week
        const d = new Date();
        d.setDate(d.getDate() + 7);
        payload.deadline = d.toISOString();
      }
      
      const { data } = await createEvent(payload);
      navigate(`/events/${data._id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h2>Create New Event</h2>
        <p className="text-[var(--color-text-secondary)] mt-2">Publish an event to the organization calendar.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Event Title</label>
            <input 
              required
              type="text" name="title" value={formData.title} onChange={handleChange}
              className="w-full h-10 px-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              placeholder="e.g. Annual Hackathon"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              required
              name="description" value={formData.description} onChange={handleChange} rows={4}
              className="w-full p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              placeholder="Detail the event objectives and rules..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full h-10 px-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors">
                <option>Workshop</option>
                <option>Hackathon</option>
                <option>Training</option>
                <option>Wellness</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <select name="department" value={formData.department} onChange={handleChange} className="w-full h-10 px-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors">
                <option>Engineering</option>
                <option>Design</option>
                <option>HR</option>
                <option>Marketing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Reward Points</label>
              <input required type="number" name="reward_points" value={formData.reward_points} onChange={handleChange} min={1} className="w-full h-10 px-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Participants</label>
              <input required type="number" name="max_participants" value={formData.max_participants} onChange={handleChange} min={1} className="w-full h-10 px-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors" />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium mb-1">Deadline Date & Time</label>
              <input required type="datetime-local" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full h-10 px-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors" />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--color-border)] flex justify-end gap-4">
          <button type="button" onClick={() => navigate('/events')} className="h-10 px-6 font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="h-10 px-6 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg font-medium transition-colors disabled:opacity-50">
            {loading ? 'Publishing...' : 'Publish Event'}
          </button>
        </div>
      </form>
    </div>
  );
}
