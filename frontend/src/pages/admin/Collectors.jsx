import { useState } from 'react';
import { Card, Button, Modal, StatusBadge, Avatar, EmptyState } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

const INITIAL = [
  { id: 'c1', name: 'Ravi Kumar', vehicle: 'KA-01-AB-2841', vehicleType: 'Tata Ace', status: 'ACTIVE', pickupsToday: 6, rating: 4.8, phone: '+91 98765 43210', email: 'ravi@wastechakra.com' },
  { id: 'c2', name: 'Suresh', vehicle: 'KA-01-CD-9922', vehicleType: 'Bajaj RE', status: 'BUSY', pickupsToday: 3, rating: 4.5, phone: '+91 99887 66554', email: 'suresh@wastechakra.com' },
  { id: 'c3', name: 'Anita', vehicle: 'KA-05-EF-1140', vehicleType: 'Mahindra Treo', status: 'ACTIVE', pickupsToday: 8, rating: 4.9, phone: '+91 91234 56789', email: 'anita@wastechakra.com' },
  { id: 'c4', name: 'Vikram', vehicle: 'KA-02-GH-7788', vehicleType: 'Swachh E-Rickshaw', status: 'OFFLINE', pickupsToday: 0, rating: 4.2, phone: '+91 90011 22334', email: 'vikram@wastechakra.com' },
];

export default function AdminCollectors() {
  const [collectors, setCollectors] = useState(INITIAL);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', vehicle: '', vehicleType: '' });

  const toggleStatus = (id) => {
    setCollectors((prev) => prev.map((c) => {
      if (c.id !== id) return c;
      const next = c.status === 'ACTIVE' ? 'OFFLINE' : 'ACTIVE';
      return { ...c, status: next };
    }));
  };

  const addCollector = () => {
    if (!form.name) return;
    setCollectors((prev) => [...prev, { ...form, id: 'c' + Date.now(), status: 'ACTIVE', pickupsToday: 0, rating: 0 }]);
    setForm({ name: '', email: '', phone: '', vehicle: '', vehicleType: '' });
    setShowAdd(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold">Collectors</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Manage the collection fleet and their live availability.</p>
        </div>
        <Button variant="primary" onClick={() => setShowAdd(true)}><Icon name="person_add" className="text-[18px]" /> Add Collector</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4"><StatMini label="Active" value={collectors.filter((c) => c.status === 'ACTIVE').length} tone="bg-secondary-container text-primary" /></Card>
        <Card className="flex items-center gap-4"><StatMini label="Busy" value={collectors.filter((c) => c.status === 'BUSY').length} tone="bg-amber-100 text-amber-800" /></Card>
        <Card className="flex items-center gap-4"><StatMini label="Offline" value={collectors.filter((c) => c.status === 'OFFLINE').length} tone="bg-surface-container-high text-on-surface-variant" /></Card>
      </div>

      {collectors.length === 0 ? (
        <Card><EmptyState title="No collectors" message="Add a collector to get started." action={<Button variant="primary" onClick={() => setShowAdd(true)}>Add Collector</Button>} /></Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-on-surface-variant border-b border-surface-container-high bg-surface-container-low/60">
                  <th className="px-5 py-3 font-bold">Name</th>
                  <th className="px-4 py-3 font-bold">Vehicle</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold">Today's Pickups</th>
                  <th className="px-4 py-3 font-bold">Rating</th>
                  <th className="px-5 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {collectors.map((c) => (
                  <tr key={c.id} className="border-b border-surface-container-high last:border-0 hover:bg-surface-container-low/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={c.name} size="sm" />
                        <div>
                          <p className="font-bold text-primary">{c.name}</p>
                          <p className="text-xs text-on-surface-variant">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-primary whitespace-nowrap">{c.vehicle}</p>
                      <p className="text-xs text-on-surface-variant">{c.vehicleType}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={c.status} pending={c.status === 'BUSY'} />
                        <button onClick={() => toggleStatus(c.id)} className="text-xs px-2 py-1 rounded-full border border-surface-container-high font-bold text-on-surface-variant hover:bg-surface-container-low">
                          {c.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-primary">{c.pickupsToday}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-amber-600 font-bold"><Icon name="star" className="text-[16px]" />{c.rating || '—'}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1.5">
                        <IconBtn label="Edit" icon="edit" onClick={() => {}} />
                        <IconBtn label="Deactivate" icon="toggle_off" onClick={() => toggleStatus(c.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Collector">
        <div className="flex flex-col gap-4">
          <Field label="Full name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" placeholder="e.g. Meena" /></Field>
          <Field label="Email"><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" placeholder="meena@wastechakra.com" /></Field>
          <Field label="Phone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" placeholder="+91 …" /></Field>
          <Field label="Vehicle number"><input value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" placeholder="KA-01-XX-0000" /></Field>
          <Field label="Vehicle type"><select value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm"><option value="">Select…</option><option>Tata Ace</option><option>Bajaj RE</option><option>Mahindra Treo</option><option>E-Rickshaw</option></select></Field>
          <div className="flex gap-3 mt-2">
            <Button variant="primary" onClick={addCollector}>Save collector</Button>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function StatMini({ label, value, tone }) {
  return (
    <>
      <span className={`w-10 h-10 rounded-full flex items-center justify-center ${tone}`}>
        <Icon name="engineering" className="text-[20px]" />
      </span>
      <div>
        <p className="text-2xl font-extrabold text-primary leading-none">{value}</p>
        <p className="text-sm text-on-surface-variant">{label}</p>
      </div>
    </>
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

function IconBtn({ label, icon, onClick }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors">
      <Icon name={icon} className="text-[18px]" />
    </button>
  );
}
