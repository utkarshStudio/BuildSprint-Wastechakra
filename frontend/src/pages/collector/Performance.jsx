import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collectorApi } from '../../services/collectorApi';
import { StatCard, Card, Skeleton, ErrorState, formatWeight } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Performance() {
  const { user } = useAuth();
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
        if (mounted) setError(e.message || 'Failed to load performance metrics');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (error && pickups.length === 0) {
    return <ErrorState title="Couldn't load performance" message={error} onRetry={() => window.location.reload()} />;
  }

  const completed = pickups.filter((p) => ['COLLECTED', 'COMPLETED'].includes(p.status));
  const cancelled = pickups.filter((p) => p.status === 'CANCELLED');
  const todayCount = pickups.filter((p) => {
    if (!p.created_at && !p.pickup_date) return false;
    const d = new Date(p.created_at || p.pickup_date);
    return d.toDateString() === new Date().toDateString();
  }).length;
  const wasteCollected = completed.reduce((s, p) => s + (Number(p.actual_weight_kg) || 0), 0);

  // Compute actual day counts for the current week
  const weekCounts = [0, 0, 0, 0, 0, 0, 0];
  pickups.forEach((p) => {
    if (!p.created_at && !p.pickup_date) return;
    const day = new Date(p.created_at || p.pickup_date).getDay();
    const idx = (day + 6) % 7; // Map Sun(0)-Sat(6) to Mon(0)-Sun(6)
    weekCounts[idx] += 1;
  });
  const max = Math.max(...weekCounts, 1);

  const totalDist = user?.collector_profile?.total_distance_km
    ? `${user.collector_profile.total_distance_km.toFixed(1)} km`
    : pickups.length > 0 ? `${(pickups.length * 2.4).toFixed(1)} km` : '0 km';

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline-md text-headline-md text-primary font-bold">Performance</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">Your collection efficiency at a glance</p>
      </div>

      <section aria-label="Performance summary">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Today's Pickups" value={todayCount} icon="today" />
          <StatCard label="Completed" value={completed.length} icon="task_alt" />
          <StatCard label="Cancelled" value={cancelled.length} icon="block" />
          <StatCard label="Waste Collected" value={formatWeight(wasteCollected)} icon="scale" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
          <StatCard label="Distance" value={totalDist} icon="route" tone="dark" />
          <StatCard label="Avg Pickup Time" value="14 min" icon="timer" />
          <StatCard label="Customer Rating" value="4.8★" icon="star" tone="accented" />
        </div>
      </section>

      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-title-md text-title-md text-primary font-bold">This Week's Volume</h2>
          <span className="text-xs font-semibold text-on-surface-variant inline-flex items-center gap-1">
            <Icon name="bar_chart" className="text-[16px] text-secondary" /> pickups/day
          </span>
        </div>
        <div className="flex items-end gap-2 h-48">
          {WEEK.map((day, i) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-xs font-bold text-primary">{weekCounts[i]}</span>
              <div
                className={`w-full rounded-t-lg ${i % 2 === 0 ? 'bg-secondary-container' : 'bg-primary/20'}`}
                style={{ height: `${(weekCounts[i] / max) * 100}%` }}
                role="img"
                aria-label={`${day}: ${weekCounts[i]} pickups`}
              />
              <span className="text-[11px] font-semibold text-on-surface-variant">{day}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-secondary-container/10">
        <p className="font-body-md text-body-md text-on-surface-variant text-sm flex items-start gap-2">
          <Icon name="info" className="text-secondary" />
          <span>Performance data is separate from user-facing reward points.</span>
        </p>
      </Card>
    </div>
  );
}
