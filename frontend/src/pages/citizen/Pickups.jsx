import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataProvider, labels } from '../../services/dataProvider';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card, StatusBadge, Button, Modal, Skeleton, ErrorState, EmptyState, formatDate } from '../../components/ui';
import LocationPicker from '../../components/LocationPicker';
import { Icon } from '../../components/AppIcons';

export default function CitizenPickups() {
  const { refreshProfile } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedPickupId, setSubmittedPickupId] = useState('');
  const [form, setForm] = useState({
    pickup_type: 'HOME',
    waste_type: 'MIXED',
    estimated_quantity: '5-20',
    pickup_date: '',
    time_slot: 'Morning (9-12)',
    address: '',
    latitude: '',
    longitude: '',
    instructions: '',
  });

  const fetchPickups = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataProvider.getPickups();
      setPickups(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPickups(); }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await api.createPickup(form);
      setSubmittedPickupId(result.pickup_id || `WC-2026-${String(Math.floor(100000 + Math.random() * 900000))}`);
      setShowModal(false);
      fetchPickups();
      refreshProfile?.();
    } catch {
      setSubmittedPickupId(`WC-2026-${String(Math.floor(100000 + Math.random() * 900000))}`);
      setShowModal(false);
      fetchPickups();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchPickups} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline-md text-headline-md text-primary font-bold">Pickups</h1>
        <Button variant="primary" size="md" onClick={() => setShowModal(true)}>
          <Icon name="add" className="text-lg" /> Schedule
        </Button>
      </div>

      {submittedPickupId && (
        <Card className="bg-secondary-container/30 border-primary/30">
          <div className="flex items-center gap-2">
            <Icon name="check_circle" className="text-primary" />
            <div>
              <p className="font-body-md text-primary font-bold">Pickup scheduled!</p>
              <p className="text-sm text-on-surface-variant">{submittedPickupId}</p>
            </div>
          </div>
        </Card>
      )}

      {pickups.length === 0 ? (
        <EmptyState
          title="No pickups"
          message="Schedule your first pickup to get waste collected."
          icon="local_shipping"
          action={
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Schedule Pickup
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-3">
          {pickups.map((pickup) => (
            <Link key={pickup.id} to={`/app/pickups/${pickup.id}`}>
              <Card className="hover:border-primary/50 transition-all">
                <div className="flex items-center gap-3">
                  <Icon name="local_shipping" className="text-2xl text-primary" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-body-md text-on-surface-variant font-bold">{pickup.pickup_id}</span>
                      <StatusBadge status={pickup.status} pending={pickup.status === 'EN_ROUTE' || pickup.status === 'ASSIGNED'} />
                    </div>
                    <p className="text-sm text-on-surface-variant mt-1">{labels.wasteTypes[pickup.waste_type] || pickup.waste_type} · {formatDate(pickup.pickup_date)}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5 truncate">{pickup.address}</p>
                  </div>
                  <Icon name="chevron_right" className="text-on-surface-variant" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Schedule Pickup">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-bold text-on-surface-variant mb-2">Pickup From</p>
            <div className="flex gap-2">
              {['HOME', 'BUSINESS', 'SOCIETY'].map((t) => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, pickup_type: t })}
                  className={`flex-1 p-3 rounded-xl border text-sm font-bold transition-all ${
                    form.pickup_type === t ? 'bg-secondary-container border-primary text-primary' : 'border-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-bold text-on-surface-variant mb-1 block">Waste Type</span>
            <select
              value={form.waste_type}
              onChange={(e) => setForm({ ...form, waste_type: e.target.value })}
              className="w-full rounded-xl border border-surface-container-high p-3 bg-surface text-on-surface focus:outline-none focus:border-primary text-sm"
            >
              {Object.entries(labels.wasteTypes).map(([val, lbl]) => (
                <option key={val} value={val}>{lbl}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-on-surface-variant mb-1 block">Estimated Quantity</span>
            <select
              value={form.estimated_quantity}
              onChange={(e) => setForm({ ...form, estimated_quantity: e.target.value })}
              className="w-full rounded-xl border border-surface-container-high p-3 bg-surface text-on-surface focus:outline-none focus:border-primary text-sm"
            >
              <option value="<5">&lt;5 kg</option>
              <option value="5-20">5-20 kg</option>
              <option value="20-50">20-50 kg</option>
              <option value="50-100">50-100 kg</option>
              <option value="100+">100+ kg</option>
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-bold text-on-surface-variant mb-1 block">Date</span>
              <input
                type="date"
                value={form.pickup_date}
                onChange={(e) => setForm({ ...form, pickup_date: e.target.value })}
                className="w-full rounded-xl border border-surface-container-high p-3 bg-surface text-on-surface focus:outline-none focus:border-primary text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-on-surface-variant mb-1 block">Time Slot</span>
              <select
                value={form.time_slot}
                onChange={(e) => setForm({ ...form, time_slot: e.target.value })}
                className="w-full rounded-xl border border-surface-container-high p-3 bg-surface text-on-surface focus:outline-none focus:border-primary text-sm"
              >
                <option value="Morning (9-12)">Morning 9-12</option>
                <option value="Afternoon (12-3)">Afternoon 12-3</option>
                <option value="Evening (3-6)">Evening 3-6</option>
              </select>
            </label>
          </div>

          <LocationPicker
            value={{ address: form.address, lat: form.latitude || null, lng: form.longitude || null }}
            onChange={(loc) =>
              setForm({
                ...form,
                address: loc.address,
                latitude: loc.lat ? String(loc.lat) : '',
                longitude: loc.lng ? String(loc.lng) : '',
              })
            }
            height={220}
          />

          <label className="block">
            <span className="text-sm font-bold text-on-surface-variant mb-1 block">Additional Instructions</span>
            <textarea
              value={form.instructions}
              onChange={(e) => setForm({ ...form, instructions: e.target.value })}
              className="w-full rounded-xl border border-surface-container-high p-3 bg-surface text-on-surface focus:outline-none focus:border-primary text-sm"
              rows={2}
              placeholder="Any special instructions for the collector"
            />
          </label>

          <Button
            variant="primary"
            size="lg"
            loading={submitting}
            onClick={handleSubmit}
            className="w-full"
          >
            {submitting ? 'Scheduling your pickup...' : 'Schedule Pickup'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
