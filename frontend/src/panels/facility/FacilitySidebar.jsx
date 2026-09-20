import ShellSidebar from '../ShellSidebar';

export const FACILITY_NAV = [
  { to: '/facility', label: 'Overview', icon: 'home' },
  { to: '/facility/batches', label: 'Batches', icon: 'inventory_2' },
  { to: '/facility/processing', label: 'Processing', icon: 'precision_manufacturing' },
  { to: '/facility/outputs', label: 'Outputs', icon: 'output' },
  { to: '/facility/simulation', label: 'Simulation', icon: 'view_in_ar' },
  { to: '/facility/quality', label: 'Quality', icon: 'verified_user' },
];

export default function FacilitySidebar() {
  return <ShellSidebar items={FACILITY_NAV} />;
}