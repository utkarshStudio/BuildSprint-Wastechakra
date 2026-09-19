import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataProvider } from '../../services/dataProvider';
import { authApi } from '../../services/authApi';
import { Card, Button, Avatar, Skeleton, ErrorState } from '../../components/ui';
import { Icon } from '../../components/AppIcons';
import LocationPicker from '../../components/LocationPicker';

export default function CitizenProfile() {
  const { user, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [impact, setImpact] = useState(null);
  const [loadingImpact, setLoadingImpact] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.profile?.phone || user?.phone || '',
    address_line1: user?.profile?.address_line1 || '',
    address_line2: user?.profile?.address_line2 || '',
    city: user?.profile?.city || user?.city || '',
    state: user?.profile?.state || '',
    pincode: user?.profile?.pincode || '',
    address: user?.profile?.address || user?.address || '',
  });
  const [settings, setSettings] = useState({
    pickupReminders: true,
    reportAlerts: true,
    weeklySummary: false,
    promotional: false,
  });

  useEffect(() => {
    refreshProfile();
    dataProvider
      .getImpact()
      .then(setImpact)
      .finally(() => setLoadingImpact(false))
      .catch(() => setLoadingImpact(false));
  }, [refreshProfile]);

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.profile?.phone || user.phone || '',
        address_line1: user.profile?.address_line1 || '',
        address_line2: user.profile?.address_line2 || '',
        city: user.profile?.city || user.city || '',
        state: user.profile?.state || '',
        pincode: user.profile?.pincode || '',
        address: user.profile?.address || user.address || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await authApi.updateProfile(form);
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const fullName = `${form.first_name || user?.first_name || ''} ${form.last_name || user?.last_name || ''}`.trim() || user?.email || 'Citizen';

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const handleMapLocationChange = (loc) => {
    setForm((prev) => ({
      ...prev,
      address_line1: loc.address ? loc.address.split(',')[0] : prev.address_line1,
      address: loc.address || prev.address,
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
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse shadow-[0_0_6px_#abf854]" />
              <span>WasteChakra Member</span>
            </span>
          </div>
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-secondary-container text-primary uppercase tracking-wider shadow-sm">
              <Icon name="verified_user" className="text-xs" />
              <span>CITIZEN</span>
            </span>
          </div>
        </div>

        {/* Card Body with Overlapping Avatar */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left: Avatar + Details */}
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="-mt-12 md:-mt-14 w-24 h-24 rounded-full bg-forest text-secondary-fixed ring-4 ring-surface-container-lowest flex items-center justify-center text-3xl font-extrabold shadow-xl shrink-0 z-10">
                {fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || 'CD'}
              </div>
              <div className="flex flex-col gap-1 pt-1 sm:pt-3">
                <h1 className="font-headline-md text-2xl md:text-3xl text-primary font-bold tracking-tight">
                  {fullName}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-on-surface-variant">
                  <span className="flex items-center gap-1.5">
                    <Icon name="mail" className="text-xs text-secondary" />
                    <span>{user?.email || 'citizen@wastechakra.com'}</span>
                  </span>
                  {form.city && (
                    <span className="flex items-center gap-1.5">
                      <Icon name="location_on" className="text-xs text-secondary" />
                      <span>{form.city}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Stats Ribbon (cleanly on the light card surface) */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 bg-surface-container-low px-4 sm:px-5 py-3 rounded-2xl border border-surface-container-high/60 shadow-2xs mt-2 md:mt-3">
              <div className="text-center px-3 border-r border-surface-container-high/60">
                <p className="font-stat-counter text-xl sm:text-2xl font-extrabold text-primary flex items-center justify-center gap-1">
                  <Icon name="stars" className="text-secondary text-base sm:text-lg" />
                  <span>{impact?.chakra_points || user?.profile?.chakra_points || 0}</span>
                </p>
                <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">Points</p>
              </div>
              <div className="text-center px-3">
                <p className="font-stat-counter text-xl sm:text-2xl font-extrabold text-primary flex items-center justify-center gap-1">
                  <Icon name="local_fire_department" className="text-amber-500 text-base sm:text-lg" />
                  <span>{impact?.streak_days || 7}</span>
                </p>
                <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">Day Streak</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-space-md items-start">
        <Card className="p-5 md:p-6">
          <h2 className="font-headline-md text-xl md:text-2xl text-primary font-bold mb-6">Edit Profile</h2>
          {saved && (
            <div className="bg-secondary-container/40 rounded-xl p-3 mb-5 text-primary text-sm font-bold flex items-center gap-2 border border-secondary-container">
              <Icon name="check_circle" className="text-lg" /> Profile saved successfully
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-2">First Name</label>
              <input
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-4 py-3 font-body-md text-sm text-on-surface focus:outline-none focus:border-secondary focus:bg-surface focus:shadow-[0_0_0_3px_rgba(168,224,90,0.1)] transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-2">Last Name</label>
              <input
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-4 py-3 font-body-md text-sm text-on-surface focus:outline-none focus:border-secondary focus:bg-surface focus:shadow-[0_0_0_3px_rgba(168,224,90,0.1)] transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-2">Phone Number</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-4 py-3 font-body-md text-sm text-on-surface focus:outline-none focus:border-secondary focus:bg-surface focus:shadow-[0_0_0_3px_rgba(168,224,90,0.1)] transition-all"
            />
          </div>

          <div className="pt-2 pb-2 border-t border-surface-container-high my-2 flex flex-col gap-4">
            <h3 className="font-title-md text-sm text-primary font-bold">Address & Location Details</h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-2">Address Line 1 (House/Flat, Street, Area)</label>
              <input
                value={form.address_line1}
                onChange={(e) => setForm({ ...form, address_line1: e.target.value })}
                className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-4 py-3 font-body-md text-sm text-on-surface focus:outline-none focus:border-secondary focus:bg-surface focus:shadow-[0_0_0_3px_rgba(168,224,90,0.1)] transition-all"
                placeholder="Flat 302, Green Valley Apartments"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-2">Address Line 2 (Landmark, Sector - Optional)</label>
              <input
                value={form.address_line2}
                onChange={(e) => setForm({ ...form, address_line2: e.target.value })}
                className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-4 py-3 font-body-md text-sm text-on-surface focus:outline-none focus:border-secondary focus:bg-surface focus:shadow-[0_0_0_3px_rgba(168,224,90,0.1)] transition-all"
                placeholder="Near Eco Park"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-2">City</label>
                <input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-4 py-3 font-body-md text-sm text-on-surface focus:outline-none focus:border-secondary focus:bg-surface focus:shadow-[0_0_0_3px_rgba(168,224,90,0.1)] transition-all"
                  placeholder="Bengaluru"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-2">State</label>
                <input
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-4 py-3 font-body-md text-sm text-on-surface focus:outline-none focus:border-secondary focus:bg-surface focus:shadow-[0_0_0_3px_rgba(168,224,90,0.1)] transition-all"
                  placeholder="Karnataka"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-2">Pincode</label>
                <input
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-4 py-3 font-body-md text-sm text-on-surface focus:outline-none focus:border-secondary focus:bg-surface focus:shadow-[0_0_0_3px_rgba(168,224,90,0.1)] transition-all"
                  placeholder="560001"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-2 mb-2 block">
                Select Location on Map
              </label>
              <LocationPicker
                value={{ address: form.address || form.address_line1 }}
                onChange={handleMapLocationChange}
                height={200}
                showAddress={false}
              />
            </div>
          </div>

          <Button variant="primary" size="lg" loading={saving} onClick={handleSave} className="w-full mt-4">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Card>

        <Card className="p-5 md:p-6 w-full">
          <h2 className="font-headline-md text-xl md:text-2xl text-primary font-bold mb-6">Notification Settings</h2>
          <div className="flex flex-col gap-4">
            {[
              { key: 'pickupReminders', label: 'Pickup Reminders', desc: 'Get notified about scheduled pickups' },
              { key: 'reportAlerts', label: 'Report Alerts', desc: 'Updates on your waste reports' },
              { key: 'weeklySummary', label: 'Weekly Summary', desc: 'Weekly impact recap' },
              { key: 'promotional', label: 'Promotions', desc: 'Event and reward updates' },
            ].map((item) => (
              <label key={item.key} className="flex items-center justify-between gap-3 p-4 rounded-xl border border-surface-container-high/50 bg-surface-container-lowest hover:border-secondary/50 hover:bg-surface transition-colors cursor-pointer group">
                <div>
                  <p className="font-body-md text-primary font-bold group-hover:text-[#0a3a2a] transition-colors">{item.label}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{item.desc}</p>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={settings[item.key]}
                    onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-secondary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A8E05A]"></div>
                </div>
              </label>
            ))}
          </div>
          <div className="pt-4 flex w-full  justify-center">
            <Button variant="danger" size="lg" onClick={handleSignOut} className="w-full max-w-sm">
              <Icon name="logout" className="text-lg" /> Sign Out
            </Button>
          </div>
        </Card>
      </div>

    </div>
  );
}
