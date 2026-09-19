import { useEffect, useState } from 'react';
import { collectorApi } from '../../services/collectorApi';
import { StatCard, Card, StatusBadge, Skeleton, EmptyState, ErrorState, formatWeight, TimeAgo } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

export default function History() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await collectorApi.getAssignedPickups();
        if (!mounted) return;
        const resList = Array.isArray(data) ? data : data.results || [];
        setPickups(resList);
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load history');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <div className="flex flex-col gap-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      </div>
    );
  }

  if (error && pickups.length === 0) {
    return <ErrorState title="Couldn't load history" message={error} onRetry={() => window.location.reload()} />;
  }

  const completed = pickups.filter((p) => ['COLLECTED', 'COMPLETED'].includes(p.status));
  const cancelled = pickups.filter((p) => p.status === 'CANCELLED');
  const todayCount = pickups.filter((p) => {
    if (!p.created_at && !p.pickup_date) return false;
    const d = new Date(p.created_at || p.pickup_date);
    return d.toDateString() === new Date().toDateString();
  }).length;
  const wasteCollected = completed.reduce((s, p) => s + (Number(p.actual_weight_kg) || 0), 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline-md text-headline-md text-primary font-bold">History</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">Completed and past pickups</p>
      </div>

      <section aria-label="History summary">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Today's Pickups" value={todayCount} icon="today" />
          <StatCard label="Completed" value={completed.length} icon="task_alt" tone="dark" />
          <StatCard label="Cancelled" value={cancelled.length} icon="block" />
          <StatCard label="Waste Collected" value={formatWeight(wasteCollected)} icon="scale" />
        </div>
      </section>

      <section aria-label="Completed pickups">
        {completed.length === 0 ? (
          <Card>
            <EmptyState title="No completed pickups" message="Pickups you finish will show up here." icon="history" />
          </Card>
        ) : (
          <ul className="flex flex-col gap-3">
            {completed.map((p) => (
              <li key={p.id}>
                <Card className="flex items-center gap-4 p-4">
                  <span className="w-10 h-10 rounded-full bg-secondary-container text-primary flex items-center justify-center shrink-0">
                    <Icon name="recycling" className="" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-label-md text-label-md text-primary font-bold">{p.pickup_id || `#${p.id}`}</span>
                      <StatusBadge status={p.status} />
                    </div>
                    <p className="text-sm text-on-surface-variant mt-1 truncate">{p.address}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {p.pickup_date || '—'} · <Icon name="schedule" className="text-[12px] align-text-bottom" /> {TimeAgo(p.created_at)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-stat-counter text-xl text-primary font-extrabold">{formatWeight(Number(p.actual_weight_kg) || 0)}</p>
                    <p className="text-[11px] font-semibold text-on-surface-variant">actual</p>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
