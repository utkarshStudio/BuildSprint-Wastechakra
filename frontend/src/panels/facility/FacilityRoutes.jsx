import { lazy } from 'react';
import { Route } from 'react-router-dom';
import Lazy from '../../components/LazyRoute';

const FacilityDashboard = lazy(() => import('../../pages/facility/Dashboard'));
const FacilityBatches = lazy(() => import('../../pages/facility/Batches'));
const FacilityProcessing = lazy(() => import('../../pages/facility/Processing'));
const FacilityOutputs = lazy(() => import('../../pages/facility/Outputs'));
const FacilityQuality = lazy(() => import('../../pages/facility/Quality'));
const FacilitySimulation = lazy(() => import('../../pages/facility/Simulation'));

export const FacilityRoutes = (
  <>
    <Route index element={<Lazy><FacilityDashboard /></Lazy>} />
    <Route path="batches" element={<Lazy><FacilityBatches /></Lazy>} />
    <Route path="processing" element={<Lazy><FacilityProcessing /></Lazy>} />
    <Route path="outputs" element={<Lazy><FacilityOutputs /></Lazy>} />
    <Route path="quality" element={<Lazy><FacilityQuality /></Lazy>} />
    <Route path="simulation" element={<Lazy><FacilitySimulation /></Lazy>} />
  </>
);

export default FacilityRoutes;