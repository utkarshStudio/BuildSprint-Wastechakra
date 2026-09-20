import { useEffect, useState } from 'react';
import { businessApi } from '../../services/businessApi';
import { StatCard, Card, Button, StatusBadge, Skeleton, EmptyState, ErrorState, Modal } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

const EMPTY_FORM = {
  waste_type: 'MIXED',
  estimated_quantity: '20-50',
  pickup_date: '',
  time_slot: 'Morning (9-12)',
  address: '',
  instructions: '',
  frequency: 'weekly',
};

export default function Pickups() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('oneTime');
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successId, setSuccessId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadPickups = async () => {
    try {
      const data = await businessApi.getPickups();
      const list = Array.isArray(data) ? data : data?.results || [];
      setPickups(list);
    } catch (e) {
      setError(e.message || 'Failed to load business pickups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPickups();
  }, []);

  const openModal = (mode) => {
    setModalMode(mode);
    setForm(EMPTY_FORM);
    setSubmitError('');
    setModalOpen(true);
  };

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async () => {
    if (!form.pickup_date) {
      setSubmitError('Please select a pickup date.');
      return;
    }
    if (!form.address.trim()) {
      setSubmitError('Please enter the pickup facility address.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    const payload = {
      pickup_type: 'BUSINESS',
      waste_type: form.waste_type,
      estimated_quantity: form.estimated_quantity,
      pickup_date: form.pickup_date,
      time_slot: form.time_slot,
      address: form.address,
      instructions: modalMode === 'recurring' ? `[Recurring: ${form.frequency}] ${form.instructions}` : form.instructions,
    };

    try {
      const res = await businessApi.createBulkPickup(payload);
      setSuccessId(res?.pickup_id || res?.id || 'Confirmed');
      setSuccessMessage(`Bulk pickup ${res?.pickup_id || ''} confirmed and added to collection dispatch queue.`);
      setModalOpen(false);
      await loadPickups();
    } catch (err) {
      setSubmitError(err.message || 'Failed to schedule pickup with server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="grid grid-cols-2 gap-3">{[0, 1].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
        <div className="flex flex-col gap-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      </div>
    );
  }

  if (error && pickups.length === 0) {
    return <ErrorState title="Couldn't load pickups" message={error} onRetry={loadPickups} />;
  }

  const active = pickups.filter((p) => !['COMPLETED', 'CANCELLED'].includes(p.status));
  const completed = pickups.filter((p) => p.status === 'COMPLETED');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline-md text-headline-md text-primary font-bold">Pickup Scheduling</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">Schedule and manage your commercial bulk waste dispatches</p>
      </div>

      {successMessage && (
        <Card className="bg-secondary-container/30 border-secondary flex items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <Icon name="check_circle" className="text-secondary text-2xl" />
            <div>
              <p className="font-bold text-primary">{successMessage}</p>
              {successId && <p className="text-xs text-on-surface-variant">Tracking Reference: {successId}</p>}
            </div>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-xs font-bold text-primary hover:underline">
            Dismiss
          </button>
        </Card>
      )}

      <section aria-label="Pickup summary">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard label="Active Dispatches" value={active.length} icon="local_shipping" />
          <StatCard label="Completed Pickups" value={completed.length} icon="task_alt" tone="dark" />
          <StatCard label="Total Requests" value={pickups.length} icon="inventory_2" tone="accented" />
        </div>
      </section>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="primary" size="lg" className="flex-1" onClick={() => openModal('oneTime')}>
          <Icon name="add" className="" /> Schedule Bulk Pickup
        </Button>
        <Button variant="outline" size="lg" className="flex-1" onClick={() => openModal('recurring')}>
          <Icon name="event_repeat" className="" /> Set Recurring Schedule
        </Button>
      </div>

      <section aria-label="Your pickups">
        <h2 className="font-title-md text-title-md text-primary font-bold mb-3">Your Pickup History & Queue</h2>
        {pickups.length === 0 ? (
          <Card>
            <EmptyState
              title="No commercial pickups scheduled"
              message="Schedule a bulk waste collection cycle for your enterprise or facility."
              icon="local_shipping"
              action={
                <Button variant="primary" onClick={() => openModal('oneTime')}>
                  <Icon name="add" className="" /> Schedule First Pickup
                </Button>
              }
            />
          </Card>
        ) : (
          <ul className="flex flex-col gap-3">
            {pickups.map((p) => (
              <li key={p.id}>
                <Card className="flex items-center gap-4 p-4 hover:border-secondary/60 transition-colors">
                  <span className="w-11 h-11 rounded-2xl bg-secondary-container/40 text-primary flex items-center justify-center shrink-0">
                    <Icon name="delete" className="text-xl" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-label-md text-label-md text-primary font-bold">{p.pickup_id || `#${p.id}`}</span>
                      <StatusBadge status={p.status} />
                    </div>
                    <p className="text-sm font-medium text-primary mt-1 truncate">{p.address || 'Facility address'}</p>
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-0.5 flex-wrap">
                      <span>Stream: <strong>{p.waste_type}</strong></span>
                      <span>Date: <strong>{p.pickup_date || '—'}</strong> ({p.time_slot || 'Standard'})</span>
                      {p.actual_weight_kg ? (
                        <span className="text-secondary font-bold">Verified: {p.actual_weight_kg} kg</span>
                      ) : (
                        <span>Est: {p.estimated_quantity ? (p.estimated_quantity.toLowerCase().includes('kg') ? p.estimated_quantity : `${p.estimated_quantity} kg`) : 'Standard'}</span>
                      )}
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Schedule Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalMode === 'recurring' ? 'Set Recurring Bulk Pickup' : 'Schedule Bulk Pickup'}
      >
        <div className="flex flex-col gap-4">
          {submitError && (
            <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-bold flex items-center gap-2">
              <Icon name="warning" className="text-base shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {modalMode === 'recurring' && (
            <div>
              <label className="text-xs font-bold text-primary block mb-1 uppercase tracking-wider">Pickup Frequency</label>
              <select
                value={form.frequency}
                onChange={(e) => set('frequency', e.target.value)}
                className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-3.5 py-2.5 text-sm outline-none focus:border-secondary"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly (Recommended)</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-primary block mb-1 uppercase tracking-wider">Waste Category Stream</label>
            <select
              value={form.waste_type}
              onChange={(e) => set('waste_type', e.target.value)}
              className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-3.5 py-2.5 text-sm outline-none focus:border-secondary"
            >
              <option value="MIXED">Mixed Commercial Waste</option>
              <option value="PLASTIC">Plastic Packaging Scrap</option>
              <option value="PAPER">Paper & Cardboard Bulk</option>
              <option value="METAL">Industrial Metal Scrap</option>
              <option value="E_WASTE">E-Waste & IT Equipment</option>
              <option value="ORGANIC">Cafeteria / Food Organics</option>
              <option value="BULK">Bulky Debris & Wood</option>
              <option value="HAZARDOUS">Regulated / Chemical Waste</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-primary block mb-1 uppercase tracking-wider">Est. Batch Volume</label>
              <select
                value={form.estimated_quantity}
                onChange={(e) => set('estimated_quantity', e.target.value)}
                className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-3.5 py-2.5 text-sm outline-none focus:border-secondary"
              >
                <option value="5-20">5 - 20 kg</option>
                <option value="20-50">20 - 50 kg</option>
                <option value="50-100">50 - 100 kg (Commercial)</option>
                <option value="100+">100+ kg (Industrial Bulk)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-primary block mb-1 uppercase tracking-wider">Pickup Date</label>
              <input
                type="date"
                value={form.pickup_date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => set('pickup_date', e.target.value)}
                className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-3.5 py-2 text-sm outline-none focus:border-secondary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-primary block mb-1 uppercase tracking-wider">Preferred Time Window</label>
            <select
              value={form.time_slot}
              onChange={(e) => set('time_slot', e.target.value)}
              className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-3.5 py-2.5 text-sm outline-none focus:border-secondary"
            >
              <option value="Morning (9-12)">Morning (9:00 AM – 12:00 PM)</option>
              <option value="Afternoon (12-3)">Afternoon (12:00 PM – 3:00 PM)</option>
              <option value="Evening (3-6)">Evening (3:00 PM – 6:00 PM)</option>
              <option value="Night (Off-Peak)">Night Shift (Off-Peak Fleet Dispatch)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-primary block mb-1 uppercase tracking-wider">Facility / Loading Dock Address</label>
            <textarea
              rows={2}
              value={form.address}
              placeholder="Building name, dock / gate number, street address..."
              onChange={(e) => set('address', e.target.value)}
              className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-3.5 py-2.5 text-sm outline-none focus:border-secondary"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-primary block mb-1 uppercase tracking-wider">Gate Instructions & Security Notes (Optional)</label>
            <input
              type="text"
              value={form.instructions}
              placeholder="e.g. Weighbridge access at Gate 2, driver ID check required"
              onChange={(e) => set('instructions', e.target.value)}
              className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-3.5 py-2.5 text-sm outline-none focus:border-secondary"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" className="flex-1" loading={submitting} onClick={submit}>
              Confirm Schedule
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
