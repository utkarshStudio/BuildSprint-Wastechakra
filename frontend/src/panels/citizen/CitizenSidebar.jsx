import ShellSidebar from '../ShellSidebar';

export const CITIZEN_NAV = [
  { to: '/app', label: 'Home', icon: 'home' },
  { to: '/app/map', label: 'Map', icon: 'map' },
  { to: '/app/report', label: 'Report', icon: 'add_a_photo', prominent: true },
  { to: '/app/rewards', label: 'Rewards', icon: 'redeem' },
  { to: '/app/impact', label: 'Impact', icon: 'monitoring' },
  { to: '/app/community', label: 'Community', icon: 'groups' },
  { to: '/app/profile', label: 'Profile', icon: 'person' },
];

export default function CitizenSidebar() {
  return <ShellSidebar items={CITIZEN_NAV} />;
}