import { useState } from 'react';
import { Card, StatusBadge, ProgressBar, Button, Modal, EmptyState } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

const initialBatches = [
  { id: 'BP-2026-118', source: 'Route 4 — Eco District', input_kg: 2350, start: '2026-09-09 06:40', progress: 68, status: 'PROCESSING', weight_kg: null },
  { id: 'BP-2026-117', source: 'Tech Park Cluster', input_kg: 4800, start: '2026-09-09 04:15', progress: 100, status: 'COMPLETED', weight_kg: 4780 },
  { id: 'BP-2026-116', source: 'Green Valley Society', input_kg: 1120, start: '2026-09-08 18:30', progress: 100, status: 'COMPLETED', weight_kg: 1105 },
  { id: 'BP-2026-115', source: 'Downtown Commercial', input_kg: 8600, start: '2026-09-08 06:00', progress: 43, status: 'PROCESSING', weight_kg: null },
];

export default function FacilityBatches() {
  const [batches, setBatches] = useState(initialBatches);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ source: '', input_kg: '' });

  const receiveBatch = (e) => {
    e.preventDefault();
    const now = new Date().toISOString();
    setBatches([
      { id: `BP-2026-${Math.floor(110 + Math.random() * 20)}`, source: form.source || 'Unassigned route', input_kg: Number(form.input_kg) || 0, start: now, progress: 5, status: 'PROCESSING', weight_kg: null },
      ...batches,
    ]);
    setForm({ source: '', input_kg: '' });
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold">Processing Batches</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant">All waste lots received for processing</p>
        </div>
        <Button onClick={() => setOpen(true)}><Icon name="add" className="text-[18px]" /> Receive Batch</Button>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-surface-container-high">
                {['Batch ID', 'Source', 'Input', 'Started', 'Progress', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b.id} className="border-b border-surface-container-high/50 hover:bg-surface-container-low">
                  <td className="px-5 py-4 font-bold text-primary">{b.id}</td>
                  <td className="px-5 py-4 font-body-md text-body-md text-on-surface-variant">{b.source}</td>
                  <td className="px-5 py-4 font-semibold text-primary">{(b.input_kg / 1000).toFixed(2)} t</td>
                  <td className="px-5 py-4 font-label-sm text-label-sm text-on-surface-variant">{b.start}</td>
                  <td className="px-5 py-4 w-40">
                    <div className="flex items-center gap-2">
                      <div className="flex-1"><ProgressBar value={b.progress} /></div>
                      <span className="font-bold text-primary text-xs w-8 text-right">{b.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={b.status} /></td>
                  <td className="px-5 py-4">
                    <button className="p-2 rounded-full hover:bg-surface-container-high" aria-label="View batch"><Icon name="chevron_right" className="text-[18px]" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {batches.length === 0 && <EmptyState title="No batches" message="Receive your first batch to begin processing." />}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Receive New Batch">
        <form onSubmit={receiveBatch} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-xs text-primary font-bold uppercase tracking-widest ml-1">Source / Route</label>
            <input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="e.g. Route 7 — North District" className="w-full rounded-xl border-2 border-surface-container-high bg-white px-4 py-3 font-body-md text-sm outline-none focus:border-secondary" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-xs text-primary font-bold uppercase tracking-widest ml-1">Input Weight (kg)</label>
            <input type="number" value={form.input_kg} onChange={(e) => setForm({ ...form, input_kg: e.target.value })} placeholder="e.g. 2350" required className="w-full rounded-xl border-2 border-surface-container-high bg-white px-4 py-3 font-body-md text-sm outline-none focus:border-secondary" />
          </div>
          <Button type="submit" loading={false}>Start Processing</Button>
        </form>
      </Modal>
    </div>
  );
}