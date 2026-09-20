import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { Button } from './ui';
import { Icon } from './AppIcons';

let cachedIcon = null;
function markerIcon() {
  if (cachedIcon) return cachedIcon;
  if (!window.L) return null;
  cachedIcon = window.L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  return cachedIcon;
}

const DEFAULT_CENTER = { lat: 22.5726, lng: 88.3639 };

async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (!res.ok) return { address: '', details: null };
    const data = await res.json();
    return { address: data.display_name || '', details: data.address || null };
  } catch {
    return { address: '', details: null };
  }
}

export default function LocationPicker({ value, onChange, height = 256, showAddress = true, disableGeolocation = false, addressLabel = "Address" }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [detecting, setDetecting] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [reverseGeocoding, setReverseGeocoding] = useState(false);

  const applyLocation = async (lat, lng, opts = {}) => {
    const { reverse = true, fly = true } = opts;
    if (mapRef.current && markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      if (fly) mapRef.current.flyTo([lat, lng], Math.max(mapRef.current.getZoom(), 15));
    }
    if (reverse) {
      setReverseGeocoding(true);
      const resData = await reverseGeocode(lat, lng);
      setReverseGeocoding(false);
      onChange?.({ lat, lng, address: resData.address || value?.address || '', details: resData.details });
    } else {
      onChange?.({ lat, lng, address: value?.address || '', details: null });
    }
  };

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let map;
    try {
      const center = value?.lat && value?.lng ? [value.lat, value.lng] : [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng];
      map = L.map(containerRef.current, { zoomControl: true, attributionControl: true }).setView(center, value?.lat ? 15 : 11);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const icon = markerIcon();
      const marker = L.marker(center, { icon, draggable: true }).addTo(map);
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        applyLocation(pos.lat, pos.lng, { fly: true });
      });

      map.on('click', (e) => {
        applyLocation(e.latlng.lat, e.latlng.lng, { fly: false });
      });

      mapRef.current = map;
      markerRef.current = marker;
    } catch {
      mapRef.current = null;
    }
    return () => {
      try {
        map?.remove();
      } catch {
        /* noop */
      }
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const detectLiveLocation = () => {
    setGeoError('');
    if (!('geolocation' in navigator)) {
      setGeoError('Geolocation is not supported on this device.');
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setDetecting(false);
        await applyLocation(latitude, longitude, { fly: true });
      },
      (err) => {
        setDetecting(false);
        setGeoError(
          err.code === 1
            ? 'Location permission denied. Allow access or tap the map to set it manually.'
            : 'Could not get your location. Try again or tap the map.'
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
    );
  };

  const mapFailed = !window.L || !mapRef.current;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative z-0 overflow-hidden rounded-xl border border-surface-container-high" style={{ height }}>
        <div ref={containerRef} className="h-full w-full" />
        {reverseGeocoding && (
          <div className="absolute top-2 left-2 z-[500] flex items-center gap-1 bg-surface/90 rounded-full px-3 py-1 text-xs font-bold text-primary shadow">
            <Icon name="location_searching" className="text-sm" /> Finding address…
          </div>
        )}
        {mapFailed && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-container-low text-sm text-on-surface-variant">
            Map unavailable. Use the address field or Live Location below.
          </div>
        )}
      </div>

      {!disableGeolocation && (
        <Button
          variant="outline"
          size="md"
          onClick={detectLiveLocation}
          loading={detecting}
          disabled={mapFailed}
          className="flex-1"
        >
          <Icon name="my_location" className="text-lg" /> {detecting ? 'Detecting…' : 'Use my live location'}
        </Button>
      )}
      {geoError && <p className="text-xs text-error font-bold">{geoError}</p>}

      {showAddress && (
        <label className="block">
          <span className="font-body-md text-on-surface-variant mb-1 block">
            {value?.lat ? (
              <span className="inline-flex items-center gap-1">
                <Icon name="place" className="text-sm" />
                {reverseGeocoding ? 'Resolving address…' : addressLabel}
              </span>
            ) : (
              addressLabel
            )}
          </span>
          <textarea
            value={value?.address || ''}
            onChange={(e) => onChange?.({ ...value, address: e.target.value })}
            className="w-full rounded-xl border border-surface-container-high p-3 bg-surface text-on-surface focus:outline-none focus:border-primary"
            rows={2}
            placeholder="Enter address manually, or tap the map / Live Location to fill it"
          />
        </label>
      )}

      {(value?.lat || value?.lng) && (
        <p className="text-xs text-on-surface-variant">
          <Icon name="location_on" className="text-sm align-text-bottom" />{' '}
          {Number(value.lat).toFixed(5)}, {Number(value.lng).toFixed(5)}
        </p>
      )}
    </div>
  );
}