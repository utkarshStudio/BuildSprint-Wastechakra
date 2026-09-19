import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { businessApi } from '../../services/businessApi';
import { useAuth } from '../../context/AuthContext';
import { StatCard, Card, StatusBadge, Skeleton, EmptyState, ErrorState, formatWeight } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

export default function Dashboard() {
  const { user } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [pickupRes, impactRes] = await Promise.allSettled([
          businessApi.getPickups(),
          businessApi.getImpact(),
        ]);

        if (!mounted) return;

        if (pickupRes.status === 'fulfilled') {
          const raw = pickupRes.value;
          const list = Array.isArray(raw) ? raw : raw?.results || [];
          setPickups(list);
        }

        if (impactRes.status === 'fulfilled') {
          setImpact(impactRes.value);
        }
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load business dashboard');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (error && pickups.length === 0 && !impact) {
    return <ErrorState title="Couldn't load dashboard" message={error} onRetry={() => window.location.reload()} />;
  }

  // Real calculations
  const totalWasteKg = impact?.waste_submitted_kg || pickups.reduce((s, p) => s + (Number(p.actual_weight_kg) || 0), 0);
  const recoveredKg = impact?.waste_recovered_kg || 0;
  const activePickups = pickups.filter((p) => !['COMPLETED', 'CANCELLED'].includes(p.status));
  const completedPickups = pickups.filter((p) => p.status === 'COMPLETED');
  const recent = pickups.slice(0, 6);

  // Category counts from real records
  const recyclablesCount = pickups.filter((p) => ['RECYCLABLES', 'PLASTIC', 'PAPER', 'METAL'].includes(p.waste_type)).length;
  const organicCount = pickups.filter((p) => p.waste_type === 'ORGANIC').length;

  const quickActions = [
    { label: 'Schedule Bulk Pickup', to: '/business/pickups', icon: 'local_shipping' },
    { label: 'Analytics & Trends', to: '/business/analytics', icon: 'analytics' },
    { label: 'Account & Facility Settings', to: '/business/settings', icon: 'settings' },
  ];

  const businessName = user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : (user?.username || 'Enterprise Account');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline-md text-headline-md text-primary font-bold">Business Dashboard</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Welcome, <strong className="text-primary">{businessName}</strong> · Commercial Waste & Recovery Program
        </p>
      </div>

      {/* Real Dynamic Overview Stats */}
      <section aria-label="Waste summary">
        <h2 className="font-title-md text-title-md text-primary font-bold mb-3">Waste Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Total Waste Logged" value={formatWeight(totalWasteKg)} icon="delete" />
          <StatCard label="Recovered Resource" value={formatWeight(recoveredKg)} icon="recycling" tone="dark" />
          <StatCard label="Active Pickups" value={activePickups.length} icon="local_shipping" />
          <StatCard label="Completed Cycles" value={completedPickups.length} icon="task_alt" tone="accented" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
          <StatCard label="Recyclable Batches" value={recyclablesCount} icon="eco" />
          <StatCard label="Organics Diverted" value={organicCount} icon="yard" />
          <StatCard label="Chakra Points" value={impact?.chakra_points || 0} icon="tokens" />
        </div>
      </section>

      {/* Quick actions */}
      <section aria-label="Quick actions">
        <h2 className="font-title-md text-title-md text-primary font-bold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((a) => (
            <Link
              key={a.label}
              to={a.to}
              className="flex items-center gap-3 bg-surface-container-lowest border border-surface-container-high rounded-2xl p-4 hover:border-secondary transition-colors"
            >
              <span className="w-10 h-10 rounded-full bg-secondary-container text-primary flex items-center justify-center shrink-0">
                <Icon name={a.icon} className="" />
              </span>
              <span className="font-label-md text-label-md text-primary font-bold">{a.label}</span>
              <Icon name="chevron_right" className="text-on-surface-variant ml-auto" />
            </Link>
          ))}
        </div>
      </section>

      {/* Recent pickups */}
      <section aria-label="Recent pickups">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-title-md text-title-md text-primary font-bold">Recent Pickups</h2>
          <Link to="/business/pickups" className="text-sm font-bold text-secondary hover:text-primary">View all</Link>
        </div>
        {recent.length === 0 ? (
          <Card>
            <EmptyState
              title="No pickups scheduled yet"
              message="Schedule your commercial bulk waste collection to begin tracking diversion and generating ESG audit passports."
              icon="local_shipping"
              action={
                <Link to="/business/pickups" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container text-primary font-bold text-sm hover:bg-[#bbfb64] transition-colors">
                  <Icon name="add" className="" /> Schedule Bulk Pickup
                </Link>
              }
            />
          </Card>
        ) : (
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-on-surface-variant border-b border-surface-container-high">
                    <th className="px-4 py-3 font-bold">Pickup ID</th>
                    <th className="px-4 py-3 font-bold">Date</th>
                    <th className="px-4 py-3 font-bold">Type</th>
                    <th className="px-4 py-3 font-bold">Quantity</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((p) => (
                    <tr key={p.id} className="border-b border-surface-container-high last:border-0 hover:bg-surface-container-low transition-colors">
                      <td className="px-4 py-3 font-bold text-primary">{p.pickup_id || `#${p.id}`}</td>
                      <td className="px-4 py-3 text-on-surface-variant">{p.pickup_date || '—'}</td>
                      <td className="px-4 py-3 text-on-surface-variant">{p.waste_type}</td>
                      <td className="px-4 py-3 text-on-surface-variant font-medium">
                        {p.actual_weight_kg ? `${p.actual_weight_kg} kg` : (p.estimated_quantity ? (p.estimated_quantity.toLowerCase().includes('kg') ? p.estimated_quantity : `${p.estimated_quantity} kg`) : 'Standard')}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="px-4 py-3 text-xs font-semibold text-on-surface-variant border-t border-surface-container-high">
              Total pickups recorded: {pickups.length} · Collected weight to date: {formatWeight(totalWasteKg)}
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
