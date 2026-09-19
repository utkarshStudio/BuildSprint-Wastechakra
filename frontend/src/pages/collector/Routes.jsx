import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collectorApi } from '../../services/collectorApi';
import { Card, StatusBadge, Skeleton, EmptyState, ErrorState } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

function mapsUrl(p) {
  if (p.latitude && p.longitude) {
    return `https://maps.google.com/?q=${p.latitude},${p.longitude}`;
  }
  return `https://maps.google.com/?q=${encodeURIComponent(p.address || 'India')}`;
}

function extractPhoneNumber(pickup) {
  if (!pickup) return '';
  const str = `${pickup.address || ''} ${pickup.instructions || ''}`;
  const match = str.match(/(?:Contact|Phone)?:\s*(\+?\d[\d\s-]{7,14})/i) || str.match(/(\+?91)?\s*([6-9]\d{9})/);
  if (match) {
    return (match[1] || match[2] || match[0]).replace(/[^\d+]/g, '');
  }
  return '';
}

export default function Routes() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterSource, setFilterSource] = useState('ALL');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await collectorApi.getAssignedPickups();
        if (!mounted) return;
        const resList = Array.isArray(data) ? data : data.results || [];
        const ordered = resList.slice().sort((a, b) => (a.status === 'EN_ROUTE' ? -1 : 1));
        setPickups(ordered);
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load route');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const move = (index, dir) => {
    setPickups((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const markComplete = async (p) => {
    try {
      await collectorApi.updatePickupStatus(p.id, { status: 'COLLECTED' });
    } catch (err) {
      console.error('Status update error:', err);
    }
    setPickups((prev) => {
      const i = prev.findIndex((x) => x.id === p.id);
      if (i === -1) return prev;
      const next = [...prev];
      next[i] = { ...next[i], status: 'COLLECTED' };
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-56 rounded-2xl" />
        <div className="flex flex-col gap-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>
      </div>
    );
  }

  if (error && pickups.length === 0) {
    return <ErrorState title="Couldn't load route" message={error} onRetry={() => window.location.reload()} />;
  }

  const isHomepageLead = (p) =>
    p.estimated_quantity === 'Quote Lead' ||
    p.instructions?.includes('Quote Lead') ||
    p.address?.includes('Quote Lead');

  const active = pickups.filter((p) => !['ASSIGNED', 'COMPLETED', 'CANCELLED'].includes(p.status));
  const citizenCount = active.filter((p) => !isHomepageLead(p)).length;
  const homepageCount = active.filter((p) => isHomepageLead(p)).length;

  const filteredActive = active.filter((p) => {
    if (filterSource === 'CITIZEN') return !isHomepageLead(p);
    if (filterSource === 'HOMEPAGE') return isHomepageLead(p);
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <section aria-label="Pickup order">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="font-title-md text-title-md text-primary font-bold">Pickup Order</h2>

          {/* Filter Source Buttons Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilterSource('ALL')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                filterSource === 'ALL'
                  ? 'bg-primary text-secondary-container shadow-xs'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              All Orders ({active.length})
            </button>
            <button
              onClick={() => setFilterSource('CITIZEN')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterSource === 'CITIZEN'
                  ? 'bg-primary text-secondary-container shadow-xs'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              <Icon name="delete" className="text-xs" /> Citizen Reports ({citizenCount})
            </button>
            <button
              onClick={() => setFilterSource('HOMEPAGE')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterSource === 'HOMEPAGE'
                  ? 'bg-primary text-secondary-container shadow-xs'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              <Icon name="call" className="text-xs" /> Homepage Queries ({homepageCount})
            </button>
          </div>
        </div>

        {filteredActive.length === 0 ? (
          <Card>
            <EmptyState
              title={filterSource === 'ALL' ? 'Route is clear' : `No ${filterSource === 'CITIZEN' ? 'Citizen Waste Reports' : 'Homepage Callback Queries'} found`}
              message="No active pickups match the selected filter."
              icon="route"
            />
          </Card>
        ) : (
          <ol className="flex flex-col gap-3">
            {filteredActive.map((p, i) => (
              <li key={p.id}>
                <Card className="flex items-start gap-3 p-4">
                  <div className="w-9 h-9 rounded-full bg-secondary-container text-primary font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-label-md text-label-md text-primary font-bold">Pickup {i + 1}</span>
                      <StatusBadge status={p.status} />

                      {/* Source Origin Badge */}
                      {isHomepageLead(p) ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200 text-[10px] font-extrabold flex items-center gap-1 shadow-2xs">
                          <Icon name="call" className="text-[11px]" /> Homepage Query
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 text-[10px] font-extrabold flex items-center gap-1 shadow-2xs">
                          <Icon name="delete" className="text-[11px]" /> Citizen Report
                        </span>
                      )}
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">{p.address}</p>
                    <p className="text-xs font-semibold text-on-surface-variant mt-1 inline-flex items-center gap-1">
                      <Icon name="near_me" className="text-[14px]" />{p.latitude && p.longitude ? `${p.latitude.toFixed(2)}, ${p.longitude.toFixed(2)}` : 'On route list'}
                    </p>
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      {isHomepageLead(p) ? (
                        <a
                          href={`tel:${extractPhoneNumber(p) || '0000000000'}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-950 border border-blue-300 text-xs font-extrabold hover:bg-blue-200 transition-colors shadow-2xs"
                        >
                          <Icon name="call" className="text-xs text-blue-800" /> Call {extractPhoneNumber(p) ? `(${extractPhoneNumber(p)})` : ''}
                        </a>
                      ) : (
                        <a
                          href={mapsUrl(p)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-container text-primary text-xs font-bold hover:bg-[#bbfb64] transition-colors"
                        >
                          <Icon name="map" className="text-[16px]" /> Location
                        </a>
                      )}
                      <Link
                        to={`/collector/pickups/${p.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-surface-container-highest text-primary text-xs font-bold hover:bg-surface-container-low transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => markComplete(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-surface-container-highest text-on-surface-variant text-xs font-bold hover:bg-surface-container-low transition-colors"
                        aria-label={`Mark pickup ${p.pickup_id} complete`}
                      >
                        <Icon name="task_alt" className="text-[16px]" /> Mark Complete
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className="w-8 h-8 rounded-full border border-surface-container-highest text-primary flex items-center justify-center hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label={`Move pickup ${p.pickup_id} up`}
                    >
                      <Icon name="expand_less" className="text-[18px]" />
                    </button>
                    <button
                      onClick={() => move(i, 1)}
                      disabled={i === active.length - 1}
                      className="w-8 h-8 rounded-full border border-surface-container-highest text-primary flex items-center justify-center hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label={`Move pickup ${p.pickup_id} down`}
                    >
                      <Icon name="expand_more" className="text-[18px]" />
                    </button>
                  </div>
                </Card>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
