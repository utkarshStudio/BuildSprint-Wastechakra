import { useState } from 'react';
import { Card, Button, Modal, StatusBadge, EmptyState } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

const INITIAL_EVENTS = [
  { id: 'e1', title: 'Park Cleanup Drive', type: 'cleanup', location: 'Central Park', date: '2026-09-15', participants: 45, waste: 120, status: 'OPEN' },
  { id: 'e2', title: 'Plastic Collection Campaign', type: 'plastic', location: 'Lake View Society', date: '2026-09-20', participants: 30, waste: 210, status: 'OPEN' },
  { id: 'e3', title: 'E-Waste Drive', type: 'e-waste', location: 'Tech Park', date: '2026-09-25', participants: 60, waste: 480, status: 'OPEN' },
  { id: 'e4', title: 'School Recycling Workshop', type: 'school', location: 'Green Valley School', date: '2026-09-28', participants: 120, waste: 0, status: 'UPCOMING' },
  { id: 'e5', title: 'Beach Shoreline Cleanup', type: 'cleanup', location: 'Harbor Beach', date: '2026-09-30', participants: 85, waste: 0, status: 'UPCOMING' },
];

const TYPE_ICON = { cleanup: 'delete_sweep', plastic: 'recycling', 'e-waste': 'devices', school: 'school', awareness: 'campaign' };

export default function AdminCommunity() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'cleanup', location: '', date: '' });
  const [announcement, setAnnouncement] = useState('');

  const createEvent = () => {
    if (!form.title) return;
    setEvents((prev) => [...prev, { ...form, id: 'e' + Date.now(), participants: 0, waste: 0, status: 'UPCOMING' }]);
    setForm({ title: '', type: 'cleanup', location: '', date: '' });
    setShowCreate(false);
  };

  const toggleStatus = (id) => setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status: e.status === 'OPEN' ? 'CLOSED' : 'OPEN' } : e)));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold">Community</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Coordinate events and share announcements with residents.</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreate(true)}><Icon name="add" className="text-[18px]" /> Create Event</Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-container-high">
          <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Events</h2>
          <span className="text-sm text-on-surface-variant">{events.filter((e) => e.status === 'OPEN').length} open</span>
        </div>
        {events.length === 0 ? (
          <EmptyState title="No events" message="Create your first community event." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-on-surface-variant border-b border-surface-container-high bg-surface-container-low/60">
                  <th className="px-5 py-3 font-bold">Event</th>
                  <th className="px-4 py-3 font-bold">Type</th>
                  <th className="px-4 py-3 font-bold">Location</th>
                  <th className="px-4 py-3 font-bold">Date</th>
                  <th className="px-4 py-3 font-bold">Participants</th>
                  <th className="px-4 py-3 font-bold">Waste Recovered</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id} className="border-b border-surface-container-high last:border-0 hover:bg-surface-container-low/50">
                    <td className="px-5 py-3 font-bold text-primary">{e.title}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-on-surface-variant capitalize"><Icon name={TYPE_ICON[e.type] || 'groups'} className="text-[18px]" />{e.type}</span>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">{e.location}</td>
                    <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">{e.date}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{e.participants}</td>
                    <td className="px-4 py-3 font-semibold text-primary">{e.waste ? `${e.waste} kg` : '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={e.status} pending={e.status === 'OPEN'} /></td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button onClick={() => {}} aria-label="Edit" className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high"><Icon name="edit" className="text-[18px]" /></button>
                        <button onClick={() => toggleStatus(e.id)} aria-label="Toggle open" className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high"><Icon name="toggle_on" className="text-[18px]" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Icon name="campaign" className="text-secondary" />
          <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Announcement composer</h2>
        </div>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Message</span>
          <textarea rows={4} value={announcement} onChange={(e) => setAnnouncement(e.target.value)} className="px-4 py-3 rounded-xl border border-surface-container-high bg-surface text-sm" placeholder="Broadcast to all community members…" aria-label="Announcement message" />
        </label>
        <div className="flex justify-end mt-4">
          <Button variant="primary" disabled={!announcement.trim()} onClick={() => setAnnouncement('')}>Publish announcement</Button>
        </div>
      </Card>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Event">
        <div className="flex flex-col gap-4">
          <Field label="Event title"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" placeholder="e.g. Weekend Cleanup" /></Field>
          <Field label="Type">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm">
              <option value="cleanup">Cleanup</option><option value="plastic">Plastic collection</option><option value="e-waste">E-waste</option><option value="school">School workshop</option><option value="awareness">Awareness</option>
            </select>
          </Field>
          <Field label="Location"><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" placeholder="Location" /></Field>
          <Field label="Date"><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" /></Field>
          <div className="flex gap-3 mt-2">
            <Button variant="primary" onClick={createEvent}>Create event</Button>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">{label}</span>
      {children}
    </label>
  );
}
