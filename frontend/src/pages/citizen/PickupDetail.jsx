import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataProvider } from '../../services/dataProvider';
import { Card, Skeleton, ErrorState } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

const TIMELINE = [
  { label: 'Request Received', icon: 'check', state: 'done' },
  { label: 'Pickup Assigned', icon: 'check', state: 'done' },
  { label: 'Collector On The Way', icon: 'local_shipping', state: 'current' },
  { label: 'Waste Collected', icon: 'delete_sweep', state: 'pending' },
  { label: 'Processing', icon: 'precision_manufacturing', state: 'pending' },
  { label: 'Completed', icon: 'check_circle', state: 'pending' },
];

export default function PickupDetail() {
  const { id } = useParams();
  const [pickup, setPickup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPickup = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataProvider.getPickup(id);
      setPickup(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPickup(); }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-60" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (error || !pickup) {
    return <ErrorState message={error || 'Pickup not found'} onRetry={fetchPickup} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link to="/app/pickups" className="text-sm font-bold text-primary flex items-center gap-1 mb-2">
          <Icon name="arrow_back" className="text-base" /> Back to Pickups
        </Link>
        <h1 className="font-headline-md text-headline-md text-primary font-bold">{pickup.pickup_id}</h1>
        <p className="text-sm text-on-surface-variant">{pickup.waste_type} · {pickup.address}</p>
      </div>

      <Card>
        <div className="flex flex-col">
          {TIMELINE.map((step, i) => (
            <div key={step.label} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  step.state === 'done' ? 'bg-secondary-container text-primary' :
                  step.state === 'current' ? 'bg-primary text-on-primary' :
                  'bg-surface-container-high text-on-surface-variant'
                }`}>
                  <Icon name={step.icon} className="text-lg" />
                </div>
                {i < TIMELINE.length - 1 && (
                  <div className={`w-0.5 flex-1 ${step.state === 'done' ? 'bg-secondary' : 'bg-surface-container-high'}`} />
                )}
              </div>
              <div className={`pb-8 ${step.state === 'current' ? '' : ''}`}>
                <p className={`font-body-md text-body-md font-bold ${
                  step.state === 'current' ? 'text-primary' : step.state === 'done' ? 'text-on-surface-variant' : 'text-on-surface-variant opacity-50'
                }`}>
                  {step.label}
                </p>
                {step.state === 'current' && (
                  <p className="text-xs text-on-surface-variant mt-0.5">Ravi Kumar is heading to {pickup.address}</p>
                )}
                {step.state === 'done' && <p className="text-xs text-on-surface-variant mt-0.5">Completed</p>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-headline-md text-headline-md text-primary font-bold mb-4">Collector Details</h2>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-forest text-secondary-fixed flex items-center justify-center font-bold">
            RK
          </div>
          <div>
            <p className="font-body-md text-on-surface font-bold">Ravi Kumar</p>
            <p className="text-sm text-on-surface-variant">Waste Collector</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between bg-surface-container-lowest border border-surface-container-high rounded-lg p-3">
            <span className="text-on-surface-variant flex items-center gap-2"><Icon name="directions_car" className="text-base" /> Vehicle</span>
            <span className="font-bold text-on-surface">Van · WB-24-XX-1234</span>
          </div>
          <div className="flex items-center justify-between bg-surface-container-lowest border border-surface-container-high rounded-lg p-3">
            <span className="text-on-surface-variant flex items-center gap-2"><Icon name="schedule" className="text-base" /> ETA</span>
            <span className="font-bold text-on-surface">12-15 min</span>
          </div>
          <div className="flex items-center justify-between bg-surface-container-lowest border border-surface-container-high rounded-lg p-3">
            <span className="text-on-surface-variant flex items-center gap-2"><Icon name="location_on" className="text-base" /> Current Location</span>
            <span className="font-bold text-on-surface">2.3 km away</span>
          </div>
        </div>
        <button
          className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-secondary-container text-primary font-bold"
          aria-label={`Call Ravi Kumar`}
        >
          <Icon name="call" className="text-lg" /> Call Collector
        </button>
      </Card>

      <Card>
        <h2 className="font-headline-md text-headline-md text-primary font-bold mb-3">Route Preview</h2>
        <div className="relative h-32 bg-gradient-to-br from-green-100 to-emerald-50 rounded-xl border border-surface-container-high overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #86efac 19px, #86efac 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, #86efac 19px, #86efac 20px)',
            }}
          />
          <div className="absolute top-4 left-4 flex items-center gap-1.5">
            <Icon name="my_location" className="text-primary" />
            <span className="text-xs font-bold text-on-surface-variant">Your Location</span>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 border-t-2 border-dashed border-primary/60" />
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
            <Icon name="location_on" className="text-primary" />
            <span className="text-xs font-bold text-on-surface-variant">Destination</span>
          </div>
        </div>
        <p className="text-xs text-on-surface-variant mt-3 text-center">Collector is en route to your location</p>
      </Card>
    </div>
  );
}
