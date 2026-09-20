import PanelShell from '../PanelShell';
import CollectorSidebar, { COLLECTOR_NAV } from './CollectorSidebar';
import CollectorNavbar from './CollectorNavbar';

export default function CollectorPanel() {
  return (
    <PanelShell
      sidebar={<CollectorSidebar />}
      navbar={<CollectorNavbar />}
      nav={COLLECTOR_NAV}
    />
  );
}