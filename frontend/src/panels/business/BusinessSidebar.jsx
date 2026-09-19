import ShellSidebar from '../ShellSidebar';

export const BUSINESS_NAV = [
  { to: '/business', label: 'Home', icon: 'home' },
  { to: '/business/pickups', label: 'Pickups', icon: 'local_shipping' },
  { to: '/business/analytics', label: 'Analytics', icon: 'monitoring' },
  { to: '/business/settings', label: 'Settings', icon: 'settings' },
];

export default function BusinessSidebar() {
  return <ShellSidebar items={BUSINESS_NAV} />;
}