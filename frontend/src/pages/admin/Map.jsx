import { useState } from 'react';
import { Modal, Button, StatusBadge } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

const LAYERS = [
  { id: 'pickups', label: 'Pickup Requests', icon: 'local_shipping', color: 'bg-blue-500' },
  { id: 'collectors', label: 'Collectors', icon: 'engineering', color: 'bg-forest' },
  { id: 'facilities', label: 'Facilities', icon: 'factory', color: 'bg-secondary' },
  { id: 'recycling', label: 'Recycling Centers', icon: 'recycling', color: 'bg-emerald-600' },
  { id: 'reports', label: 'Waste Reports', icon: 'report', color: 'bg-error' },
  { id: 'dump', label: 'Illegal Dumping', icon: 'warning', color: 'bg-amber-500' },
  { id: 'events', label: 'Community Events', icon: 'groups', color: 'bg-teal-500' },
];

const MARKERS = [
  { id: 'm1', x: 28, y: 34, type: 'report', tone: 'bg-error', label: 'WC-1050' },
  { id: 'm2', x: 62, y: 48, type: 'report-low', tone: 'bg-amber-400', label: 'WC-1049' },
  { id: 'm3', x: 44, y: 60, type: 'pickup', tone: 'bg-blue-500', label: 'Pickup #284' },
  { id: 'm4', x: 74, y: 28, type: 'completed', tone: 'bg-secondary', label: 'Pickup #283' },
  { id: 'm5', x: 12, y: 66, type: 'facility', tone: 'bg-secondary', label: 'MRF North' },
  { id: 'm6', x: 82, y: 72, type: 'recycling', tone: 'bg-emerald-600', label: 'Recycling Hub' },
  { id: 'm7', x: 55, y: 18, type: 'event', tone: 'bg-teal-500', label: 'Cleanup Drive' },
];

const DETAIL_CARD = {
  title: 'Waste Report #WC-1048',
  body: [
    ['Waste Type', 'Mixed Municipal Waste'],
    ['Estimated Quantity', '35 kg'],
    ['Reported', 'Today'],
    ['Priority', 'High'],
    ['Status', 'PICKUP_SCHEDULED'],
  ],
};

export default function AdminMap() {
  const [activeLayers, setActiveLayers] = useState(() => new Set(['pickups', 'collectors', 'facilities', 'recycling', 'reports', 'dump', 'events']));
  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const toggleLayer = (id) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onSelect = (m) => {
    setSelected(m);
    if (m.type === 'report' || m.type === 'report-low') setShowDetail(true);
  };

  const visible = MARKERS.filter((m) => {
    const mapFor = {
      report: 'reports', 'report-low': 'reports', pickup: 'pickups', completed: 'pickups',
      facility: 'facilities', recycling: 'recycling', event: 'events',
    };
    return activeLayers.has(mapFor[m.type] || m.type);
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold">Live Operations Map</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Real-time fleet, reports and facility positions across the city.</p>
        </div>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> DEMO FEED
        </span>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="w-full xl:w-72 shrink-0 flex flex-col gap-6">
          <CardLayers layers={LAYERS} active={activeLayers} onToggle={toggleLayer} />
          <CardFilters />
        </div>

        <div className="flex-1">
          <div className="relative rounded-2xl overflow-hidden border border-surface-container-high" style={{ minHeight: 560, background: 'linear-gradient(135deg,#0d2a1a 0%,#123a26 35%,#1b5136 60%,#24420e 100%)' }}>
            <div
              className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'linear-gradient(rgba(171,248,84,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(171,248,84,0.5) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
            />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 40%, rgba(171,248,84,0.18), transparent 55%), radial-gradient(circle at 75% 60%, rgba(70,101,81,0.35), transparent 60%)' }} />

            <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 bg-black/50 text-white px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur">
              <Icon name="location_on" className="text-[16px]" /> Eco City Sector 4
            </div>

            <div className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 bg-black/50 text-white px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur">
              Zoom: 12.4
            </div>

            {visible.map((m) => (
              <button
                key={m.id}
                onClick={() => onSelect(m)}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                style={{ left: `${m.x}%`, top: `${m.y}%` }}
                aria-label={m.label}
              >
                <span className={`block w-3.5 h-3.5 rounded-full ${m.tone} ring-2 ring-white/80 shadow-lg group-hover:scale-125 transition-transform`} />
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {m.label}
                </span>
              </button>
            ))}

            <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-2 text-[10px] font-bold text-white/90">
              <LegendDot tone="bg-error" label="Report" />
              <LegendDot tone="bg-amber-400" label="Low priority" />
              <LegendDot tone="bg-blue-500" label="Pickup assigned" />
              <LegendDot tone="bg-secondary" label="Completed/Facility" />
              <LegendDot tone="bg-emerald-600" label="Recycling" />
            </div>
          </div>
        </div>
      </div>

      {selected && showDetail && (
        <Modal open={showDetail} onClose={() => setShowDetail(false)} title={DETAIL_CARD.title}>
          <div className="flex flex-col gap-3">
            {DETAIL_CARD.body.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2 border-b border-surface-container-high last:border-0">
                <span className="text-sm text-on-surface-variant">{k}</span>
                {k === 'Status' ? <StatusBadge status={v} /> : <span className="text-sm font-bold text-primary">{v}</span>}
              </div>
            ))}
            <div className="flex gap-3 mt-4">
              <Button variant="primary" onClick={() => setShowDetail(false)}>View Details</Button>
              <Button variant="outline" onClick={() => setShowDetail(false)}>Request Pickup</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function LegendDot({ tone, label }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-2.5 h-2.5 rounded-full ${tone}`} /> {label}
    </span>
  );
}

function CardLayers({ layers, active, onToggle }) {
  return (
    <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="layers" className="text-secondary" />
        <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Layers</h2>
      </div>
      <ul className="space-y-1">
        {layers.map((l) => (
          <li key={l.id}>
            <label className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-container-low cursor-pointer">
              <input type="checkbox" checked={active.has(l.id)} onChange={() => onToggle(l.id)} className="accent-primary h-4 w-4" aria-label={`Toggle ${l.label}`} />
              <span className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
              <span className="flex items-center gap-2 text-sm font-semibold text-primary"><Icon name={l.icon} className="text-[18px] text-on-surface-variant" />{l.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CardFilters() {
  return (
    <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="filter_alt" className="text-secondary" />
        <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Filters</h2>
      </div>
      <div className="flex flex-col gap-3">
        <Labeled label="Waste Type">
          <select className="w-full px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm">
            {['All types', 'Mixed', 'Plastic', 'Organic', 'E-Waste', 'Recyclables'].map((t) => <option key={t}>{t}</option>)}
          </select>
        </Labeled>
        <Labeled label="Status">
          <select className="w-full px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm">
            {['All statuses', 'Requested', 'Assigned', 'In progress', 'Completed'].map((t) => <option key={t}>{t}</option>)}
          </select>
        </Labeled>
        <Labeled label="Priority">
          <select className="w-full px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm">
            {['All priorities', 'Normal', 'High', 'Urgent'].map((t) => <option key={t}>{t}</option>)}
          </select>
        </Labeled>
        <Labeled label="Area">
          <input type="text" placeholder="e.g. Sector 4, Tech Park" className="w-full px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" aria-label="Area filter" />
        </Labeled>
        <Labeled label="Date">
          <input type="date" className="w-full px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" aria-label="Date filter" />
        </Labeled>
      </div>
    </div>
  );
}

function Labeled({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">{label}</span>
      {children}
    </label>
  );
}
