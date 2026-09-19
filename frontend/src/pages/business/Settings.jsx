import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { businessApi } from '../../services/businessApi';
import { Card, Button } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

export default function Settings() {
  const { user, logout, refreshProfile } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [gst, setGst] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [pincode, setPincode] = useState('');
  const [emailPrefs, setEmailPrefs] = useState({ pickup: true, report: true, invoice: true, alerts: true });
  const [webhookActive, setWebhookActive] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Load real profile details from backend
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const profileData = await businessApi.getProfile();
        if (!mounted) return;
        const u = profileData || user;
        const bp = u?.business_profile || {};
        const p = u?.profile || {};

        const name = bp.company_name || (u?.first_name ? `${u.first_name} ${u.last_name || ''}`.trim() : (u?.username || ''));
        setCompanyName(name);
        setGst(bp.gstin || '');
        setContact(bp.phone || p.phone || '');
        setAddress(bp.address || p.address || p.address_line1 || '');
        setCity(bp.city || p.city || '');
        setStateVal(bp.state || p.state || '');
        setPincode(bp.pincode || p.pincode || '');
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setErrorMessage('');
    try {
      // Split company name into first_name / last_name
      const parts = companyName.trim().split(' ');
      const first_name = parts[0] || '';
      const last_name = parts.slice(1).join(' ') || '';

      await businessApi.updateProfile({
        company_name: companyName,
        gstin: gst,
        first_name,
        last_name,
        phone: contact,
        address,
        city,
        state: stateVal,
        pincode,
      });

      await refreshProfile?.();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update profile settings.');
    } finally {
      setSaving(false);
    }
  };

  const displayName = companyName || user?.username || 'Enterprise Account';
  const displayInitial = (companyName || user?.username || 'BZ').slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Header Hero Card */}
      <Card className="p-0 overflow-hidden relative border border-surface-container-high bg-surface-container-lowest rounded-xl">
        {/* Top Banner */}
        <div className="h-28 md:h-36 w-full bg-gradient-to-r from-forest via-[#0a3a2a] to-[#00180b] relative overflow-hidden flex items-start justify-between p-4 md:p-6">
          <div className="relative z-10 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-surface-bright text-xs font-semibold border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse" />
              <span>Commercial Account</span>
            </span>
          </div>
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-secondary-container text-primary uppercase tracking-wider shadow-sm">
              <Icon name="business" className="text-xs" />
              <span>BUSINESS</span>
            </span>
          </div>
        </div>

        {/* Card Body with Avatar */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="-mt-12 md:-mt-14 w-24 h-24 rounded-full bg-forest text-secondary-container ring-4 ring-surface-container-lowest flex items-center justify-center text-2xl font-extrabold shadow-xl shrink-0 z-10">
                {displayInitial}
              </div>
              <div className="flex flex-col gap-1 pt-1 sm:pt-3">
                <h1 className="font-headline-md text-2xl md:text-3xl text-primary font-bold tracking-tight">
                  {displayName}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-on-surface-variant">
                  <span className="flex items-center gap-1.5">
                    <Icon name="mail" className="text-xs text-secondary" />
                    <span>{user?.email || '—'}</span>
                  </span>
                  {contact && (
                    <span className="flex items-center gap-1.5">
                      <Icon name="phone" className="text-xs text-secondary" />
                      <span>{contact}</span>
                    </span>
                  )}
                  {city && (
                    <span className="flex items-center gap-1.5">
                      <Icon name="location_on" className="text-xs text-secondary" />
                      <span>{city}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 sm:gap-4 bg-surface-container-low px-4 sm:px-5 py-3 rounded-2xl border border-surface-container-high/60 mt-2 md:mt-3">
              <div className="text-center px-3 border-r border-surface-container-high/60">
                <p className="font-headline-md text-xs sm:text-sm font-extrabold text-primary flex items-center justify-center gap-1">
                  <Icon name="verified_user" className="text-secondary text-base" />
                  <span>EPR Registered</span>
                </p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">Statutory Profile</p>
              </div>
              <div className="text-center px-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  <Icon name="check_circle" className="text-xs" /> Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
        {/* Company Profile Form */}
        <Card className="p-5 md:p-6 w-full flex flex-col h-full">
          <h2 className="font-headline-md text-xl text-primary font-bold mb-4">Enterprise Profile Details</h2>
          
          {saved && (
            <div className="bg-secondary-container/40 rounded-xl p-3 mb-4 text-primary text-sm font-bold flex items-center gap-2 border border-secondary-container">
              <Icon name="check_circle" className="text-lg" /> Profile settings saved to server!
            </div>
          )}

          {errorMessage && (
            <div className="bg-error/10 text-error rounded-xl p-3 mb-4 text-sm font-bold flex items-center gap-2 border border-error/20">
              <Icon name="warning" className="text-lg shrink-0" /> {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-1">Company / Facility Name</label>
            <input
              type="text"
              value={companyName}
              placeholder="e.g. Acme Tech Park Pvt Ltd"
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-4 py-2.5 text-sm outline-none focus:border-secondary transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-1">GSTIN Number (Optional)</label>
              <input
                type="text"
                value={gst}
                placeholder="22AAAAA0000A1Z5"
                onChange={(e) => setGst(e.target.value)}
                className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-4 py-2.5 text-sm outline-none focus:border-secondary transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-1">Dispatch Phone</label>
              <input
                type="tel"
                value={contact}
                placeholder="+91 98765 43210"
                onChange={(e) => setContact(e.target.value)}
                className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-4 py-2.5 text-sm outline-none focus:border-secondary transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-1">Primary Facility Address</label>
            <textarea
              value={address}
              placeholder="Building, street, landmark, gate access notes..."
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-4 py-2.5 text-sm outline-none focus:border-secondary transition-all"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-1">City</label>
              <input
                type="text"
                value={city}
                placeholder="City"
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-secondary transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-1">State</label>
              <input
                type="text"
                value={stateVal}
                placeholder="State"
                onChange={(e) => setStateVal(e.target.value)}
                className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-secondary transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-primary uppercase tracking-widest ml-1">Pincode</label>
              <input
                type="text"
                value={pincode}
                placeholder="PIN"
                onChange={(e) => setPincode(e.target.value)}
                className="w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-secondary transition-all"
              />
            </div>
          </div>

          <Button variant="primary" loading={saving} onClick={save} className="w-full mt-auto">
            Save Company Details
          </Button>
        </Card>

        {/* Notifications & Integrations */}
        <div className="flex flex-col gap-4">
          <Card className="p-5 md:p-6">
            <h2 className="font-headline-md text-xl text-primary font-bold mb-4">Notification Preferences</h2>
            <div className="flex flex-col gap-3">
              {[
                { key: 'pickup', label: 'Pickup Dispatch Updates', desc: 'Alerts when collector is en route or arrives at dock' },
                { key: 'report', label: 'Monthly ESG Impact Statements', desc: 'Summary of carbon offsets and landfill diversion' },
                { key: 'invoice', label: 'Weighment Verification Receipts', desc: 'Digital manifests sent upon collector scale confirmation' },
                { key: 'alerts', label: 'Regulatory & EPR Directives', desc: 'Mandatory statutory circular compliance alerts' },
              ].map((item) => (
                <label key={item.key} className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors">
                  <input
                    type="checkbox"
                    checked={emailPrefs[item.key]}
                    onChange={(e) => setEmailPrefs({ ...emailPrefs, [item.key]: e.target.checked })}
                    className="mt-1 accent-primary w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <p className="text-sm font-bold text-primary">{item.label}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{item.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </Card>

          <Card className="p-5 md:p-6">
            <h2 className="font-headline-md text-xl text-primary font-bold mb-2">Account Actions</h2>
            <p className="text-xs text-on-surface-variant mb-4">
              Logged in as <strong className="text-primary">{user?.email}</strong> (Role: {user?.role})
            </p>
            <Button variant="outline" onClick={logout} className="w-full text-error border-error/40 hover:bg-error/10">
              <Icon name="logout" className="text-base" /> Sign Out of Business Panel
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
