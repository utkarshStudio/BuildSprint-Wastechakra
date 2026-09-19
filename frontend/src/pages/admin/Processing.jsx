import { useState } from 'react';
import { Card, StatCard, Button, Modal, StatusBadge, ProgressBar } from '../../components/ui';

const INPUT_T = 18.4;

const RECOVERY = [
  { label: 'Plastic recovery', value: 86, note: 'MRF line 1' },
  { label: 'Paper / card', value: 78, note: 'MRF line 2' },
  { label: 'Metal (ferrous)', value: 92, note: 'Magnetic separator' },
  { label: 'Non-ferrous metal', value: 88, note: 'Eddy current' },
];

const RDF = [
  { label: 'Shredding', value: 100, note: 'Complete' },
  { label: 'Drying (moisture)', value: 64, note: 'Target <12%' },
  { label: 'Contamination control', value: 71, note: 'Target <10%' },
  { label: 'Calorific value', value: 58, note: 'Target ≥ 16 MJ/kg' },
];

const COMPOSITION = [
  { key: 'Plastic', kg: 4.6, color: 'bg-secondary' },
  { key: 'Paper', kg: 2.8, color: 'bg-forest' },
  { key: 'Metal', kg: 1.1, color: 'bg-slate-400' },
  { key: 'Organic', kg: 4.4, color: 'bg-green-700' },
  { key: 'RDF', kg: 3.0, color: 'bg-amber-500' },
  { key: 'Inert', kg: 1.2, color: 'bg-stone-400' },
  { key: 'Residual', kg: 1.3, color: 'bg-error' },
];

const BATCHES = [
  { id: 'B-2201', ref: 'WC-2026-000284', input: 420, outputs: 'Recovered 312 / RDF 61 / Organic 38', status: 'ACTIVE', created: '09 Sep 06:00' },
  { id: 'B-2200', ref: 'WC-2026-000283', input: 510, outputs: 'Recovered 402 / RDF 74 / Organic 24', status: 'COMPLETED', created: '08 Sep 09:30' },
  { id: 'B-2199', ref: 'WC-2026-000281', input: 380, outputs: 'Recovered 298 / RDF 44 / Organic 30', status: 'COMPLETED', created: '07 Sep 11:00' },
];

export default function AdminProcessing() {
  const [activeBatch, setActiveBatch] = useState(null);
  const totalOut = COMPOSITION.reduce((a, c) => a + c.kg, 0);
  const massDiff = ((INPUT_T - totalOut) / INPUT_T) * 100;
  const massColor = massDiff <= 5 ? 'bg-secondary-container text-primary' : 'bg-amber-100 text-amber-800';

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline-md text-headline-md text-primary font-bold">Processing Overview</h1>
        <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Network-wide material recovery and RDF conditioning.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Current Input" value={`${INPUT_T} t`} sub="Today" icon="input" tone="primary" />
        <StatCard label="Recovery Rate" value={`${Math.round((totalOut / INPUT_T) * 100)}%`} sub="Material recovered" icon="recycling" tone="accented" />
        <StatCard label="Active Batches" value={BATCHES.filter((b) => b.status === 'ACTIVE').length} sub="In line" icon="precision_manufacturing" tone="dark" />
        <StatCard label="RDF Output" value="3.0 t" sub="Conditioned" icon="local_fire_department" tone="primary" />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Network throughput</h2>
          <span className="text-sm text-on-surface-variant">{INPUT_T} t day input</span>
        </div>
        <div className="flex flex-col gap-1.5 mb-2">
          <div className="flex justify-between text-xs font-bold text-on-surface-variant"><span>Processing</span><span>{INPUT_T} t</span></div>
          <ProgressBar value={55} color="bg-secondary" />
        </div>
        <p className="text-xs text-on-surface-variant">Estimated 3.9 t remaining across incoming queues.</p>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-headline-sm text-headline-sm text-primary font-bold mb-4">Material Recovery</h2>
          <div className="flex flex-col gap-4">
            {RECOVERY.map((r) => (
              <div key={r.label}>
                <div className="flex justify-between text-sm mb-1"><span className="font-semibold text-primary">{r.label}</span><span className="font-bold text-primary">{r.value}%</span></div>
                <ProgressBar value={r.value} color={r.value >= 85 ? 'bg-secondary' : 'bg-amber-500'} />
                <p className="text-xs text-on-surface-variant mt-1">{r.note}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-headline-sm text-headline-sm text-primary font-bold mb-4">RDF Conditioning</h2>
          <div className="flex flex-col gap-4">
            {RDF.map((r) => (
              <div key={r.label}>
                <div className="flex justify-between text-sm mb-1"><span className="font-semibold text-primary">{r.label}</span><span className="font-bold text-primary">{r.value}%</span></div>
                <ProgressBar value={r.value} color="bg-amber-500" />
                <p className="text-xs text-on-surface-variant mt-1">{r.note}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="font-headline-sm text-headline-sm text-primary font-bold mb-4">Outputs breakdown</h2>
        <div className="flex h-8 rounded-full overflow-hidden mb-3">
          {COMPOSITION.map((c) => (
            <div key={c.key} className={`${c.color} flex items-center justify-center text-[10px] font-bold text-white`} style={{ width: `${(c.kg / INPUT_T) * 100}%` }} title={`${c.key}: ${c.kg} t`}>{c.key.slice(0, 3)}</div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
          {COMPOSITION.map((c) => (
            <div key={c.key} className="p-3 rounded-xl bg-surface-container-low/60">
              <span className={`w-2.5 h-2.5 rounded-full inline-block ${c.color} mr-1.5`} />
              <p className="text-sm font-bold text-primary">{c.kg} t</p>
              <p className="text-xs text-on-surface-variant">{c.key}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Batches</h2>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${massColor}`}>Mass balance: {massDiff.toFixed(1)}% delta</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-on-surface-variant border-b border-surface-container-high bg-surface-container-low/60">
                <th className="px-4 py-3 font-bold">Batch</th>
                <th className="px-4 py-3 font-bold">Pickup ref</th>
                <th className="px-4 py-3 font-bold">Input kg</th>
                <th className="px-4 py-3 font-bold">Outputs</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold">Created</th>
              </tr>
            </thead>
            <tbody>
              {BATCHES.map((b) => (
                <tr key={b.id} className="border-b border-surface-container-high last:border-0 hover:bg-surface-container-low/50 cursor-pointer" onClick={() => setActiveBatch(b)}>
                  <td className="px-4 py-3 font-bold text-primary">{b.id}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{b.ref}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{b.input}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{b.outputs}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} pending={b.status === 'ACTIVE'} /></td>
                  <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">{b.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-xs text-on-surface-variant">Input ≈ Recovered + RDF + Organic + Inert + Residual (± documented processing loss).</p>

      {activeBatch && (
        <Modal open onClose={() => setActiveBatch(null)} title={`Batch ${activeBatch.id}`}>
          <div className="flex flex-col gap-3">
            <InfoRow k="Pickup ref" v={activeBatch.ref} />
            <InfoRow k="Input" v={`${activeBatch.input} kg`} />
            <InfoRow k="Outputs" v={activeBatch.outputs} />
            <InfoRow k="Created" v={activeBatch.created} />
            <div><StatusBadge status={activeBatch.status} /></div>
            <div className="flex gap-3 mt-2">
              <Button variant="primary" onClick={() => setActiveBatch(null)}>Open passport</Button>
              <Button variant="outline" onClick={() => setActiveBatch(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function InfoRow({ k, v }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-surface-container-high last:border-0">
      <span className="text-sm text-on-surface-variant">{k}</span>
      <span className="text-sm font-bold text-primary text-right">{v}</span>
    </div>
  );
}
