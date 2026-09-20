import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icon } from './AppIcons';

const SECTIONS = [
  // { label: 'Home', target: '/', active: true },
  // { label: 'About', target: '/about' },
  { label: 'Services', target: '/services' },
  { label: 'How It Works', target: '/how-it-works' },
  { label: 'Impact', target: '/impact' },
  { label: 'Community', target: '/community' },
  { label: 'Simulation', target: '/simulation' },
  { label: 'Contact', target: '/contact' },
];

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleSectionClick = (e, target) => {
    if (target.startsWith('#') && target !== '#') {
      closeMenu();
      if (location.pathname !== '/') {
        e.preventDefault();
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(target.slice(1));
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      }
      return;
    }
    closeMenu();
  };

  const signInDest = user ? (() => {
    if (user.role === 'COLLECTOR') return '/collector';
    if (user.role === 'BUSINESS') return '/business';
    if (user.role === 'FACILITY_MANAGER') return '/facility';
    if (['ADMIN', 'SUPER_ADMIN'].includes(user.role)) return '/admin';
    return '/app';
  })() : '/login';

  const searchParams = new URLSearchParams(location.search);
  const isEmbed = searchParams.get('embed') === 'true' || searchParams.get('embed') === '1';

  if (isEmbed) {
    return (
      <div className="w-full h-full min-h-screen bg-surface flex flex-col">
        <main className="grow flex flex-col">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Navbar with inverted corners */}
      <nav className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] z-50">
        <div className="relative w-full bg-surface rounded-b-[20px] px-8 py-3.5 flex items-center justify-between">

          {/* Left Inverted Corner SVG */}
          <svg className="absolute top-0 -left-[24px] w-[24px] h-[24px] text-surface fill-current" viewBox="0 0 24 24">
            <path d="M0,0 H24 V24 A24,24 0 0,0 0,0 Z" />
          </svg>

          {/* Right Inverted Corner SVG */}
          <svg className="absolute top-0 -right-[24px] w-[24px] h-[24px] text-surface fill-current" viewBox="0 0 24 24">
            <path d="M24,0 H0 V24 A24,24 0 0,1 24,0 Z" />
          </svg>

          <Link to="/" className="flex items-center gap-2.5">
            <img alt="WasteChakra" className="h-10 w-auto object-contain" src="/images/logo-aida.png" />
          </Link>

          <nav className="hidden lg:flex items-center gap-6 font-semibold text-sm text-[#4a5568]">
            {SECTIONS.map((item) => (
              <div key={item.label} className="relative group flex items-center cursor-pointer">
                <Link
                  to={item.target}
                  onClick={(e) => handleSectionClick(e, item.target)}
                  className={`transition-colors hover:text-[#A8E05A] ${location.pathname === item.target ? 'text-[#A8E05A]' : ''}`}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to={signInDest}
                className="hidden lg:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-surface-bright font-bold text-sm hover:bg-primary-container transition-all shadow-sm"
              >
                <Icon name="account_circle" className="text-[18px]" />
                {user?.first_name ? `Hi, ${user.first_name}` : 'Dashboard'}
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden lg:inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-surface-container-highest text-primary font-bold text-xs hover:bg-surface-container-low transition-all"
              >
                Sign In
              </Link>
            )}
            <Link
              to="/app/report"
              className="hidden lg:inline-flex items-center gap-3 pl-5 pr-1.5 py-1.5 rounded-full bg-[#A8E05A] text-[#0a3a2a] font-bold text-sm hover:bg-[#96d048] transition-all shadow-sm"
            >
              <span>Report Waste</span>
              <span className="w-7 h-7 rounded-full bg-[#82bc33] flex items-center justify-center text-[#0a3a2a]">
                <Icon name="north_east" className="text-[16px]" />
              </span>
            </Link>
            <button
              className="lg:hidden text-[#0a3a2a] p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Icon name={isMobileMenuOpen ? 'close' : 'menu'} />
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-gutter bg-surface-container-lowest/95 backdrop-blur-md border border-surface-container-high rounded-2xl shadow-lg flex flex-col overflow-hidden">
            {SECTIONS.map((item) => (
              <Link
                key={item.label}
                to={item.target}
                onClick={closeMenu}
                className="px-6 py-4 border-b border-surface-container font-label-md text-on-surface"
              >
                {item.label}
              </Link>
            ))}
            <div className="p-6 flex flex-col gap-3">
              <Link
                to="/app/report"
                onClick={closeMenu}
                className="flex items-center justify-center w-full bg-secondary-container text-primary font-label-md font-bold px-6 py-3 rounded-full"
              >
                Report Waste
              </Link>
              <Link
                to={isAuthenticated ? signInDest : '/login'}
                onClick={closeMenu}
                className="flex items-center justify-center w-full border border-surface-container-highest text-primary font-label-md font-bold px-6 py-3 rounded-full"
              >
                {isAuthenticated ? 'My Dashboard' : 'Sign In'}
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow pt-20 py-8 flex flex-col items-center w-full">
        <Outlet />
      </main>

      <footer className="w-full bg-forest text-surface pt-space-3xl pb-space-2xl border-t border-surface-container-high/10">
        <div className="w-full max-w-container-max mx-auto px-gutter">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl pb-space-2xl border-b border-surface-container-high/10">
            {/* Col 1: Brand & Bio */}
            <div className="lg:col-span-2 flex flex-col gap-space-sm">
              <Link to="/" className="flex items-center gap-space-xs">
                <img alt="WasteChakra" className="h-12 w-auto bg-white rounded-lg object-contain" src="/images/logo-aida.png" />
              </Link>
              <p className="font-body-md text-body-md text-primary-fixed-dim max-w-sm mt-2">
                WasteChakra delivers eco-certified waste management, sustainable recycling logistics, and circular disposal solutions for residential complexes, municipalities, and commercial enterprises.
              </p>
              <div className="flex items-center gap-space-xs text-secondary-fixed mt-space-xs">
                <Icon name="eco" className="text-[18px]" />
                <span className="font-label-sm text-label-sm font-semibold">100% Landfill Diversion Target</span>
              </div>
            </div>

            {/* Col 2: Services */}
            <div className="flex flex-col gap-space-xs">
              <h4 className="font-title-md text-title-md font-bold text-surface-bright mb-space-xs">Services</h4>
              <ul className="flex flex-col gap-space-xs font-label-md text-label-md text-primary-fixed-dim">
                <li><Link className="hover:text-secondary-fixed transition-colors" to="/services" onClick={closeMenu}>Residential Pickup</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" to="/services" onClick={closeMenu}>Commercial Collection</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" to="/services" onClick={closeMenu}>Bulky Junk Cleanouts</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" to="/services" onClick={closeMenu}>E-Waste &amp; Electronics</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" to="/services" onClick={closeMenu}>Compost &amp; Organics</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" to="/services" onClick={closeMenu}>RDF Conditioning</Link></li>
              </ul>
            </div>

            {/* Col 3: Company */}
            <div className="flex flex-col gap-space-xs">
              <h4 className="font-title-md text-title-md font-bold text-surface-bright mb-space-xs">Company</h4>
              <ul className="flex flex-col gap-space-xs font-label-md text-label-md text-primary-fixed-dim">
                <li><Link className="hover:text-secondary-fixed transition-colors" to="/about" onClick={closeMenu}>About Us</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" to="/about" onClick={closeMenu}>Mission &amp; Vision</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" to="/how-it-works" onClick={closeMenu}>How It Works</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" to="/impact" onClick={closeMenu}>Impact Reports</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" to="/community" onClick={closeMenu}>Community</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" to="/simulation" onClick={closeMenu}>3D Simulator</Link></li>
              </ul>
            </div>

            {/* Col 4: Contact & Hours */}
            <div className="flex flex-col gap-space-xs">
              <h4 className="font-title-md text-title-md font-bold text-surface-bright mb-space-xs">Contact &amp; Help</h4>
              <div className="flex flex-col gap-space-xs font-label-md text-label-md text-primary-fixed-dim">
                <div className="flex items-start gap-2">
                  <Icon name="location_on" className="text-[18px] text-secondary-fixed mt-0.5" />
                  <span>Purnia Bihar - 854301</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="call" className="text-[18px] text-secondary-fixed" />
                  <span>+1 (800) CHAKRA-ECO</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="mail" className="text-[18px] text-secondary-fixed" />
                  <span>support@wastechakra.org</span>
                </div>
                <div className="flex items-center gap-2 pt-1 text-surface-bright font-bold">
                  <Icon name="schedule" className="text-[18px] text-secondary-fixed" />
                  <span>24/7 On-Demand Dispatch</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md">
            <p className="text-primary-fixed-dim font-label-sm text-label-sm text-center sm:text-left">
              © {new Date().getFullYear()} WasteChakra Circular Sustainability Inc. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-space-md text-primary-fixed-dim font-label-sm text-label-sm">
              <Link className="hover:text-surface transition-colors" to="/privacy">Privacy Policy</Link>
              <Link className="hover:text-surface transition-colors" to="/terms">Terms of Service</Link>
              <Link className="hover:text-surface transition-colors" to="/compliance">Environmental Compliance</Link>
              <Link className="hover:text-surface transition-colors" to="/security">Security</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}