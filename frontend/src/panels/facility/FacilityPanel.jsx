import PanelShell from '../PanelShell';
import FacilitySidebar, { FACILITY_NAV } from './FacilitySidebar';
import FacilityNavbar from './FacilityNavbar';

export default function FacilityPanel() {
  return (
    <PanelShell
      sidebar={<FacilitySidebar />}
      navbar={<FacilityNavbar />}
      nav={FACILITY_NAV}
    />
  );
}