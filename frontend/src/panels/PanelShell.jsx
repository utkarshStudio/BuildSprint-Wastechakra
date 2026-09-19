import { useState, useEffect, cloneElement } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/AppIcons';

const rolePaths = {
  CITIZEN: '/app',
  COLLECTOR: '/collector',
  BUSINESS: '/business',
  SOCIETY_ADMIN: '/app',
  FACILITY_MANAGER: '/facility',
  ADMIN: '/admin',
  SUPER_ADMIN: '/admin',
};

const HIDDEN_MOBILE = ['/app/report', '/collector/pickups'];

export default function PanelShell({ sidebar, navbar, nav = [] }) {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const basePath = rolePaths[user?.role] || '/app';
  const prominent = nav.find((n) => n.prominent);
  const isMobileShell = nav && nav.length > 0;

  // Build responsive 5-slot mobile bottom navigation
  let mobileTabs = [];
  if (prominent) {
    const nonProminent = nav.filter((n) => !n.prominent && !HIDDEN_MOBILE.includes(n.to));
    const leftSlots = nonProminent.slice(0, 2);
    // Prefer Profile and Rewards / Activity for the right slots
    const profileItem = nonProminent.find((n) => n.label.toLowerCase() === 'profile') || nonProminent[3];
    const rightOther = nonProminent.find((n) => n.label.toLowerCase() === 'rewards') || nonProminent[2] || nonProminent[1];
    const rightSlots = [rightOther, profileItem].filter(Boolean);

    mobileTabs = [
      ...leftSlots.map((item) => ({ ...item, isProminent: false })),
      { ...prominent, isProminent: true },
      ...rightSlots.map((item) => ({ ...item, isProminent: false })),
    ];
  } else {
    mobileTabs = nav.filter((n) => !HIDDEN_MOBILE.includes(n.to)).slice(0, 5).map((item) => ({ ...item, isProminent: false }));
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row antialiased">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Drawer on mobile, fixed aside on desktop) */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-primary text-on-primary z-50 transform transition-transform duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } flex flex-col`}
      >
        {sidebar}
      </aside>

      {/* Main App Container */}
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0 min-h-screen">
        {/* Mobile / Desktop App Bar */}
        <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-surface-container-high/70 px-3.5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-2xs">
          {cloneElement(navbar, { basePath, onOpenSidebar: () => setSidebarOpen(true) })}
        </header>

        {/* Content Area */}
        <main className="flex-1 px-3 sm:px-6 md:px-10 py-4 sm:py-6 pb-28 lg:pb-8 max-w-350 w-full mx-auto">
          <Outlet />
        </main>

        {/* Mobile App Dock / Bottom Tab Bar (iOS & Android Native Style) */}
        {isMobileShell && (
          <nav className="fixed bottom-0 inset-x-0 z-30 bg-surface/92 backdrop-blur-xl border-t border-surface-container-high/80 flex items-center justify-around px-2 py-1.5 pb-[max(env(safe-area-inset-bottom),0.5rem)] lg:hidden shadow-[0_-8px_30px_rgba(0,24,11,0.08)]">
            {mobileTabs.map((item, idx) => {
              const isActive = location.pathname === item.to;

              if (item.isProminent) {
                return (
                  <Link
                    key={item.to || idx}
                    to={item.to}
                    className="relative -top-5 flex flex-col items-center group active:scale-90 transition-transform"
                    aria-label={item.label}
                  >
                    <div className="w-14 h-14 rounded-full bg-linear-to-tr from-[#00180b] to-[#0a3a2a] p-1 shadow-[0_8px_20px_rgba(0,24,11,0.35)] ring-4 ring-surface flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-secondary-container flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                        <Icon name={item.icon} className="text-2xl text-primary" />
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-primary tracking-tight mt-0.5">
                      {item.label}
                    </span>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.to || idx}
                  to={item.to}
                  className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all active:scale-95 ${
                    isActive ? 'text-primary' : 'text-on-surface-variant/70 hover:text-primary'
                  }`}
                >
                  <div className="relative flex flex-col items-center">
                    <Icon
                      name={item.icon}
                      className={`text-[22px] transition-transform ${isActive ? 'scale-110 text-primary' : ''}`}
                    />
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-container absolute -bottom-1 shadow-[0_0_4px_#abf854]" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] tracking-tight mt-1 transition-colors ${
                      isActive ? 'font-extrabold text-primary' : 'font-medium text-on-surface-variant'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}