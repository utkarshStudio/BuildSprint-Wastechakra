import { lazy } from 'react';
import { Route } from 'react-router-dom';
import Lazy from '../../components/LazyRoute';

const AdminDashboard = lazy(() => import('../../pages/admin/Dashboard'));
const AdminMap = lazy(() => import('../../pages/admin/Map'));
const AdminPickups = lazy(() => import('../../pages/admin/Pickups'));
const AdminReports = lazy(() => import('../../pages/admin/Reports'));
const AdminCollectors = lazy(() => import('../../pages/admin/Collectors'));
const AdminUsers = lazy(() => import('../../pages/admin/Users'));
const AdminBusinesses = lazy(() => import('../../pages/admin/Businesses'));
const AdminFacilities = lazy(() => import('../../pages/admin/Facilities'));
const AdminSocieties = lazy(() => import('../../pages/admin/Societies'));
const AdminProcessing = lazy(() => import('../../pages/admin/Processing'));
const AdminAITraining = lazy(() => import('../../pages/admin/AITraining'));
const AdminSimulation = lazy(() => import('../../pages/admin/Simulation'));
const AdminRewards = lazy(() => import('../../pages/admin/Rewards'));
const AdminCommunity = lazy(() => import('../../pages/admin/Community'));
const AdminAnalytics = lazy(() => import('../../pages/admin/Analytics'));
const AdminSettings = lazy(() => import('../../pages/admin/Settings'));

export const AdminRoutes = (
  <>
    <Route index element={<Lazy><AdminDashboard /></Lazy>} />
    <Route path="map" element={<Lazy><AdminMap /></Lazy>} />
    <Route path="pickups" element={<Lazy><AdminPickups /></Lazy>} />
    <Route path="reports" element={<Lazy><AdminReports /></Lazy>} />
    <Route path="collectors" element={<Lazy><AdminCollectors /></Lazy>} />
    <Route path="users" element={<Lazy><AdminUsers /></Lazy>} />
    <Route path="businesses" element={<Lazy><AdminBusinesses /></Lazy>} />
    <Route path="facilities" element={<Lazy><AdminFacilities /></Lazy>} />
    <Route path="societies" element={<Lazy><AdminSocieties /></Lazy>} />
    <Route path="processing" element={<Lazy><AdminProcessing /></Lazy>} />
    <Route path="ai-training" element={<Lazy><AdminAITraining /></Lazy>} />
    <Route path="simulation" element={<Lazy><AdminSimulation /></Lazy>} />
    <Route path="rewards" element={<Lazy><AdminRewards /></Lazy>} />
    <Route path="community" element={<Lazy><AdminCommunity /></Lazy>} />
    <Route path="analytics" element={<Lazy><AdminAnalytics /></Lazy>} />
    <Route path="settings" element={<Lazy><AdminSettings /></Lazy>} />
  </>
);

export default AdminRoutes;