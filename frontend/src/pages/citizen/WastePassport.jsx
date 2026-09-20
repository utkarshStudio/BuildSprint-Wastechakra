import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataProvider } from '../../services/dataProvider';
import { Card, ProgressBar, Skeleton, ErrorState, formatDate } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

export default function WastePassport() {
  const { id } = useParams();
  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPassport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataProvider.getPassport(id);
      setPassport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPassport(); }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-56" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error || !passport) {
    return <ErrorState message={error || 'Passport not found'} onRetry={fetchPassport} />;
  }

  const materials = [
    { label: 'Plastic', kg: passport.plastic_recovered_kg, color: 'bg-primary' },
    { label: 'Paper', kg: passport.paper_recovered_kg, color: 'bg-secondary' },
    { label: 'Organic', kg: passport.organic_recovered_kg, color: 'bg-forest' },
    { label: 'Metal', kg: passport.metal_recovered_kg, color: 'bg-[#dbeafe]' },
    { label: 'RDF', kg: passport.rdf_produced_kg, color: 'bg-[#fef3c7]' },
    { label: 'Inert', kg: passport.inert_kg, color: 'bg-surface-container-high' },
    { label: 'Residual', kg: passport.residual_kg, color: 'bg-on-surface-variant' },
  ];

  const maxKg = passport.input_weight_kg || materials.reduce((acc, m) => acc + m.kg, 1);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link to="/app/waste" className="text-sm font-bold text-primary flex items-center gap-1 mb-2">
          <Icon name="arrow_back" className="text-base" /> Back to My Waste
        </Link>
        <h1 className="font-headline-md text-headline-md text-primary font-bold">Waste Passport</h1>
      </div>

      <div className="border-4 border-primary rounded-2xl p-6 bg-surface-container-lowest">
        <div className="flex flex-col items-center text-center gap-2 mb-5">
          <Icon name="badge" className="text-5xl text-primary" />
          <h2 className="font-headline-md text-headline-md text-primary font-bold tracking-widest">WASTE PASSPORT</h2>
          <div className="bg-surface-container-high rounded-lg px-4 py-1">
            <span className="font-body-md text-on-surface-variant font-bold">ID: {passport.passport_id || passport.id || 'WC-28491'}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Origin</span>
            <span className="font-bold text-on-surface">{passport.origin}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Pickup</span>
            <span className="font-bold text-on-surface">{passport.pickup}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Collected date</span>
            <span className="font-bold text-on-surface">{formatDate(passport.created_at)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Input Weight</span>
            <span className="font-bold text-on-surface">{passport.input_weight_kg} kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Processing Status</span>
            <span className="font-bold text-primary">{passport.processing_status}</span>
          </div>
        </div>
      </div>

      <Card>
        <h2 className="font-headline-md text-headline-md text-primary font-bold mb-4">Recovery Breakdown</h2>
        <div className="flex flex-col gap-3">
          {materials.map((m) => (
            <div key={m.label} className="flex items-center gap-3">
              <span className="text-sm font-bold text-on-surface-variant w-16 shrink-0">{m.label}</span>
              <div className="flex-1">
                <ProgressBar value={(m.kg / maxKg) * 100} color={m.color} />
              </div>
              <span className="text-sm font-bold text-on-surface w-12 text-right">{m.kg} kg</span>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-secondary-container/30 rounded-xl p-5 text-center">
          <p className="text-sm text-on-surface-variant mb-1">Recovery Rate</p>
          <p className="font-stat-counter text-4xl font-extrabold text-primary">{passport.recovery_rate || 0}%</p>
        </div>
      </Card>

      <Link to={`/app/waste/${id}`}>
        <div className="inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-full bg-secondary-container text-primary font-bold">
          <Icon name="route" className="text-lg" /> View Processing Journey
        </div>
      </Link>
    </div>
  );
}
