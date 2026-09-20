import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StatCard, Card, StatusBadge, ProgressBar, Skeleton, ErrorState } from '../../components/ui';
import { api } from '../../services/api';
import { Icon } from '../../components/AppIcons';

const demoStats = {
  input_today: 18.4,
  processing_rate: 2.3,
  current_batch: 'BP-2026-118',
  recovered: 13.9,
  rdf: 6.2,
  residual: 2.1,
  active_stage: 'Optical AI Sorter',
};

export default function FacilityDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.getStatsSummary()
      .then((d) => mounted && setStats(d))
      .catch(() => mounted && setStats(null))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return <div className="flex flex-col gap-6"><Skeleton className="h-32" /><Skeleton className="h-48" /><Skeleton className="h-48" /></div>;
  }

  const s = stats || demoStats;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold">Facility Overview</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant">Central Recovery Plant — Eco District</p>
        </div>
        {!stats && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
            <Icon name="science" className="text-[14px]" /> SIMULATION DATA
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Input Today" value={typeof s.input_today === 'number' ? `${s.input_today} t` : '18.4 t'} icon="vertical_align_bottom" sub="MSW received" />
        <StatCard label="Processing Rate" value={typeof s.processing_rate === 'number' ? `${s.processing_rate} t/h` : '2.3 t/h'} icon="speed" sub="Current throughput" />
        <StatCard label="Current Batch" value={s.current_batch || 'BP-2026-118'} icon="inventory_2" sub="In processing" />
        <StatCard label="Recovered" value={typeof s.recovered === 'number' ? `${s.recovered} t` : '13.9 t'} icon="recycling" tone="accented" sub="Materials recovered" />
        <StatCard label="RDF Produced" value={typeof s.rdf === 'number' ? `${s.rdf} t` : '6.2 t'} icon="local_fire_department" tone="accented" sub="Fuel fraction" />
        <StatCard label="Residual" value={typeof s.residual === 'number' ? `${s.residual} t` : '2.1 t'} icon="delete_forever" sub="To disposal" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-title-md text-title-md text-primary font-bold">Current Batch Processing</h2>
            <StatusBadge status="PROCESSING" />
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Waste Reception', pct: 100 },
              { label: 'Pre-processing / Shredding', pct: 100 },
              { label: 'Trommel Screening', pct: 100 },
              { label: 'Magnetic Separation', pct: 100 },
              { label: 'Optical AI Sorting', pct: 87 },
              { label: 'Quality / Contamination', pct: 45 },
              { label: 'Routing & Recovery', pct: 0 },
            ].map((step) => (
              <div key={step.label} className="flex items-center gap-3">
                <span className="font-label-sm text-label-sm text-on-surface-variant w-44 shrink-0">{step.label}</span>
                <div className="flex-1"><ProgressBar value={step.pct} color={step.pct >= 100 ? 'bg-secondary' : 'bg-secondary'} /></div>
                <span className="font-mono-data text-mono-data text-primary font-bold w-9 text-right">{step.pct}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-title-md text-title-md text-primary font-bold mb-4">Facility Status</h2>
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-2xl bg-surface flex items-center gap-4 border border-surface-container-high">
              <span className="w-11 h-11 rounded-full bg-secondary-container text-primary flex items-center justify-center">
                <Icon name="precision_manufacturing" className="" />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2"><span className="font-bold text-primary text-sm">Line 1 — Adaptive MRF</span><StatusBadge status="busy" pending /></div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Stage: {s.active_stage || 'Optical AI Sorter'}</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-surface flex items-center gap-4 border border-surface-container-high">
              <span className="w-11 h-11 rounded-full bg-secondary-container text-primary flex items-center justify-center">
                <Icon name="compost" className="" />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2"><span className="font-bold text-primary text-sm">Line 2 — Organics</span><StatusBadge status="completed" /></div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Composting cycle complete</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-surface flex items-center gap-4 border border-surface-container-high">
              <span className="w-11 h-11 rounded-full bg-surface-container-high text-primary flex items-center justify-center">
                <Icon name="factory" className="" />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2"><span className="font-bold text-primary text-sm">Line 3 — RDF Conditioning</span><StatusBadge status="offline" /></div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Scheduled maintenance</p>
              </div>
            </div>
          </div>
          <Link to="/facility/simulation" className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary-container text-primary font-bold text-sm hover:bg-[#bbfb64] transition-all">
            <Icon name="view_in_ar" className="text-[18px]" />
            Launch Facility Simulation
          </Link>
        </Card>
      </div>

      {error && <ErrorState message={error} />}
    </div>
  );
}