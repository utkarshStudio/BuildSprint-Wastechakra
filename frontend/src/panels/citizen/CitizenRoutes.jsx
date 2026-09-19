import { lazy } from 'react';
import { Route } from 'react-router-dom';
import Lazy from '../../components/LazyRoute';

const CitizenDashboard = lazy(() => import('../../pages/citizen/Dashboard'));
const CitizenMap = lazy(() => import('../../pages/citizen/Map'));
const ReportWaste = lazy(() => import('../../pages/citizen/ReportWaste'));
const CitizenPickups = lazy(() => import('../../pages/citizen/Pickups'));
const PickupDetail = lazy(() => import('../../pages/citizen/PickupDetail'));
const MyWaste = lazy(() => import('../../pages/citizen/MyWaste'));
const WasteJourney = lazy(() => import('../../pages/citizen/WasteJourney'));
const WastePassport = lazy(() => import('../../pages/citizen/WastePassport'));
const CitizenImpact = lazy(() => import('../../pages/citizen/Impact'));
const Rewards = lazy(() => import('../../pages/citizen/Rewards'));
const CitizenCommunity = lazy(() => import('../../pages/citizen/Community'));
const CitizenProfile = lazy(() => import('../../pages/citizen/Profile'));
const Notifications = lazy(() => import('../../pages/citizen/Notifications'));

export const CitizenRoutes = (
  <>
    <Route index element={<Lazy><CitizenDashboard /></Lazy>} />
    <Route path="map" element={<Lazy><CitizenMap /></Lazy>} />
    <Route path="report" element={<Lazy><ReportWaste /></Lazy>} />
    <Route path="pickups" element={<Lazy><CitizenPickups /></Lazy>} />
    <Route path="pickups/:id" element={<Lazy><PickupDetail /></Lazy>} />
    <Route path="waste" element={<Lazy><MyWaste /></Lazy>} />
    <Route path="waste/:id" element={<Lazy><WasteJourney /></Lazy>} />
    <Route path="passport/:id" element={<Lazy><WastePassport /></Lazy>} />
    <Route path="impact" element={<Lazy><CitizenImpact /></Lazy>} />
    <Route path="rewards" element={<Lazy><Rewards /></Lazy>} />
    <Route path="community" element={<Lazy><CitizenCommunity /></Lazy>} />
    <Route path="profile" element={<Lazy><CitizenProfile /></Lazy>} />
    <Route path="notifications" element={<Lazy><Notifications /></Lazy>} />
  </>
);

export default CitizenRoutes;