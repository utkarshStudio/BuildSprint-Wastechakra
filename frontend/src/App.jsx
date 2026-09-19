import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import { RequireAuth, RequireRole } from './components/ProtectedRoute';
import Lazy from './components/LazyRoute';

import Home from './pages/Home';
import WasteChakraSimulation from './simulation/WasteChakraSimulation';

import CitizenPanel from './panels/citizen/CitizenPanel';
import CitizenRoutes from './panels/citizen/CitizenRoutes';
import CollectorPanel from './panels/collector/CollectorPanel';
import CollectorRoutes from './panels/collector/CollectorRoutes';
import BusinessPanel from './panels/business/BusinessPanel';
import BusinessRoutes from './panels/business/BusinessRoutes';
import FacilityPanel from './panels/facility/FacilityPanel';
import FacilityRoutes from './panels/facility/FacilityRoutes';
import AdminPanel from './panels/admin/AdminPanel';
import AdminRoutes from './panels/admin/AdminRoutes';

const SystemProcess = lazy(() => import('./pages/SystemProcess'));
const TheProblem = lazy(() => import('./pages/TheProblem'));
const AdaptiveIntelligence = lazy(() => import('./pages/AdaptiveIntelligence'));
const InnovationValue = lazy(() => import('./pages/InnovationValue'));
const Impact = lazy(() => import('./pages/Impact'));
const Team = lazy(() => import('./pages/Team'));
const FinalCTA = lazy(() => import('./pages/FinalCTA'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const Community = lazy(() => import('./pages/Community'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const EnvironmentalCompliance = lazy(() => import('./pages/EnvironmentalCompliance'));
const Security = lazy(() => import('./pages/Security'));

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="system" element={<Lazy><SystemProcess /></Lazy>} />
            <Route path="process" element={<Lazy><AdaptiveIntelligence /></Lazy>} />
            <Route path="innovation" element={<Lazy><InnovationValue /></Lazy>} />
            <Route path="impact" element={<Lazy><Impact /></Lazy>} />
            <Route path="team" element={<Lazy><Team /></Lazy>} />
            <Route path="simulation" element={<WasteChakraSimulation />} />
            <Route path="problem" element={<Lazy><TheProblem /></Lazy>} />
            <Route path="final" element={<Lazy><FinalCTA /></Lazy>} />
            <Route path="about" element={<Lazy><About /></Lazy>} />
            <Route path="services" element={<Lazy><Services /></Lazy>} />
            <Route path="how-it-works" element={<Lazy><HowItWorks /></Lazy>} />
            <Route path="community" element={<Lazy><Community /></Lazy>} />
            <Route path="contact" element={<Lazy><Contact /></Lazy>} />
            <Route path="privacy" element={<Lazy><PrivacyPolicy /></Lazy>} />
            <Route path="terms" element={<Lazy><TermsOfService /></Lazy>} />
            <Route path="compliance" element={<Lazy><EnvironmentalCompliance /></Lazy>} />
            <Route path="security" element={<Lazy><Security /></Lazy>} />
          </Route>

          <Route path="/login" element={<Lazy><Login /></Lazy>} />
          <Route path="/register" element={<Lazy><Register /></Lazy>} />

          <Route path="/app" element={<RequireAuth><CitizenPanel /></RequireAuth>}>
            {CitizenRoutes}
          </Route>

          <Route path="/collector" element={<RequireRole roles={['COLLECTOR']}><CollectorPanel /></RequireRole>}>
            {CollectorRoutes}
          </Route>

          <Route path="/business" element={<RequireRole roles={['BUSINESS']}><BusinessPanel /></RequireRole>}>
            {BusinessRoutes}
          </Route>

          <Route path="/facility" element={<RequireRole roles={['FACILITY_MANAGER', 'ADMIN', 'SUPER_ADMIN']}><FacilityPanel /></RequireRole>}>
            {FacilityRoutes}
          </Route>

          <Route path="/admin" element={<RequireRole roles={ADMIN_ROLES}><AdminPanel /></RequireRole>}>
            {AdminRoutes}
          </Route>

          <Route path="*" element={<Lazy><NotFound /></Lazy>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;