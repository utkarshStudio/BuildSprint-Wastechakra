import ShellSidebar from '../ShellSidebar';

export const ADMIN_NAV = [
  { to: '/admin', label: 'Overview', icon: 'dashboard' },
  { to: '/admin/map', label: 'Live Map', icon: 'map' },
  { to: '/admin/pickups', label: 'Pickups', icon: 'local_shipping' },
  { to: '/admin/reports', label: 'Waste Reports', icon: 'description' },
  { to: '/admin/collectors', label: 'Collectors', icon: 'engineering' },
  { to: '/admin/users', label: 'Users', icon: 'groups' },
  { to: '/admin/businesses', label: 'Businesses', icon: 'business_center' },
  { to: '/admin/societies', label: 'Societies', icon: 'apartment' },
  { to: '/admin/facilities', label: 'Facilities', icon: 'factory' },
  { to: '/admin/processing', label: 'Processing', icon: 'precision_manufacturing' },
  { to: '/admin/ai-training', label: 'AI Model Training', icon: 'psychology' },
  { to: '/admin/simulation', label: 'Simulation', icon: 'view_in_ar' },
  { to: '/admin/rewards', label: 'Rewards', icon: 'redeem' },
  { to: '/admin/community', label: 'Community', icon: 'groups' },
  { to: '/admin/analytics', label: 'Analytics', icon: 'monitoring' },
  { to: '/admin/settings', label: 'Settings', icon: 'settings' },
];

export default function AdminSidebar() {
  return <ShellSidebar items={ADMIN_NAV} />;
}