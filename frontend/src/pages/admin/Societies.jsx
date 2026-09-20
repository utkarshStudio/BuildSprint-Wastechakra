import { useState } from 'react';
import { Card, Button, Modal, StatusBadge } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

const INITIAL = [
  { id: 's1', name: 'Green Valley Society', location: 'Eco District', households: 320, residents: 1280, monthlyWaste: '3.5 t', points: 18400, status: 'ACTIVE' },
  { id: 's2', name: 'Lake View Society', location: 'Riverside', households: 180, residents: 720, monthlyWaste: '1.8 t', points: 11200, status: 'ACTIVE' },
  { id: 's3', name: 'Sunrise Residency', location: 'Tech Park', households: 260, residents: 1040, monthlyWaste: '2.9 t', points: 9600, status: 'ACTIVE' },
  { id: 's4', name: 'Rosewood Heights', location: 'Central', households: 140, residents: 560, monthlyWaste: '1.2 t', points: 7400, status: 'PENDING' },
  { id: 's5', name: 'Emerald Gardens', location: 'North Phase', households: 210, residents: 840, monthlyWaste: '2.1 t', points: 5100, status: 'PENDING' },
];

export default function AdminSocieties() {
  const [societies, setSocieties] = useState(INITIAL);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', households: '', residents: '', monthlyWaste: '' });

  const addSociety = () => {
    if (!form.name) return;
    setSocieties((prev) => [...prev, { ...form, id: 's' + Date.now(), points: 0, status: 'PENDING' }]);
    setForm({ name: '', location: '', households: '', residents: '', monthlyWaste: '' });
    setShowAdd(false);
  };

  const leaders = [...societies].sort((a, b) => b.points - a.points).slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold">Societies</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Manage residential welfare associations and their community waste programs.</p>
        </div>
        <Button variant="primary" onClick={() => setShowAdd(true)}><Icon name="apartment" className="text-[18px]" /> Add Society</Button>
      </div>

      <section>
        <h2 className="font-headline-sm text-headline-sm text-primary font-bold mb-4">Top Societies</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {leaders.map((s, i) => (
            <Card key={s.id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <span className="w-12 h-12 rounded-xl bg-forest text-secondary-fixed flex items-center justify-center"><Icon name="apartment" className="text-[26px]" /></span>
                <span className="text-2xl font-extrabold text-surface-container-highest">{i + 1}</span>
              </div>
              <div>
                <p className="font-bold text-primary">{s.name}</p>
                <p className="text-sm text-on-surface-variant">{s.location}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-on-surface-variant">{s.households} households</span>
                <span className="font-bold text-primary">{s.points.toLocaleString()} pts</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-on-surface-variant border-b border-surface-container-high bg-surface-container-low/60">
                <th className="px-5 py-3 font-bold">Society</th>
                <th className="px-4 py-3 font-bold">Location</th>
                <th className="px-4 py-3 font-bold">Households</th>
                <th className="px-4 py-3 font-bold">Residents</th>
                <th className="px-4 py-3 font-bold">Monthly Waste</th>
                <th className="px-4 py-3 font-bold">Chakra Points</th>
                <th className="px-4 py-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {societies.map((s) => (
                <tr key={s.id} className="border-b border-surface-container-high last:border-0 hover:bg-surface-container-low/50">
                  <td className="px-5 py-3 font-bold text-primary">{s.name}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{s.location}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{s.households}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{s.residents}</td>
                  <td className="px-4 py-3 font-semibold text-primary">{s.monthlyWaste}</td>
                  <td className="px-4 py-3 font-semibold text-primary">{s.points.toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={s.status} pending={s.status === 'PENDING'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Society">
        <div className="flex flex-col gap-4">
          <Field label="Society name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" placeholder="Green Valley Society" /></Field>
          <Field label="Location"><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" placeholder="Sector / district" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Households"><input type="number" value={form.households} onChange={(e) => setForm({ ...form, households: e.target.value })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" placeholder="250" /></Field>
            <Field label="Residents"><input type="number" value={form.residents} onChange={(e) => setForm({ ...form, residents: e.target.value })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" placeholder="1000" /></Field>
          </div>
          <Field label="Monthly waste volume"><input value={form.monthlyWaste} onChange={(e) => setForm({ ...form, monthlyWaste: e.target.value })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" placeholder="e.g. 2.5 t" /></Field>
          <div className="flex gap-3 mt-2">
            <Button variant="primary" onClick={addSociety}>Save society</Button>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
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