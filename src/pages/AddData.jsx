import { useState, useEffect } from 'react';
import { addUser, addEvent, addSubmission, listEvents, listUsers } from '../api/data';

const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Design'];
const STATUS_OPTIONS = ['pending', 'approved', 'rejected'];

const defaultUser       = { name: '', department: 'Engineering', points: 0, events_participated: 0, submissions_approved: 0 };
const defaultEvent      = { title: '' };
const defaultSubmission = { user_id: '', event_id: '', status: 'pending', points_awarded: 0 };

export const AddData = () => {
  const [tab, setTab]               = useState('user');
  const [userForm, setUserForm]     = useState(defaultUser);
  const [eventForm, setEventForm]   = useState(defaultEvent);
  const [subForm, setSubForm]       = useState(defaultSubmission);
  const [events, setEvents]         = useState([]);
  const [users, setUsers]           = useState([]);
  const [message, setMessage]       = useState(null);

  useEffect(() => {
    listEvents().then(r => setEvents(r.data)).catch(() => {});
    listUsers().then(r => setUsers(r.data)).catch(() => {});
  }, []);

  const notify = (text, ok = true) => {
    setMessage({ text, ok });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await addUser({ ...userForm, points: +userForm.points, events_participated: +userForm.events_participated, submissions_approved: +userForm.submissions_approved });
      setUserForm(defaultUser);
      const r = await listUsers(); setUsers(r.data);
      notify('User added successfully!');
    } catch { notify('Failed to add user.', false); }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      await addEvent(eventForm);
      setEventForm(defaultEvent);
      const r = await listEvents(); setEvents(r.data);
      notify('Event added successfully!');
    } catch { notify('Failed to add event.', false); }
  };

  const handleAddSubmission = async (e) => {
    e.preventDefault();
    try {
      await addSubmission({ ...subForm, points_awarded: +subForm.points_awarded });
      setSubForm(defaultSubmission);
      notify('Submission added successfully!');
    } catch { notify('Failed to add submission.', false); }
  };

  const tabs = ['user', 'event', 'submission'];

  return (
    <div className="space-y-xl">
      <div>
        <h2 className="mb-sm">Add Data</h2>
        <p className="text-text-secondary">Insert users, events, and submissions into the database.</p>
      </div>

      {message && (
        <div className={`p-md rounded-lg text-sm font-medium ${message.ok ? 'bg-green-50 text-status-success border border-green-200' : 'bg-red-50 text-status-error border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-sm border-b border-border">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-lg py-sm text-sm font-medium capitalize border-b-2 transition-colors -mb-px ${tab === t ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
          >
            {t === 'user' ? 'Add User' : t === 'event' ? 'Add Event' : 'Add Submission'}
          </button>
        ))}
      </div>

      {/* Add User Form */}
      {tab === 'user' && (
        <div className="card max-w-lg">
          <h3 className="mb-lg">New User</h3>
          <form onSubmit={handleAddUser} className="space-y-md">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-xs">Name</label>
              <input className="input-field" required value={userForm.name} onChange={e => setUserForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Aisha Patel" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-xs">Department</label>
              <select className="input-field" value={userForm.department} onChange={e => setUserForm(p => ({ ...p, department: e.target.value }))}>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-md">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-xs">Points</label>
                <input className="input-field" type="number" min="0" value={userForm.points} onChange={e => setUserForm(p => ({ ...p, points: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-xs">Events</label>
                <input className="input-field" type="number" min="0" value={userForm.events_participated} onChange={e => setUserForm(p => ({ ...p, events_participated: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-xs">Approved</label>
                <input className="input-field" type="number" min="0" value={userForm.submissions_approved} onChange={e => setUserForm(p => ({ ...p, submissions_approved: e.target.value }))} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full">Add User</button>
          </form>
        </div>
      )}

      {/* Add Event Form */}
      {tab === 'event' && (
        <div className="card max-w-lg">
          <h3 className="mb-lg">New Event</h3>
          <form onSubmit={handleAddEvent} className="space-y-md">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-xs">Event Title</label>
              <input className="input-field" required value={eventForm.title} onChange={e => setEventForm({ title: e.target.value })} placeholder="e.g. Hackathon 2026" />
            </div>
            <button type="submit" className="btn btn-primary w-full">Add Event</button>
          </form>

          {events.length > 0 && (
            <div className="mt-lg">
              <h3 className="mb-md text-sm font-medium text-text-secondary">Existing Events</h3>
              <ul className="space-y-xs">
                {events.map(ev => (
                  <li key={ev.id} className="text-sm text-text-primary bg-background px-md py-sm rounded border border-border">{ev.title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Add Submission Form */}
      {tab === 'submission' && (
        <div className="card max-w-lg">
          <h3 className="mb-lg">New Submission</h3>
          <form onSubmit={handleAddSubmission} className="space-y-md">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-xs">User</label>
              <select className="input-field" required value={subForm.user_id} onChange={e => setSubForm(p => ({ ...p, user_id: e.target.value }))}>
                <option value="">Select a user</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name} — {u.department}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-xs">Event</label>
              <select className="input-field" required value={subForm.event_id} onChange={e => setSubForm(p => ({ ...p, event_id: e.target.value }))}>
                <option value="">Select an event</option>
                {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-md">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-xs">Status</label>
                <select className="input-field" value={subForm.status} onChange={e => setSubForm(p => ({ ...p, status: e.target.value }))}>
                  {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-xs">Points Awarded</label>
                <input className="input-field" type="number" min="0" value={subForm.points_awarded} onChange={e => setSubForm(p => ({ ...p, points_awarded: e.target.value }))} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full">Add Submission</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddData;
