import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { collectorApi } from '../../services/collectorApi';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, StatusBadge, Skeleton, ErrorState, formatWeight } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

function mapsUrl(p) {
  if (p.latitude && p.longitude) {
    return `https://maps.google.com/?q=${p.latitude},${p.longitude}`;
  }
  return `https://maps.google.com/?q=${encodeURIComponent(p.address || 'India')}`;
}

function customerName(email) {
  if (!email) return 'Customer';
  return email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function PickupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pickup, setPickup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [proofOpen, setProofOpen] = useState(false);
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [weight, setWeight] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await collectorApi.getPickupDetail(id);
        if (!mounted) return;
        setPickup(data);
        if (data.status === 'COLLECTED' || data.status === 'COMPLETED') {
          setCompleted(true);
        }
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load pickup detail');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const confirmCollection = async () => {
    setConfirming(true);
    try {
      if (beforeFile || afterFile) {
        const formData = new FormData();
        formData.append('status', 'COLLECTED');
        if (weight) formData.append('actual_weight_kg', weight);
        if (notes) formData.append('collector_notes', notes);
        if (beforeFile) formData.append('before_image', beforeFile);
        if (afterFile) formData.append('after_image', afterFile);
        await collectorApi.uploadPickupProof(pickup.id, formData);
      } else {
        await collectorApi.updatePickupStatus(pickup.id, {
          status: 'COLLECTED',
          actual_weight_kg: Number(weight) || null,
          collector_notes: notes,
        });
      }
    } catch (err) {
      console.error('Failed to confirm collection:', err);
    }
    setPickup((prev) => ({ ...prev, status: 'COLLECTED', actual_weight_kg: Number(weight) || null }));
    setProofOpen(false);
    setCompleted(true);
    setConfirming(false);
  };

  const startPickup = async () => {
    try {
      await collectorApi.updatePickupStatus(pickup.id, { status: 'EN_ROUTE' });
    } catch (err) {
      console.error('Failed to update status to EN_ROUTE:', err);
    }
    setPickup((prev) => ({ ...prev, status: 'EN_ROUTE' }));
    setProofOpen(true);
    navigate('/collector/routes');
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (error && !pickup) {
    return <ErrorState title="Couldn't load pickup" message={error} onRetry={() => window.location.reload()} />;
  }

  if (!pickup) return null;

  const canCollect = ['ASSIGNED', 'EN_ROUTE'].includes(pickup.status);
  const estNum = Number(String(pickup.estimated_quantity || '0').match(/\d+/)?.[0] || 0);
  const collectorName = user?.first_name || 'You';

  return (
    <div className="flex flex-col gap-6">
      <BackLink pickupId={pickup.pickup_id} />

      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h1 className="font-headline-md text-headline-md text-primary font-bold">#{pickup.pickup_id}</h1>
          <StatusBadge status={pickup.status} pending={['REQUESTED', 'CONFIRMED', 'ASSIGNED'].includes(pickup.status)} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container/30 text-primary text-xs font-bold">
            <Icon name="near_me" className="text-[14px]" />1.8 km away
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-on-surface-variant">
            <Icon name="delete" className="text-[16px]" />{pickup.waste_type}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-on-surface-variant">
            <Icon name="scale" className="text-[16px]" />Est. {formatWeight(estNum)}
          </span>
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <h2 className="font-title-md text-title-md text-primary font-bold">Details</h2>
        <DetailRow icon="place" label="Address" value={pickup.address} />
        <DetailRow icon="person" label="Customer" value={customerName(pickup.user_email)} />
        <DetailRow icon="schedule" label="Time slot" value={pickup.time_slot || 'Flexible'} />
        <DetailRow icon="calendar_today" label="Date" value={pickup.pickup_date} />
        {pickup.instructions && <DetailRow icon="info" label="Instructions" value={pickup.instructions} />}
      </Card>

      {completed && (
        <Card className="border-secondary bg-secondary-container/20 flex flex-col gap-3 items-center text-center">
          <span className="w-14 h-14 rounded-full bg-secondary-container text-primary flex items-center justify-center">
            <Icon name="check" className="text-3xl" />
          </span>
          <h2 className="font-title-md text-title-md text-primary font-bold">Collection Confirmed</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Collected {formatWeight(Number(weight) || estNum)} of {pickup.waste_type}. Recorded by {collectorName} on{' '}
            {new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}.
          </p>
        </Card>
      )}

      {!completed && (
        <div className="flex flex-col gap-3">
          <a
            href={mapsUrl(pickup)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary-container text-primary font-bold py-3.5 hover:bg-[#bbfb64] transition-colors"
          >
            <Icon name="map" className="" /> Navigate
          </a>
          <a
            href="tel:+910000000000"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-surface-container-highest text-primary font-bold py-3.5 hover:bg-surface-container-low transition-colors"
          >
            <Icon name="call" className="" /> Call
          </a>
          <Button variant="primary" size="lg" onClick={startPickup}>
            <Icon name="play_arrow" className="" /> Start Pickup
          </Button>
        </div>
      )}

      {canCollect && proofOpen && (
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Icon name="add_a_photo" className="text-secondary" />
            <h2 className="font-title-md text-title-md text-primary font-bold">Proof of Pickup</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FileField label="Before photo" onChange={setBeforeFile} />
            <FileField label="After photo" onChange={setAfterFile} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-xs text-primary font-bold uppercase tracking-widest ml-1">Actual weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="25"
              min="0"
              className="w-full rounded-xl border-2 border-surface-container-high bg-surface-container-lowest px-4 py-3 font-body-md text-sm outline-none focus:border-secondary transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-xs text-primary font-bold uppercase tracking-widest ml-1">Waste category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border-2 border-surface-container-high bg-surface-container-lowest px-4 py-3 font-body-md text-sm outline-none focus:border-secondary transition-all"
            >
              <option value="">Select category</option>
              <option value="MIXED">Mixed</option>
              <option value="RECYCLABLES">Recyclables</option>
              <option value="ORGANIC">Organic</option>
              <option value="E_WASTE">E-Waste</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-xs text-primary font-bold uppercase tracking-widest ml-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Optional notes about this pickup"
              className="w-full rounded-xl border-2 border-surface-container-high bg-surface-container-lowest px-4 py-3 font-body-md text-sm outline-none focus:border-secondary transition-all resize-none"
            />
          </div>
          <Button variant="primary" size="lg" loading={confirming} disabled={!weight} onClick={confirmCollection}>
            {confirming ? 'Confirming collection...' : 'Confirm Collection'}
          </Button>
        </Card>
      )}
    </div>
  );
}

function BackLink({ pickupId }) {
  return (
    <Link to="/collector" className="inline-flex items-center gap-1 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors w-fit">
      <Icon name="arrow_back" className="text-[18px]" />
      Back to {pickupId ? 'pickups' : 'dashboard'}
    </Link>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-surface-container-high last:border-0">
      <Icon name={icon} className="text-[20px] text-secondary mt-0.5" />
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{label}</span>
        <span className="font-body-md text-body-md text-primary font-medium">{value}</span>
      </div>
    </div>
  );
}

function FileField({ label, onChange }) {
  const [name, setName] = useState('');
  const [dataUrl, setDataUrl] = useState('');
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-label-sm text-xs text-primary font-bold uppercase tracking-widest ml-1">{label}</label>
      <label className="relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-surface-container-high bg-surface-container-low p-4 cursor-pointer hover:border-secondary transition-colors min-h-[110px] overflow-hidden">
        {dataUrl ? (
          <img src={dataUrl} alt={label} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <>
            <Icon name="photo_camera" className="text-3xl text-on-surface-variant" />
            <span className="text-xs font-semibold text-on-surface-variant">Tap to add</span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            onChange(f);
            setName(f.name);
            const reader = new FileReader();
            reader.onload = () => setDataUrl(reader.result);
            reader.readAsDataURL(f);
          }}
          aria-label={label}
        />
      </label>
      {name && <span className="text-[11px] text-on-surface-variant truncate">{name}</span>}
    </div>
  );
}
