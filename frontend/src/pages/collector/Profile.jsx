import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/authApi';
import { Card, Avatar, Button } from '../../components/ui';
import { Icon } from '../../components/AppIcons';
import LocationPicker from '../../components/LocationPicker';

export default function Profile() {
  const { user, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(user?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    vehicle_number: user?.collector_profile?.vehicle_number || user?.profile?.vehicle_number || user?.vehicle_number || '',
    vehicle_type: user?.collector_profile?.vehicle_type || user?.profile?.vehicle_type || user?.vehicle_type || 'VAN',
    phone: user?.collector_profile?.phone || user?.profile?.phone || user?.phone || '',
    address_line1: user?.collector_profile?.address_line1 || user?.profile?.address_line1 || '',
    address_line2: user?.collector_profile?.address_line2 || user?.profile?.address_line2 || '',
    city: user?.collector_profile?.city || user?.profile?.city || user?.city || '',
    state: user?.collector_profile?.state || user?.profile?.state || '',
    pincode: user?.collector_profile?.pincode || user?.profile?.pincode || '',
    address: user?.profile?.address || user?.address || '',
    latitude: user?.collector_profile?.current_lat || null,
    longitude: user?.collector_profile?.current_lng || null,
  });

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  useEffect(() => {
    if (user) {
      setIsActive(user.collector_profile?.is_active ?? user.is_active ?? true);
      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        vehicle_number: user.collector_profile?.vehicle_number || user.profile?.vehicle_number || user.vehicle_number || '',
        vehicle_type: user.collector_profile?.vehicle_type || user.profile?.vehicle_type || user.vehicle_type || 'VAN',
        phone: user.collector_profile?.phone || user.profile?.phone || user.phone || '',
        address_line1: user.collector_profile?.address_line1 || user.profile?.address_line1 || '',
        address_line2: user.collector_profile?.address_line2 || user.profile?.address_line2 || '',
        city: user.collector_profile?.city || user.profile?.city || user.city || '',
        state: user.collector_profile?.state || user.profile?.state || '',
        pincode: user.collector_profile?.pincode || user.profile?.pincode || '',
        address: user.profile?.address || user.address || '',
        latitude: user.collector_profile?.current_lat || null,
        longitude: user.collector_profile?.current_lng || null,
      });
    }
  }, [user]);

  const fullName = `${form.first_name || user?.first_name || ''} ${form.last_name || user?.last_name || ''}`.trim() || user?.email || 'Collector';
  const vehicleNumber = form.vehicle_number || user?.collector_profile?.vehicle_number || 'KA 01 AB 1234';
  const vehicleType = form.vehicle_type || user?.collector_profile?.vehicle_type || 'VAN';
  const contact = form.phone || user?.profile?.phone || '+91 98765 43210';

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await authApi.updateProfile({
        first_name: form.first_name,
        last_name: form.last_name,
        vehicle_number: form.vehicle_number,
        vehicle_type: form.vehicle_type,
        phone: form.phone,
        address: form.address,
        address_line1: form.address_line1,
        address_line2: form.address_line2,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        current_lat: form.latitude ? parseFloat(form.latitude) : null,
        current_lng: form.longitude ? parseFloat(form.longitude) : null,
        is_active: isActive,
      });
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err.message || "Failed to update profile in database.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (val) => {
    setIsActive(val);
    try {
      await authApi.updateProfile({ is_active: val });
    } catch {
      // fallback: keep local state
    }
  };

  const handleMapLocationChange = (loc) => {
    const addr = loc.address || '';
    let line1 = form.address_line1;
    let line2 = form.address_line2;
    let city = form.city;
    let state = form.state;
    let pincode = form.pincode;

    if (loc.details) {
      const d = loc.details;
      const l1Parts = [d.house_number, d.building, d.road || d.street].filter(Boolean);
      line1 = l1Parts.length > 0 ? l1Parts.join(', ') : (addr.split(',')[0] || '');

      const l2Parts = [d.suburb || d.neighbourhood, d.residential || d.quarter || d.city_district].filter(Boolean);
      line2 = l2Parts.length > 0 ? l2Parts.join(', ') : (addr.split(',')[1] || '');

      city = d.city || d.town || d.village || d.municipality || d.county || d.state_district || city;
      state = d.state || d.province || d.region || state;
      pincode = d.postcode || pincode;
    } else if (addr) {
      const parts = addr.split(',').map((p) => p.trim()).filter(Boolean);
      if (parts.length >= 1) line1 = parts[0];
      if (parts.length >= 2) line2 = parts[1];

      const pinMatch = addr.match(/\b\d{6}\b/);
      if (pinMatch) pincode = pinMatch[0];

      if (parts.length >= 3) {
        const potentialCity = parts[parts.length - 3].replace(/\b\d{6}\b/g, '').trim();
        if (potentialCity) city = potentialCity;
      }
      if (parts.length >= 2) {
        const potentialState = parts[parts.length - 2].replace(/\b\d{6}\b/g, '').trim();
        if (potentialState) state = potentialState;
      }
    }

    setForm((prev) => ({
      ...prev,
      latitude: loc.lat ?? prev.latitude,
      longitude: loc.lng ?? prev.longitude,
      address: addr,
      address_line1: line1 || prev.address_line1,
      address_line2: line2 || prev.address_line2,
      city: city || prev.city,
      state: state || prev.state,
      pincode: pincode || prev.pincode,
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Header Hero Card */}
      <Card className="p-0 overflow-hidden relative border border-surface-container-high bg-surface-container-lowest rounded-xl technical-shadow">
        {/* Decorative Top Accent Banner */}
        <div className="h-28 md:h-36 w-full bg-linear-to-r from-forest via-[#0a3a2a] to-[#00180b] relative overflow-hidden flex items-start justify-between p-4 md:p-6">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#abf854_1px,transparent_1px)] bg-size-[16px_16px]" />
          <div className="relative z-10 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-surface-bright text-xs font-semibold border border-white/15">
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-secondary-container animate-pulse shadow-[0_0_6px_#abf854]' : 'bg-slate-400'}`} />
              <span>{isActive ? 'Active Shift' : 'Off-Duty'}</span>
            </span>
          </div>
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-secondary-container text-primary uppercase tracking-wider shadow-sm">
              <Icon name="local_shipping" className="text-xs" />
              <span>COLLECTOR</span>
            </span>
          </div>
        </div>

        {/* Card Body with Overlapping Avatar */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left: Avatar + Details */}
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="-mt-12 md:-mt-14 w-24 h-24 rounded-full bg-forest text-secondary-fixed ring-4 ring-surface-container-lowest flex items-center justify-center text-3xl font-extrabold shadow-xl shrink-0 z-10">
                {fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || 'CO'}
              </div>
              <div className="flex flex-col gap-1 pt-1 sm:pt-3">
                <h1 className="font-headline-md text-2xl md:text-3xl text-primary font-bold tracking-tight">
                  {fullName}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-on-surface-variant">
                  <span className="flex items-center gap-1.5">
                    <Icon name="mail" className="text-xs text-secondary" />
                    <span>{user?.email || 'collector@wastechakra.com'}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="phone" className="text-xs text-secondary" />
                    <span>{contact}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Status & Vehicle Ribbon */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 bg-surface-container-low px-4 sm:px-5 py-3 rounded-2xl border border-surface-container-high/60 shadow-2xs mt-2 md:mt-3">
              <div className="text-center px-3 border-r border-surface-container-high/60">
                <p className="font-headline-md text-sm sm:text-base font-extrabold text-primary flex items-center justify-center gap-1">
                  <Icon name="directions_car" className="text-secondary text-base" />
                  <span>{vehicleNumber}</span>
                </p>
                <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">{vehicleType}</p>
              </div>
              <button
                onClick={() => toggleActive(!isActive)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-2xs ${
                  isActive ? 'bg-secondary-container text-primary hover:bg-[#bbfb64]' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#0a3a2a] animate-pulse' : 'bg-on-surface-variant'}`} />
                <span>{isActive ? 'Online' : 'Go Online'}</span>
              </button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 md:p-8 w-full flex flex-col gap-8 border border-surface-container-high bg-surface-container-lowest rounded-xl technical-shadow">
        {saved && (
          <div className="bg-secondary-container/40 rounded-xl p-4 text-primary text-sm font-bold flex items-center gap-2.5 border border-secondary-container animate-fade-in">
            <Icon name="check_circle" className="text-xl text-forest" /> Profile and Depot location saved successfully!
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 text-red-700 rounded-xl p-4 text-sm font-bold flex items-center gap-2.5 border border-red-200 animate-fade-in">
            <Icon name="error" className="text-xl" /> {error}
          </div>
        )}

        {/* SECTION 1: Personal & Vehicle Information */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3 border-b border-surface-container-high pb-3">
            <div className="p-2 rounded-xl bg-forest text-secondary-container shadow-xs">
              <Icon name="badge" className="text-xl" />
            </div>
            <div>
              <h2 className="font-headline-md text-xl md:text-2xl text-primary font-bold">
                Personal & Vehicle Information
              </h2>
              <p className="text-xs text-on-surface-variant">Update your driver credentials & vehicle details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-2">First Name</label>
              <input
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-4 py-3 font-body-md text-sm text-on-surface focus:outline-none focus:border-secondary focus:bg-surface transition-all"
                placeholder="First Name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-2">Last Name</label>
              <input
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-4 py-3 font-body-md text-sm text-on-surface focus:outline-none focus:border-secondary focus:bg-surface transition-all"
                placeholder="Last Name"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-2">Phone / Contact Number</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-4 py-3 font-body-md text-sm text-on-surface focus:outline-none focus:border-secondary focus:bg-surface transition-all"
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-2">Vehicle Number</label>
              <input
                value={form.vehicle_number}
                onChange={(e) => setForm({ ...form, vehicle_number: e.target.value.toUpperCase() })}
                className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-4 py-3 font-body-md text-sm text-on-surface focus:outline-none focus:border-secondary focus:bg-surface transition-all font-mono uppercase tracking-wider"
                placeholder="KA 01 AB 1234"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-2">Vehicle Type</label>
              <select
                value={form.vehicle_type}
                onChange={(e) => setForm({ ...form, vehicle_type: e.target.value })}
                className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-4 py-3 font-body-md text-sm text-on-surface focus:outline-none focus:border-secondary focus:bg-surface transition-all font-medium"
              >
                <option value="AUTO">Electric Auto Rickshaw</option>
                <option value="VAN">Collection Van</option>
                <option value="TRUCK">Heavy Utility Truck</option>
                <option value="BIKE">Cargo Bike</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: Service Depot & Base Location */}
        <div className="flex flex-col gap-5 pt-4 border-t border-surface-container-high/60">
          <div className="flex items-center gap-3 border-b border-surface-container-high pb-3">
            <div className="p-2 rounded-xl bg-forest text-secondary-container shadow-xs">
              <Icon name="location_on" className="text-xl" />
            </div>
            <div>
              <h2 className="font-headline-md text-xl md:text-2xl text-primary font-bold">
                Service Depot & Base Location
              </h2>
              <p className="text-xs text-on-surface-variant">Pin your operational base depot on the map for route auto-assignment</p>
            </div>
          </div>

          {/* Pin the Location Interactive Map Unit */}
          <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-4 shadow-xs flex flex-col gap-4">
            <div className="text-center">
              <h3 className="text-xl text-primary font-extrabold mb-1">Pin the Location</h3>
              <p className="text-xs text-on-surface-variant">Drag the map or use your live location to mark your depot spot.</p>
            </div>

            <div className="relative z-0">
              <LocationPicker
                value={{ address: form.address || form.address_line1, lat: form.latitude, lng: form.longitude }}
                onChange={handleMapLocationChange}
                height={260}
                showAddress={true}
                addressLabel="Depot Base Address"
              />
            </div>
          </div>

          {/* Additional Address Details */}
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-primary uppercase tracking-wider">Additional Address Details</h3>
              <button
                type="button"
                onClick={() => handleMapLocationChange({ lat: form.latitude, lng: form.longitude, address: form.address })}
                className="text-xs font-bold text-forest hover:text-primary flex items-center gap-1 bg-secondary-container/40 px-2.5 py-1 rounded-lg border border-secondary-container cursor-pointer transition-colors"
              >
                <Icon name="autorenew" className="text-xs" /> Sync from Depot Address
              </button>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-2">Address Line 1 (Flat/House No., Building, Street)</label>
              <input
                value={form.address_line1}
                onChange={(e) => setForm({ ...form, address_line1: e.target.value })}
                className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-4 py-3 font-body-md text-sm text-on-surface focus:outline-none focus:border-secondary focus:bg-surface transition-all"
                placeholder="Plot 42, Green Park Main Road"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-2">Address Line 2 (Area, Colony, Landmark)</label>
              <input
                value={form.address_line2}
                onChange={(e) => setForm({ ...form, address_line2: e.target.value })}
                className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-4 py-3 font-body-md text-sm text-on-surface focus:outline-none focus:border-secondary focus:bg-surface transition-all"
                placeholder="Near Waste Recycling Depot #3"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-2">City</label>
                <input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-4 py-3 font-body-md text-sm text-on-surface focus:outline-none focus:border-secondary focus:bg-surface transition-all"
                  placeholder="Bengaluru"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-2">State</label>
                <input
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-4 py-3 font-body-md text-sm text-on-surface focus:outline-none focus:border-secondary focus:bg-surface transition-all"
                  placeholder="Karnataka"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-2">Pincode</label>
                <input
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-4 py-3 font-body-md text-sm text-on-surface focus:outline-none focus:border-secondary focus:bg-surface transition-all"
                  placeholder="560001"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Action Button */}
        <div className="pt-2 border-t border-surface-container-high/60">
          <Button variant="primary" size="lg" loading={saving} onClick={save} className="w-full text-base font-bold shadow-md">
            <Icon name="save" className="text-lg" /> {saving ? 'Saving Profile & Depot Settings...' : 'Save Profile & Depot Settings'}
          </Button>
        </div>

        {/* Collector Availability & Sign Out */}
        <div className="pt-2 border-t border-surface-container-high/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <label className="flex-1 flex items-center justify-between gap-3 p-4 rounded-2xl border border-surface-container-high/60 bg-surface-container-lowest hover:border-secondary/50 hover:bg-surface transition-colors cursor-pointer group w-full">
            <div>
              <p className="font-body-md text-primary font-bold group-hover:text-[#0a3a2a] transition-colors">Accepting Pickups</p>
              <p className="text-xs text-on-surface-variant mt-0.5">Toggle online shift status for pickup assignments</p>
            </div>
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => toggleActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-secondary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A8E05A]"></div>
            </div>
          </label>

          <Button variant="danger" size="lg" onClick={() => { logout(); navigate('/'); }} className="w-full md:w-auto px-6">
            <Icon name="logout" className="text-lg" /> Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
}
