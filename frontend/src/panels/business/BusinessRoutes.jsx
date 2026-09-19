import { lazy } from 'react';
import { Route } from 'react-router-dom';
import Lazy from '../../components/LazyRoute';

const BusinessDashboard = lazy(() => import('../../pages/business/Dashboard'));
const BusinessPickups = lazy(() => import('../../pages/business/Pickups'));
const BusinessAnalytics = lazy(() => import('../../pages/business/Analytics'));
const BusinessSettings = lazy(() => import('../../pages/business/Settings'));

export const BusinessRoutes = (
  <>
    <Route index element={<Lazy><BusinessDashboard /></Lazy>} />
    <Route path="pickups" element={<Lazy><BusinessPickups /></Lazy>} />
    <Route path="analytics" element={<Lazy><BusinessAnalytics /></Lazy>} />
    <Route path="settings" element={<Lazy><BusinessSettings /></Lazy>} />
  </>
);

export default BusinessRoutes;