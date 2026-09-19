import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collectorApi } from '../../services/collectorApi';
import { Card, StatusBadge, Skeleton, EmptyState, ErrorState, formatWeight } from '../../components/ui';
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

export default function AssignedPickups() {
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
        setPickups(resList);
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load assigned pickups');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const isHomepageLead = (p) =>
    p.estimated_quantity === 'Quote Lead' ||
    p.instructions?.includes('Quote Lead') ||
    p.address?.includes('Quote Lead');

  const citizenCount = pickups.filter((p) => !isHomepageLead(p)).length;
  const homepageCount = pickups.filter((p) => isHomepageLead(p)).length;

  const filteredPickups = pickups.filter((p) => {
    if (filterSource === 'CITIZEN') return !isHomepageLead(p);
    if (filterSource === 'HOMEPAGE') return isHomepageLead(p);
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error && pickups.length === 0) {
    return <ErrorState title="Couldn't load assigned pickups" message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold">Assigned Pickups</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Manage all pickups assigned to your account ({pickups.length} total)
          </p>
        </div>

        {/* Filter Source Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterSource('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              filterSource === 'ALL'
                ? 'bg-primary text-secondary-container shadow-xs'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            All ({pickups.length})
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

      {filteredPickups.length === 0 ? (
        <Card>
          <EmptyState
            title={filterSource === 'ALL' ? 'No assigned pickups' : `No ${filterSource === 'CITIZEN' ? 'Citizen Waste Reports' : 'Homepage Callback Queries'} found`}
            message="No pickups match the selected filter."
            icon="assignment"
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPickups.map((p) => (
            <Card key={p.id} className="flex flex-col justify-between gap-3 hover:border-secondary transition-all">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-bold text-primary text-sm">{p.pickup_id || `#${p.id}`}</span>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={p.status} />
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
                </div>

                <p className="text-sm font-bold text-primary line-clamp-2">{p.address || 'Address provided on map'}</p>

                <div className="flex items-center gap-3 text-xs text-on-surface-variant flex-wrap pt-1">
                  <span>📦 Waste: <strong className="text-primary">{p.waste_type || 'MIXED'}</strong></span>
                  <span>⚖️ Weight: <strong className="text-primary">{p.estimated_quantity || 'Standard'}</strong></span>
                  {p.user_name && <span>👤 Customer: <strong className="text-primary">{p.user_name}</strong></span>}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-surface-container-high">
                {isHomepageLead(p) ? (
                  <a
                    href={`tel:${extractPhoneNumber(p) || '0000000000'}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-950 border border-blue-300 text-xs font-extrabold hover:bg-blue-200 transition-colors shadow-2xs"
                  >
                    <Icon name="call" className="text-xs text-blue-800" /> Call {extractPhoneNumber(p) ? `(${extractPhoneNumber(p)})` : ''}
                  </a>
                ) : (
                  <a
                    href={mapsUrl(p)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-container/50 text-primary text-xs font-bold hover:bg-secondary-container transition-colors"
                  >
                    <Icon name="near_me" className="text-xs" /> Location
                  </a>
                )}
                <Link
                  to={`/collector/pickups/${p.id}`}
                  className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-primary text-secondary-container font-bold text-xs hover:bg-forest transition-colors shadow-2xs"
                >
                  View Details <Icon name="arrow_forward" className="text-xs" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
