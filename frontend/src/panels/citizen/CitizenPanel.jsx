import PanelShell from '../PanelShell';
import CitizenSidebar, { CITIZEN_NAV } from './CitizenSidebar';
import CitizenNavbar from './CitizenNavbar';

export default function CitizenPanel() {
  return (
    <PanelShell
      sidebar={<CitizenSidebar />}
      navbar={<CitizenNavbar />}
      nav={CITIZEN_NAV}
    />
  );
}