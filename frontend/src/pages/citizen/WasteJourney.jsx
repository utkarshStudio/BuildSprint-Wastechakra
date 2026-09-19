import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataProvider } from '../../services/dataProvider';
import { Card, Skeleton, ErrorState, formatWeight } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

const JOURNEY_STEPS = [
  { label: 'User', icon: 'person', time: 'Now', desc: 'You submitted this waste' },
  { label: 'Reported', icon: 'add_a_photo', time: 'Day 0', desc: 'Waste report recorded' },
  { label: 'Pickup Scheduled', icon: 'event', time: 'Day 0', desc: 'Pickup slot confirmed' },
  { label: 'Collected', icon: 'delete_sweep', time: 'Day 1', desc: 'Collected by field team' },
  { label: 'Transported', icon: 'local_shipping', time: 'Day 1', desc: 'In transit to facility' },
  { label: 'Processing Facility', icon: 'factory', time: 'Day 1', desc: 'Arrived at facility' },
  { label: 'Pre-processing', icon: 'settings', time: 'Day 2', desc: 'Initial sorting & sizing' },
  { label: 'Screening', icon: 'filter_alt', time: 'Day 2', desc: 'Material screening pass' },
  { label: 'Material Separation', icon: 'category', time: 'Day 2', desc: 'Physical separation' },
  { label: 'AI Sorting', icon: 'psychology', time: 'Day 3', desc: 'Adaptive AI classification' },
  { label: 'Conditioning', icon: 'compost', time: 'Day 3', desc: 'Drying & conditioning' },
  { label: 'Resource Recovery', icon: 'recycling', time: 'Day 4', desc: 'Recovering value' },
  { label: 'Final Outputs', icon: 'check_circle', time: 'Day 5', desc: 'Ready for reuse' },
];

export default function WasteJourney() {
  const { id } = useParams();
  const [pickup, setPickup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJourney = async () => {
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

  useEffect(() => { fetchJourney(); }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-80" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchJourney} />;
  }

  const recovered = [
    { label: 'Plastic', kg: 3.2 },
    { label: 'Paper', kg: 2.1 },
    { label: 'Organic', kg: 4.4 },
    { label: 'Metal', kg: 0.8 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link to="/app/waste" className="text-sm font-bold text-primary flex items-center gap-1 mb-2">
          <Icon name="arrow_back" className="text-base" /> Back to My Waste
        </Link>
        <h1 className="font-headline-md text-headline-md text-primary font-bold">Waste Journey</h1>
        <p className="text-sm text-on-surface-variant">{pickup?.waste_type} · {pickup?.estimated_quantity} kg</p>
      </div>

      <Card>
        <div className="flex flex-col">
          {JOURNEY_STEPS.map((step, i) => (
            <div key={step.label} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 ${
                  i < 6 ? 'bg-secondary-container border-primary text-primary' :
                  i === 6 || i === 7 || i === 8 ? 'bg-[#dbeafe] border-blue-200 text-blue-700' :
                  i === 9 ? 'bg-primary border-primary text-on-primary' :
                  'bg-surface-container-high border-surface-container-highest text-on-surface-variant'
                }`}>
                  <Icon name={step.icon} className="text-base" />
                </div>
                {i < JOURNEY_STEPS.length - 1 && <div className="w-0.5 flex-1 bg-surface-container-high" />}
              </div>
              <div className="pb-8">
                <div className="flex items-center gap-2">
                  <p className="font-body-md text-body-md text-on-surface font-bold">{step.label}</p>
                  <span className="text-xs text-on-surface-variant">{step.time}</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {pickup?.actual_weight_kg && (
        <Card>
          <h2 className="font-headline-md text-headline-md text-primary font-bold mb-3">Recovery Breakdown</h2>
          <div className="grid grid-cols-2 gap-3">
            {recovered.map((item) => (
              <div key={item.label} className="bg-surface-container-high rounded-xl p-3">
                <p className="text-xs text-on-surface-variant">{item.label}</p>
                <p className="font-stat-counter text-2xl font-extrabold text-primary">{formatWeight(item.kg)}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
