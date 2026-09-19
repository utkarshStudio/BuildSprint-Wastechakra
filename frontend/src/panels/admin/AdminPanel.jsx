import PanelShell from '../PanelShell';
import AdminSidebar, { ADMIN_NAV } from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

export default function AdminPanel() {
  return (
    <PanelShell
      sidebar={<AdminSidebar />}
      navbar={<AdminNavbar />}
      nav={ADMIN_NAV}
    />
  );
}