import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { collectorApi } from '../../services/collectorApi';
import { StatCard, Card, StatusBadge, Skeleton, EmptyState, ErrorState, formatWeight } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

import { playNotificationSound, triggerPickupNotification } from '../../utils/notificationSound';

const ACTIVE_STATUSES = ['REQUESTED', 'CONFIRMED', 'ASSIGNED', 'EN_ROUTE', 'ARRIVED', 'PROCESSING'];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function today() {
  return new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
}

function calcRouteDistance(pickupsList) {
  const points = pickupsList.filter((p) => p.latitude && p.longitude);
  if (points.length < 2) {
    return points.length === 1 ? '1.5 km' : pickupsList.length > 0 ? `${(pickupsList.length * 2.2).toFixed(1)} km` : '0 km';
  }
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const lat1 = Number(points[i].latitude);
    const lon1 = Number(points[i].longitude);
    const lat2 = Number(points[i + 1].latitude);
    const lon2 = Number(points[i + 1].longitude);
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    total += 6371 * c;
  }
  return `${total.toFixed(1)} km`;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastOfferedCount, setLastOfferedCount] = useState(0);
  const [filterSource, setFilterSource] = useState('ALL');

  const isHomepageLead = (p) =>
    p.estimated_quantity === 'Quote Lead' ||
    p.instructions?.includes('Quote Lead') ||
    p.address?.includes('Quote Lead');

  useEffect(() => {
    let mounted = true;
    const fetchPickups = async () => {
      try {
        const data = await collectorApi.getAssignedPickups();
        if (!mounted) return;
        const resList = Array.isArray(data) ? data : data.results || [];
        setPickups(resList);

        const currentOffered = resList.filter((p) => p.status === 'OFFERED');
        if (currentOffered.length > 0 && currentOffered.length > lastOfferedCount) {
          triggerPickupNotification(currentOffered[0]);
        }
        setLastOfferedCount(currentOffered.length);
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load assigned pickups');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPickups();
    // Poll every 10 seconds for real-time dispatch alerts
    const interval = setInterval(fetchPickups, 10000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [lastOfferedCount]);

  const offeredPickups = pickups.filter((p) => p.status === 'OFFERED' && (p.offered_collector_email === user?.email || !p.collector));
  const openPoolPickups = pickups.filter((p) => !p.collector && p.status !== 'OFFERED');
  const todayPickups = pickups.filter((p) => p.collector && !['COMPLETED', 'CANCELLED'].includes(p.status));

  const handleAccept = async (id) => {
    try {
      await collectorApi.acceptPickup(id);
      const data = await collectorApi.getAssignedPickups();
      setPickups(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      alert(err.message || 'Failed to accept pickup');
    }
  };

  const handleReject = async (id) => {
    try {
      await collectorApi.rejectPickup(id);
      const data = await collectorApi.getAssignedPickups();
      setPickups(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      alert(err.message || 'Failed to pass pickup');
    }
  };

  const handleClaim = async (id) => {
    try {
      await collectorApi.claimPickup(id);
      const data = await collectorApi.getAssignedPickups();
      setPickups(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      alert(err.message || 'Failed to claim pickup');
    }
  };

  const estTotal = todayPickups.reduce((sum, p) => {
    const m = String(p.estimated_quantity || '').match(/\d+/);
    return sum + (m ? Number(m[0]) : 0);
  }, 0);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <Skeleton className="h-12 rounded-full" />
        <div className="flex flex-col gap-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>
      </div>
    );
  }

  if (error && todayPickups.length === 0 && offeredPickups.length === 0) {
    return <ErrorState title="Couldn't load dashboard" message={error} onRetry={() => window.location.reload()} />;
  }

  const firstName = user?.first_name || 'Collector';
  const totalDistanceStr = user?.collector_profile?.total_distance_km
    ? `${user.collector_profile.total_distance_km.toFixed(1)} km`
    : calcRouteDistance(todayPickups);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold">{greeting()} {firstName} 👋</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">{today()}</p>
        </div>
        <button
          onClick={() => playNotificationSound()}
          title="Test Alert Chime Sound"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary-container/40 hover:bg-secondary-container text-xs font-bold text-primary transition-all border border-secondary-container/60 shrink-0 shadow-sm"
        >
          <Icon name="volume_up" className="text-base text-forest" /> Test Sound Chime
        </button>
      </div>

      {/* OFFERED PICKUPS ALERT BANNER */}
      {offeredPickups.length > 0 && (
        <section aria-label="Offered pickups alert">
          <h2 className="font-title-md text-title-md text-primary font-bold mb-3 flex items-center gap-2">
            <Icon name="notifications_active" className="text-secondary-container text-xl animate-bounce" />
            New Pickup Offered Nearby ({offeredPickups.length})
          </h2>
          <div className="flex flex-col gap-3">
            {offeredPickups.map((p) => (
              <div key={p.id} className="bg-secondary-container/20 border-2 border-secondary-container rounded-2xl p-4 flex flex-col gap-3 shadow-md">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-forest text-secondary-container text-xs font-bold uppercase">
                      OFFERED TO YOU
                    </span>
                    <span className="font-bold text-primary text-sm">{p.pickup_id || `#${p.id}`}</span>
                  </div>
                  {p.distance_km != null && (
                    <span className="px-2.5 py-1 rounded-full bg-secondary-container text-primary font-bold text-xs flex items-center gap-1">
                      <Icon name="near_me" className="text-xs" /> {p.distance_km} km away
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-sm font-bold text-primary">{p.address || 'Address provided on map'}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-on-surface-variant flex-wrap">
                    <span>📦 Waste: <strong className="text-primary">{p.waste_type || 'MIXED'}</strong></span>
                    <span>⚖️ Quantity: <strong className="text-primary">{p.estimated_quantity || '5-20 kg'}</strong></span>
                    <span>👤 Customer: <strong className="text-primary">{p.user_name || p.user_email}</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => handleAccept(p.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-forest text-secondary-container font-bold text-sm hover:bg-[#0a3a2a]/90 transition-all flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Icon name="check_circle" className="text-base" /> ACCEPT PICKUP
                  </button>
                  <button
                    onClick={() => handleReject(p.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-container-highest font-bold text-sm transition-all flex items-center justify-center gap-1.5 border border-surface-container-highest"
                  >
                    <Icon name="cancel" className="text-base" /> PASS / DECLINE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section aria-label="Today's collection summary">
        <h2 className="font-title-md text-title-md text-primary font-bold mb-3">Today's Collection</h2>
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Pickups" value={todayPickups.length} icon="local_shipping" />
          <StatCard label="Distance" value={totalDistanceStr} icon="route" />
          <StatCard label="Est. Weight" value={formatWeight(estTotal)} icon="scale" />
        </div>
      </section>

      <button
        onClick={() => navigate('/collector/assigned')}
        className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-secondary-container text-primary font-bold py-4 text-base hover:bg-[#bbfb64] transition-colors shadow-lg shadow-secondary-container/40"
      >
        <Icon name="assignment" className="text-xl" />
        View Assigned Pickups ({todayPickups.length})
        <Icon name="chevron_right" className="text-xl" />
      </button>

      {/* OPEN NEARBY PICKUPS POOL */}
      {openPoolPickups.length > 0 && (
        <section aria-label="Open pool pickups">
          <h2 className="font-title-md text-title-md text-primary font-bold mb-3 flex items-center gap-2">
            <Icon name="explore" className="text-secondary" /> HomePage Queries ({openPoolPickups.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {openPoolPickups.map((p) => (
              <div key={p.id} className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-4 flex flex-col gap-2 hover:border-secondary transition-all">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-primary text-sm">{p.pickup_id || `#${p.id}`}</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-xs font-bold text-on-surface-variant">UNASSIGNED POOL</span>
                </div>
                <p className="text-xs text-on-surface-variant">{p.address}</p>
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-surface-container-high">
                  <span className="text-xs font-bold text-primary">📦 {p.waste_type} • {p.estimated_quantity || 'Standard'}</span>
                  <button
                    onClick={() => handleClaim(p.id)}
                    className="px-4 py-1.5 rounded-lg bg-secondary-container text-primary font-bold text-xs hover:bg-[#bbfb64] transition-colors shadow-sm"
                  >
                    CLAIM PICKUP
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
