import { useState } from 'react';
import { Card, StatCard } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

const MONTHLY = [
  { m: 'Apr', received: 28, recovered: 24 },
  { m: 'May', received: 32, recovered: 27 },
  { m: 'Jun', received: 26, recovered: 21 },
  { m: 'Jul', received: 35, recovered: 30 },
  { m: 'Aug', received: 41, recovered: 36 },
  { m: 'Sep', received: 44, recovered: 39 },
];

const COMP = [
  { key: 'Plastic', val: 26, color: 'bg-secondary' },
  { key: 'Paper', val: 18, color: 'bg-forest' },
  { key: 'Metal', val: 9, color: 'bg-slate-400' },
  { key: 'Organic', val: 22, color: 'bg-green-700' },
  { key: 'RDF', val: 15, color: 'bg-amber-500' },
  { key: 'Inert', val: 6, color: 'bg-stone-400' },
  { key: 'Residual', val: 4, color: 'bg-error' },
];

export default function AdminAnalytics() {
  const [from, setFrom] = useState('');
  const [location, setLocation] = useState('All locations');
  const [facility, setFacility] = useState('All facilities');
  const [wasteType, setWasteType] = useState('All types');
  const [customer, setCustomer] = useState('All customers');

  const maxReceived = Math.max(...MONTHLY.map((m) => m.received), 1);
  const recoveredRate = Math.round((39 / 44) * 100);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold">Analytics</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Network performance, recovery and environmental impact.</p>
        </div>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
          <Icon name="science" className="text-[16px]" /> DEMO METRICS
        </span>
      </div>

      <Card className="p-4 grid grid-cols-2 md:grid-cols-5 gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Date</span>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" />
        </label>
        <SelectOptions value={location} onChange={setLocation} options={['All locations', 'Eco District', 'Tech Park', 'Green Valley']} label="Location" />
        <SelectOptions value={facility} onChange={setFacility} options={['All facilities', 'North MRF', 'Composting Unit', 'RDF Plant']} label="Facility" />
        <SelectOptions value={wasteType} onChange={setWasteType} options={['All types', 'Mixed', 'Plastic', 'Organic', 'E-Waste']} label="Waste type" />
        <SelectOptions value={customer} onChange={setCustomer} options={['All customers', 'Citizen', 'Business', 'Society']} label="Customer type" />
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
        <StatCard label="Waste Received" value="184 t" sub="This month" icon="delete_sweep" tone="primary" />
        <StatCard label="Recovered" value="156 t" sub="84.8%" icon="recycling" tone="accented" />
        <StatCard label="Recyclables" value="52 t" sub="Plastic + paper + metal" icon="local_activity" tone="dark" />
        <StatCard label="Organic Recovery" value="41 t" sub="Compost output" icon="grass" tone="primary" />
        <StatCard label="RDF Produced" value="27 t" sub="Conditioned fuel" icon="local_fire_department" tone="accented" />
        <StatCard label="Residual" value="7.4 t" sub="To landfill" icon="delete" tone="dark" />
        <StatCard label="Recovery Rate" value={`${recoveredRate}%`} sub="Network avg" icon="percent" tone="primary" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Monthly recovery (tonnes)</h2>
            <Icon name="bar_chart" className="text-on-surface-variant" />
          </div>
          <div className="flex items-end gap-3 h-48">
            {MONTHLY.map((m) => (
              <div key={m.m} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full rounded-t-lg overflow-hidden flex items-end h-40 bg-surface-container-low">
                  <div className="w-full bg-forest/30" style={{ height: `${(m.recovered / maxReceived) * 100}%` }} aria-label={`Recovered ${m.recovered}t`} />
                </div>
                <div className="w-full rounded-t-lg flex items-end h-28">
                  <div className="w-full bg-secondary/70" style={{ height: `${(m.received / maxReceived) * 100}%` }} aria-label={`Received ${m.received}t`} />
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant">{m.m}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 text-xs text-on-surface-variant">
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-forest/30" /> Recovered</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-secondary/70" /> Received</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Composition (this month)</h2>
            <Icon name="stacked_bar_chart" className="text-on-surface-variant" />
          </div>
          <div className="flex h-10 rounded-full overflow-hidden mb-4">
            {COMP.map((c) => (
              <div key={c.key} className={`${c.color} flex items-center justify-center text-[10px] font-bold text-white`} style={{ width: `${c.val}%` }} title={`${c.key}: ${c.val}%`}>{c.key.slice(0, 3)}</div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {COMP.map((c) => (
              <div key={c.key} className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low/60">
                <span className={`w-3 h-3 rounded-sm ${c.color}`} />
                <div><p className="text-sm font-bold text-primary leading-none">{c.val}%</p><p className="text-xs text-on-surface-variant">{c.key}</p></div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Icon name="eco" className="text-secondary" />
          <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Environmental impact</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <ImpactTile icon="device_thermostat" title="Waste Diverted" value="72%" sub="vs. landfill baseline" />
          <ImpactTile icon="recycling" title="Recyclables Recovered" value="156 t" sub="this quarter" />
          <ImpactTile icon="local_fire_department" title="RDF Produced" value="81 t" sub="fed to cement kilns" />
          <ImpactTile icon="delete_sweep" title="Landfill Diversion" value="89%" sub="of incoming waste" />
        </div>
        <p className="text-xs text-on-surface-variant mt-4">Estimates based on configurable methodology.</p>
      </Card>
    </div>
  );
}

function SelectOptions({ value, onChange, options, label }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

function ImpactTile({ icon, title, value, sub }) {
  return (
    <div className="p-4 rounded-2xl bg-forest text-on-primary flex flex-col gap-1">
      <Icon name={icon} className="text-secondary-fixed" />
      <p className="text-2xl font-extrabold leading-none mt-2">{value}</p>
      <p className="text-sm font-bold">{title}</p>
      <p className="text-xs opacity-70">{sub}</p>
    </div>
  );
}