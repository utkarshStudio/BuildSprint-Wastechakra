import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataProvider } from '../../services/dataProvider';
import { Card, StatCard, Skeleton, ErrorState, formatWeight } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

export default function CitizenImpact() {
  const { user } = useAuth();
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImpact = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataProvider.getImpact();
      setImpact(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImpact(); }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchImpact} />;
  }

  const firstName = user?.first_name || 'User';
  const monthly = impact?.monthly || [];
  const maxMonthly = Math.max(...monthly.map((m) => m.submitted || 0), 1);

  const formatKg = (v) => v ? `${Math.round(v)} kg` : '0 kg';

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline-md text-headline-md text-primary font-bold">{firstName}'s Impact</h1>

      <div className="grid grid-cols-2 grid-cols-3 gap-4">
        <StatCard label="Total Waste Submitted" value={formatKg(impact?.waste_submitted_kg)} icon={<Icon name="upload" className="" />} tone="accented" />
        <StatCard label="Recovered" value={formatKg(impact?.waste_recovered_kg)} icon={<Icon name="recycling" className="" />} tone="dark" />
        <StatCard label="Recycled" value={formatKg((impact?.waste_recovered_kg || 0) * 0.68)} icon={<Icon name="autorenew" className="" />} />
        <StatCard label="Organic Recovery" value={formatKg((impact?.waste_recovered_kg || 0) * 0.35)} icon={<Icon name="grass" className="" />} />
        <StatCard label="RDF Recovery" value={formatKg((impact?.waste_recovered_kg || 0) * 0.15)} icon={<Icon name="local_fire_department" className="" />} />
        <StatCard label="Disposal Avoided" value={formatKg(impact?.waste_recovered_kg || 0)} icon={<Icon name="delete_sweep" className="" />} />
      </div>

      <Card>
        <h2 className="font-headline-md text-headline-md text-primary font-bold mb-4">Monthly Progress</h2>
        <div className="flex items-end justify-between gap-4 h-40">
          {monthly.map((m) => (
            <div key={m.month} className="flex flex-col items-center gap-1 flex-1">
              <div className="w-full flex flex-col justify-end items-center gap-1" style={{ height: '160px' }}>
                <span className="text-[10px] font-bold text-on-surface-variant">{m.recovered || 0}</span>
                <div className="w-full bg-forest rounded-t-md" style={{ height: `${(m.recovered || 0) / maxMonthly * 100}%` }} />
                <div className="w-full bg-secondary rounded-t-md" style={{ height: `${(m.submitted || 0) / maxMonthly * 100}%` }} />
              </div>
              <span className="text-xs font-bold text-on-surface-variant">{m.month.slice(0, 3)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-secondary" />
            <span className="text-xs text-on-surface-variant">Submitted</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-forest" />
            <span className="text-xs text-on-surface-variant">Recovered</span>
          </div>
        </div>
      </Card>

      <p className="text-xs text-on-surface-variant text-center">Estimates based on configurable recovery methodology.</p>
    </div>
  );
}
