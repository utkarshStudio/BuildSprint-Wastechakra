import { useState } from 'react';
import { Card, Button, Modal, StatusBadge } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

const INITIAL = [
  { id: 'b1', company: 'GreenLeaf Retail', type: 'Retail', location: 'Tech Park', contract: 'Monthly', volume: '1.2 t/mo', status: 'ACTIVE', waste: 'CARDBOARD', featured: true },
  { id: 'b2', company: 'UrbanBites Cafe', type: 'Hospitality', location: 'Eco District', contract: 'Weekly', volume: '0.4 t/mo', status: 'ACTIVE', waste: 'ORGANIC', featured: true },
  { id: 'b3', company: 'Nova Technologies', type: 'Office', location: 'Tech Park', contract: 'Monthly', volume: '2.8 t/mo', status: 'ACTIVE', waste: 'E_WASTE', featured: true },
  { id: 'b4', company: 'Horizon Apartments', type: 'Housing', location: 'Green Valley', contract: 'Bi-weekly', volume: '3.5 t/mo', status: 'PENDING', waste: 'MIXED', featured: false },
  { id: 'b5', company: 'MetroFresh', type: 'Grocery', location: 'Central', contract: 'Weekly', volume: '0.9 t/mo', status: 'ACTIVE', waste: 'ORGANIC', featured: false },
];

export default function AdminBusinesses() {
  const [businesses, setBusinesses] = useState(INITIAL);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ company: '', type: '', location: '', contract: '', volume: '' });

  const addBusiness = () => {
    if (!form.company) return;
    setBusinesses((prev) => [...prev, { ...form, id: 'b' + Date.now(), status: 'PENDING', waste: 'MIXED', featured: false }]);
    setForm({ company: '', type: '', location: '', contract: '', volume: '' });
    setShowAdd(false);
  };

  const featured = businesses.filter((b) => b.featured);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold">Business Clients</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Manage corporate and society waste contracts.</p>
        </div>
        <Button variant="primary" onClick={() => setShowAdd(true)}><Icon name="business_center" className="text-[18px]" /> Add Business</Button>
      </div>

      <section>
        <h2 className="font-headline-sm text-headline-sm text-primary font-bold mb-4">Featured Clients</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featured.map((b) => (
            <Card key={b.id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <span className="w-12 h-12 rounded-xl bg-forest text-secondary-fixed flex items-center justify-center"><Icon name="business" className="text-[26px]" /></span>
                <StatusBadge status={b.status} />
              </div>
              <div>
                <p className="font-bold text-primary">{b.company}</p>
                <p className="text-sm text-on-surface-variant">{b.type} · {b.location}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-on-surface-variant">{b.waste.replace(/_/g, ' ')}</span>
                <span className="font-bold text-primary">{b.volume}</span>
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
                <th className="px-5 py-3 font-bold">Company</th>
                <th className="px-4 py-3 font-bold">Type</th>
                <th className="px-4 py-3 font-bold">Location</th>
                <th className="px-4 py-3 font-bold">Contract</th>
                <th className="px-4 py-3 font-bold">Waste Volume</th>
                <th className="px-4 py-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map((b) => (
                <tr key={b.id} className="border-b border-surface-container-high last:border-0 hover:bg-surface-container-low/50">
                  <td className="px-5 py-3 font-bold text-primary">{b.company}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{b.type}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{b.location}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{b.contract}</td>
                  <td className="px-4 py-3 font-semibold text-primary">{b.volume}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} pending={b.status === 'PENDING'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Business">
        <div className="flex flex-col gap-4">
          <Field label="Company name"><input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" placeholder="Company Pvt Ltd" /></Field>
          <Field label="Industry type"><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm"><option value="">Select…</option><option>Retail</option><option>Hospitality</option><option>Office</option><option>Housing</option><option>Grocery</option></select></Field>
          <Field label="Location"><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" placeholder="Sector / district" /></Field>
          <Field label="Contract frequency"><select value={form.contract} onChange={(e) => setForm({ ...form, contract: e.target.value })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm"><option value="">Select…</option><option>Weekly</option><option>Bi-weekly</option><option>Monthly</option></select></Field>
          <Field label="Waste volume"><input value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" placeholder="e.g. 1.2 t/mo" /></Field>
          <div className="flex gap-3 mt-2">
            <Button variant="primary" onClick={addBusiness}>Save business</Button>
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
