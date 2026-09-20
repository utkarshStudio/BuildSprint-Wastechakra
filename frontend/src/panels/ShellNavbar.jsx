import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/ui';
import { Icon } from '../components/AppIcons';

export default function ShellNavbar({ basePath, onOpenSidebar }) {
  const { user } = useAuth();
  const points = user?.profile?.chakra_points || 0;
  const isCitizen = basePath === '/app';

  return (
    <>
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          className="lg:hidden p-2 -ml-1 text-primary hover:bg-surface-container-high/60 active:scale-90 rounded-xl transition-all cursor-pointer"
          onClick={onOpenSidebar}
          aria-label="Open menu drawer"
        >
          <Icon name="menu" className="text-xl" />
        </button>

        <Link to={basePath} className="flex items-center gap-2 min-w-0 group">
          <div className="lg:hidden flex items-center gap-2">
            <img src="/images/logo-aida.png" alt="WasteChakra" className="h-6 sm:h-7 w-auto object-contain" />
          </div>
          <span className="font-headline-md text-base sm:text-lg text-primary font-extrabold truncate hidden sm:inline-block">
            {isCitizen ? 'Citizen App' : window.location.pathname.split('/')[1]?.toUpperCase()}
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {points > 0 && (
          <Link
            to={isCitizen ? '/app/rewards' : basePath}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#00180b] text-[#abf854] text-xs sm:text-sm font-extrabold shadow-2xs hover:scale-105 active:scale-95 transition-all"
            title="Chakra Points Balance"
          >
            <Icon name="stars" className="text-sm sm:text-base text-[#abf854]" />
            <span className="font-mono tracking-tight">{points.toLocaleString()}</span>
          </Link>
        )}

        <Link
          to="/simulation"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low border border-surface-container-high text-xs font-bold text-primary hover:bg-surface-container-high transition-colors"
        >
          <Icon name="view_in_ar" className="text-sm text-secondary" />
          <span>Simulation</span>
        </Link>

        {isCitizen && (
          <Link
            to="/app/notifications"
            className="p-2 text-primary hover:bg-surface-container-high/60 rounded-xl relative transition-all active:scale-90"
            title="Notifications"
          >
            <Icon name="notifications_active" className="text-lg sm:text-xl" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-surface animate-pulse" />
          </Link>
        )}

        <Link
          to={isCitizen ? '/app/profile' : `${basePath}/profile`}
          className="flex items-center gap-2 active:scale-90 transition-transform"
          title="Profile"
        >
          {user && <Avatar name={user.first_name || user.email || 'User'} size="sm" className="ring-2 ring-primary/15" />}
        </Link>
      </div>
    </>
  );
}