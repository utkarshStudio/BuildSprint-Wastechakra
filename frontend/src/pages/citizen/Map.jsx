import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Skeleton } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

const DEMO_MARKERS = [
  { id: 1, label: 'Plastic Dump', distance: '250m', type: 'reported', x: 28, y: 32 },
  { id: 2, label: 'E-Waste Collection', distance: '800m', type: 'assigned', x: 62, y: 24 },
  { id: 3, label: 'Community Cleanup', distance: '1.2km', type: 'completed', x: 45, y: 55 },
  { id: 4, label: 'Recycling Point', distance: '1.8km', type: 'facility', x: 72, y: 65 },
  { id: 5, label: 'Mixed Waste', distance: '350m', type: 'urgent', x: 18, y: 60 },
  { id: 6, label: 'Paper Collection', distance: '500m', type: 'reported', x: 55, y: 40 },
];

const MARKER_COLORS = {
  urgent: 'bg-red-500',
  reported: 'bg-yellow-400',
  assigned: 'bg-blue-500',
  completed: 'bg-green-500',
  facility: 'bg-purple-500',
  recycling: 'bg-emerald-500',
};

const LEGEND_ITEMS = [
  { emoji: '🔴', label: 'Urgent' },
  { emoji: '🟡', label: 'Reported' },
  { emoji: '🔵', label: 'Pickup Assigned' },
  { emoji: '🟢', label: 'Completed' },
  { emoji: '🏭', label: 'Facility' },
  { emoji: '♻️', label: 'Recycling Point' },
];

export default function CitizenMap() {
  const [showLocationBanner, setShowLocationBanner] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState(null);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline-md text-headline-md text-primary font-bold">WasteChakra Map</h1>

      {showLocationBanner && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <Icon name="location_off" className="text-amber-600" />
          <div className="flex-1">
            <p className="font-body-md text-body-md text-amber-800">We couldn't access your location.</p>
            <p className="text-sm text-amber-600">You can select your location manually.</p>
          </div>
          <button
            onClick={() => setShowLocationBanner(false)}
            className="text-amber-600 hover:text-amber-800 p-1"
            aria-label="Dismiss location banner"
          >
            <Icon name="close" className="text-xl" />
          </button>
        </div>
      )}

      <Card className="p-0 overflow-hidden">
        <div className="relative w-full aspect-[3/1] bg-gradient-to-br from-green-100 via-emerald-50 to-green-200">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, #86efac 39px, #86efac 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, #86efac 39px, #86efac 40px)',
            }}
          />
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 9px, #166534 9px, #166534 10px), repeating-linear-gradient(90deg, transparent, transparent 9px, #166534 9px, #166534 10px)',
            }}
          />

          {DEMO_MARKERS.map((marker) => (
            <button
              key={marker.id}
              className="absolute group"
              style={{ left: `${marker.x}%`, top: `${marker.y}%`, transform: 'translate(-50%, -50%)' }}
              onClick={() => setSelectedMarker(selectedMarker === marker.id ? null : marker.id)}
              aria-label={marker.label}
            >
              <span className={`block w-4 h-4 rounded-full ${MARKER_COLORS[marker.type]} border-2 border-white shadow-lg ring-2 ring-white/50`} />
              {selectedMarker === marker.id && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-surface rounded-lg shadow-xl px-3 py-2 whitespace-nowrap z-10">
                  <p className="font-body-md text-body-md text-on-surface font-bold">{marker.label}</p>
                  <p className="text-xs text-on-surface-variant">{marker.distance}</p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-surface" />
                </div>
              )}
            </button>
          ))}

          <div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur-sm rounded-xl p-3 shadow-md">
            <div className="flex flex-col gap-1.5">
              {LEGEND_ITEMS.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-xs">
                  <span>{item.emoji}</span>
                  <span className="text-on-surface-variant">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <h2 className="font-headline-md text-headline-md text-primary font-bold">Waste Around You</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {DEMO_MARKERS.map((marker) => (
          <Card key={marker.id} className="p-4">
            <Link to="/app/report" className="flex items-center gap-3" aria-label={`Report ${marker.label}`}>
              <span className={`w-3 h-3 rounded-full shrink-0 ${MARKER_COLORS[marker.type]}`} />
              <div className="flex-1 min-w-0">
                <p className="font-body-md text-body-md text-on-surface-variant font-bold">{marker.label}</p>
                <p className="text-xs text-on-surface-variant">{marker.distance} away</p>
              </div>
              <Icon name="chevron_right" className="text-on-surface-variant" />
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
