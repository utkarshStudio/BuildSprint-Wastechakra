import { useState, useMemo } from 'react';
import { Card, Button, Modal, StatusBadge, Avatar, EmptyState } from '../../components/ui';

const INITIAL = [
  { id: 'u1', name: 'Aarav Sharma', email: 'aarav@wastechakra.com', role: 'Citizen', points: 2840, city: 'Bengaluru', joined: '2025-11-02', status: 'ACTIVE' },
  { id: 'u2', name: 'Priya Nair', email: 'priya@wastechakra.com', role: 'Citizen', points: 2510, city: 'Bengaluru', joined: '2026-01-14', status: 'ACTIVE' },
  { id: 'u3', name: 'Danish', email: 'citizen@wastechakra.com', role: 'Admin', points: 1280, city: 'Eco District', joined: '2025-08-19', status: 'ACTIVE' },
  { id: 'u4', name: 'Meera Iyer', email: 'meera@wastechakra.com', role: 'Business', points: 980, city: 'Tech Park', joined: '2026-03-05', status: 'ACTIVE' },
  { id: 'u5', name: 'Rahul Verma', email: 'rahul@wastechakra.com', role: 'Collector', points: 2210, city: 'Bengaluru', joined: '2026-02-21', status: 'INACTIVE' },
  { id: 'u6', name: 'Green Valley Society', email: 'society@wastechakra.com', role: 'Society', points: 18400, city: 'Green Valley', joined: '2025-12-10', status: 'ACTIVE' },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(INITIAL);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('All roles');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchR = role === 'All roles' || u.role === role;
      return matchQ && matchR;
    });
  }, [users, search, role]);

  const toggleActive = (id) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : u)));
    setSelected((s) => (s && s.id === id ? { ...s, status: s.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : s));
  };

  const setPoints = (id, points) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, points } : u)));
    setSelected((s) => (s && s.id === id ? { ...s, points } : s));
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline-md text-headline-md text-primary font-bold">Users</h1>
        <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Manage accounts, roles, points and status.</p>
      </div>

      <Card className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="flex flex-col gap-1.5 md:col-span-2">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Search</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email…" className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" aria-label="Search users" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Role</span>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" aria-label="Filter by role">
            <option>All roles</option><option>Citizen</option><option>Collector</option><option>Business</option><option>Society</option><option>Admin</option>
          </select>
        </label>
      </Card>

      {filtered.length === 0 ? (
        <Card><EmptyState title="No users found" message="Try a different search or role filter." /></Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-on-surface-variant border-b border-surface-container-high bg-surface-container-low/60">
                  <th className="px-5 py-3 font-bold">Name</th>
                  <th className="px-4 py-3 font-bold">Email</th>
                  <th className="px-4 py-3 font-bold">Role</th>
                  <th className="px-4 py-3 font-bold">Points</th>
                  <th className="px-4 py-3 font-bold">City</th>
                  <th className="px-4 py-3 font-bold">Joined</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} onClick={() => setSelected(u)} className="border-b border-surface-container-high last:border-0 hover:bg-surface-container-low/50 cursor-pointer">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3"><Avatar name={u.name} size="sm" /><span className="font-bold text-primary">{u.name}</span></div>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">{u.email}</td>
                    <td className="px-4 py-3"><StatusBadge status={u.role.toUpperCase()} /></td>
                    <td className="px-4 py-3 font-semibold text-primary">{u.points.toLocaleString()}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{u.city}</td>
                    <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">{u.joined}</td>
                    <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selected && (
        <Modal open onClose={() => setSelected(null)} title={selected.name}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Avatar name={selected.name} size="lg" />
              <div>
                <p className="font-bold text-primary">{selected.name}</p>
                <p className="text-sm text-on-surface-variant">{selected.email}</p>
                <div className="flex gap-2 mt-2"><StatusBadge status={selected.role.toUpperCase()} /><StatusBadge status={selected.status} /></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="City" value={selected.city} />
              <Info label="Joined" value={selected.joined} />
              <Info label="Points" value={selected.points.toLocaleString()} />
              <Info label="Member ID" value={selected.id} />
            </div>
            <Field label="Adjust points">
              <input type="number" value={selected.points} onChange={(e) => setPoints(selected.id, Number(e.target.value))} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" aria-label="Adjust points" />
            </Field>
            <div className="flex gap-3">
              <Button variant={selected.status === 'ACTIVE' ? 'danger' : 'primary'} onClick={() => toggleActive(selected.id)}>
                {selected.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
              </Button>
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-surface-container-low/60">
      <p className="text-xs text-on-surface-variant">{label}</p>
      <p className="font-bold text-primary">{value}</p>
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
