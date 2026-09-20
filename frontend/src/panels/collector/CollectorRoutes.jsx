import { lazy } from 'react';
import { Route } from 'react-router-dom';
import Lazy from '../../components/LazyRoute';

const CollectorDashboard = lazy(() => import('../../pages/collector/Dashboard'));
const CollectorAssignedPickups = lazy(() => import('../../pages/collector/AssignedPickups'));
const RoutePlanner = lazy(() => import('../../pages/collector/Routes'));
const CollectorPickupDetail = lazy(() => import('../../pages/collector/PickupDetail'));
const CollectorHistory = lazy(() => import('../../pages/collector/History'));
const CollectorPerformance = lazy(() => import('../../pages/collector/Performance'));
const CollectorProfile = lazy(() => import('../../pages/collector/Profile'));

export const CollectorRoutes = (
  <>
    <Route index element={<Lazy><CollectorDashboard /></Lazy>} />
    <Route path="assigned" element={<Lazy><CollectorAssignedPickups /></Lazy>} />
    <Route path="routes" element={<Lazy><RoutePlanner /></Lazy>} />
    <Route path="pickups/:id" element={<Lazy><CollectorPickupDetail /></Lazy>} />
    <Route path="history" element={<Lazy><CollectorHistory /></Lazy>} />
    <Route path="performance" element={<Lazy><CollectorPerformance /></Lazy>} />
    <Route path="profile" element={<Lazy><CollectorProfile /></Lazy>} />
  </>
);

export default CollectorRoutes;