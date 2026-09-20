import { useState } from 'react';
import { Card, Button, Modal, StatusBadge, ProgressBar } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

const INITIAL = [
  { id: 'f1', name: 'North MRF Hub', type: 'MRF', capacity: 120, load: 74, status: 'ACTIVE', rate: '8.9 t/day' },
  { id: 'f2', name: 'Organic Composting Unit', type: 'Composting', capacity: 60, load: 88, status: 'ACTIVE', rate: '4.2 t/day' },
  { id: 'f3', name: 'RDF Conditioning Plant', type: 'RDF', capacity: 80, load: 56, status: 'ACTIVE', rate: '3.1 t/day' },
  { id: 'f4', name: 'South Transfer Station', type: 'MRF', capacity: 90, load: 41, status: 'MAINTENANCE', rate: '2.0 t/day' },
];

export default function AdminFacilities() {
  const [facilities, setFacilities] = useState(INITIAL);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'MRF', capacity: 100 });

  const addFacility = () => {
    if (!form.name) return;
    setFacilities((prev) => [...prev, { ...form, id: 'f' + Date.now(), load: 0, status: 'ACTIVE', rate: '0 t/day' }]);
    setForm({ name: '', type: 'MRF', capacity: 100 });
    setShowAdd(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold">Facilities</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Material recovery, composting and RDF plants across the network.</p>
        </div>
        <Button variant="primary" onClick={() => setShowAdd(true)}><Icon name="add" className="text-[18px]" /> Add Facility</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facilities.map((f) => (
          <Card key={f.id} className="flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-xl bg-forest text-secondary-fixed flex items-center justify-center"><Icon name="factory" className="text-[26px]" /></span>
                <div>
                  <p className="font-bold text-primary">{f.name}</p>
                  <p className="text-sm text-on-surface-variant">{f.type} · {f.capacity} t capacity</p>
                </div>
              </div>
              <StatusBadge status={f.status} pending={f.status === 'ACTIVE'} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-on-surface-variant">Load</span>
              <span className="font-bold text-primary">{f.load}%</span>
            </div>
            <ProgressBar value={f.load} color={f.load > 85 ? 'bg-error' : f.load > 70 ? 'bg-amber-500' : 'bg-secondary'} />
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-on-surface-variant">Processing rate</span>
              <span className="text-sm font-bold text-primary">{f.rate}</span>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Facility">
        <div className="flex flex-col gap-4">
          <Field label="Facility name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" placeholder="e.g. East MRF Hub" /></Field>
          <Field label="Type">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm">
              <option>MRF</option><option>Composting</option><option>RDF</option>
            </select>
          </Field>
          <Field label="Capacity (tonnes/day)"><input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" /></Field>
          <div className="flex gap-3 mt-2">
            <Button variant="primary" onClick={addFacility}>Save facility</Button>
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
