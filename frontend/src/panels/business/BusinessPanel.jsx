import PanelShell from '../PanelShell';
import BusinessSidebar, { BUSINESS_NAV } from './BusinessSidebar';
import BusinessNavbar from './BusinessNavbar';

export default function BusinessPanel() {
  return (
    <PanelShell
      sidebar={<BusinessSidebar />}
      navbar={<BusinessNavbar />}
      nav={BUSINESS_NAV}
    />
  );
}