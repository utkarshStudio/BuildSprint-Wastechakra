import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { dataProvider } from '../../services/dataProvider';
import { Card, StatCard, StatusBadge, Skeleton, ErrorState } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

const DEMO_BARS = [42, 58, 37, 66, 51, 74, 62];

const ALERTS = [
  { id: 1, icon: 'report', tone: 'text-error', title: 'Urgent report WC-1050 unassigned', time: '12m ago', highlight: true },
  { id: 2, icon: 'engineering', tone: 'text-amber-600', title: 'Collector Ravi offline', time: '2h ago', highlight: false },
  { id: 3, icon: 'precision_manufacturing', tone: 'text-amber-600', title: 'Facility Processing 87%', time: '3h ago', highlight: false },
];

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pickups, setPickups] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('live');

  useEffect(() => {
    async function load() {
      try {
        const [s, p, r] = await Promise.all([api.getStatsSummary(), dataProvider.getPickups(), dataProvider.getWasteReports()]);
        setStats(s);
        setPickups(p);
        setReports(r);
        setMode('live');
        setError(null);
      } catch (e) {
        setMode('demo');
        try {
          const [p, r] = await Promise.all([dataProvider.getPickups(), dataProvider.getWasteReports()]);
          setPickups(p);
          setReports(r);
          setStats({
            pickup_requests: p.length,
            completed: p.filter((x) => x.status === 'COMPLETED').length,
            pending: p.filter((x) => ['REQUESTED', 'CONFIRMED', 'ASSIGNED', 'EN_ROUTE', 'ARRIVED'].includes(x.status)).length,
            waste_kg: p.reduce((acc, x) => acc + (x.actual_weight_kg || 0), 0),
            processing: p.filter((x) => ['PROCESSING', 'COLLECTED'].includes(x.status)).length,
            rdf_kg: 18.4,
          });
          setError(null);
        } catch (e2) {
          setError('Unable to load dashboard data.');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const maxBar = Math.max(...DEMO_BARS, 1);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold">Command Center</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Live operational overview for the city waste network.</p>
        </div>
        {loading ? (
          <Skeleton className="h-8 w-36 rounded-full" />
        ) : (
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${mode === 'live' ? 'bg-secondary-container text-primary' : 'bg-amber-100 text-amber-800'}`}>
            <Icon name={mode === 'live' ? 'cloud_done' : 'science'} className="text-[16px]" />
            {mode === 'live' ? 'LIVE DATA' : 'DEMO DATA'}
          </span>
        )}
      </div>

      {error ? (
        <ErrorState title="Could not load dashboard" message={error} onRetry={() => window.location.reload()} />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard label="Pickup Requests" value={stats?.pickup_requests ?? '—'} icon="local_shipping" tone="primary" />
            <StatCard label="Completed" value={stats?.completed ?? '—'} icon="check_circle" tone="accented" />
            <StatCard label="Pending" value={stats?.pending ?? '—'} icon="schedule" tone="dark" />
            <StatCard label="Waste Collected (kg)" value={stats?.waste_kg ? `${stats.waste_kg} kg` : '—'} icon="delete_sweep" tone="accented" />
            <StatCard label="Processing" value={stats?.processing ?? '—'} icon="precision_manufacturing" tone="dark" />
            <StatCard label="RDF Produced" value={stats?.rdf_kg ? `${stats.rdf_kg} t` : '—'} icon="local_fire_department" tone="primary" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 flex flex-col gap-6">
              <Card className="p-0 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-surface-container-high">
                  <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Recent Pickups</h2>
                  <Icon name="local_shipping" className="text-on-surface-variant" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wide text-on-surface-variant border-b border-surface-container-high bg-surface-container-low/60">
                        <th className="px-5 py-3 font-bold">Pickup</th>
                        <th className="px-4 py-3 font-bold">Type</th>
                        <th className="px-4 py-3 font-bold">Waste</th>
                        <th className="px-4 py-3 font-bold">Status</th>
                        <th className="px-4 py-3 font-bold">Date</th>
                        <th className="px-5 py-3 font-bold text-right">Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pickups.slice(0, 6).map((p) => (
                        <tr key={p.id} className="border-b border-surface-container-high last:border-0 hover:bg-surface-container-low/50">
                          <td className="px-5 py-3 font-bold text-primary whitespace-nowrap">{p.pickup_id || p.id}</td>
                          <td className="px-4 py-3 text-on-surface-variant capitalize">{String(p.pickup_type || '').toLowerCase()}</td>
                          <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">{String(p.waste_type || '').replace(/_/g, ' ')}</td>
                          <td className="px-4 py-3"><StatusBadge status={p.status} pending={p.status === 'EN_ROUTE'} /></td>
                          <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">{formatDate(p.pickup_date || p.created_at)}</td>
                          <td className="px-5 py-3 text-right font-semibold text-primary whitespace-nowrap">{p.actual_weight_kg ? `${p.actual_weight_kg} kg` : '—'}</td>
                        </tr>
                      ))}
                      {pickups.length === 0 && (
                        <tr><td colSpan="6" className="px-5 py-8 text-center text-on-surface-variant">No pickups recorded.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Waste received (last 7 days)</h2>
                  <Icon name="bar_chart" className="text-on-surface-variant" />
                </div>
                <div className="flex items-end gap-3 h-40">
                  {DEMO_BARS.map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-surface-container-high rounded-t-lg flex items-end overflow-hidden h-32">
                        <div className="w-full bg-secondary-container/70 rounded-t-lg transition-all" style={{ height: `${(v / maxBar) * 100}%` }} aria-label={`${v} tonnes`} />
                      </div>
                      <span className="text-[10px] font-bold text-on-surface-variant">D{i + 1}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-on-surface-variant">
                  <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-secondary-container/70" /> tonnes/day (demo)</span>
                  <span>Peak: {maxBar} t</span>
                </div>
              </Card>
            </div>

            <div className="flex flex-col gap-6">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Recent Waste Reports</h2>
                  <Icon name="description" className="text-on-surface-variant" />
                </div>
                <ul className="space-y-3">
                  {reports.slice(0, 4).map((r) => (
                    <li key={r.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/60">
                      <Icon name="report" className={`mt-0.5 ${r.urgency === 'URGENT' ? 'text-error' : r.urgency === 'HIGH' ? 'text-amber-600' : 'text-primary'}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-primary">
                          {r.report_id}
                          <span className="font-normal text-on-surface-variant"> — {String(r.waste_type || '').replace(/_/g, ' ')}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1"><StatusBadge status={r.urgency} /><StatusBadge status={r.status} /></div>
                        <p className="text-xs text-on-surface-variant mt-1.5">{r.address || 'No address'}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Alerts</h2>
                  <Icon name="notifications_active" className="text-on-surface-variant" />
                </div>
                <ul className="space-y-3">
                  {ALERTS.map((a) => (
                    <li key={a.id} className={`flex items-start gap-3 p-3 rounded-xl ${a.highlight ? 'bg-error-container/50' : 'bg-surface-container-low/60'}`}>
                      <Icon name={a.icon} className={`mt-0.5 ${a.tone}`} />
                      <div>
                        <p className="text-sm font-bold text-primary">{a.title}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">{a.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
