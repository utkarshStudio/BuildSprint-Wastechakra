import { request, qs } from './api';

export const adminApi = {
  getPickups: (params = {}) => request(`/pickups/${qs(params)}`),
  getPickup: (id) => request(`/pickups/${id}/`),
  assignCollector: (pickupId, collectorId) => request(`/pickups/${pickupId}/`, {
    method: 'PATCH',
    body: JSON.stringify({ collector: collectorId, status: 'ASSIGNED' }),
  }),
  updatePickup: (id, data) => request(`/pickups/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),

  getWasteReports: (params = {}) => request(`/waste-reports/${qs(params)}`),
  getWasteReport: (id) => request(`/waste-reports/${id}/`),

  getStatsSummary: () => request('/stats/summary/'),
  simulateWaste: (simParams) => request('/pipeline/simulate/', { method: 'POST', body: JSON.stringify(simParams) }),
  getWasteRecords: (params = {}) => request(`/records/${qs(params)}`),
  getDecisionConfig: () => request('/config/decision-rules/'),
  updateDecisionConfig: (fields) => request('/config/decision-rules/', { method: 'PATCH', body: JSON.stringify(fields) }),

  // Vision AI Training & Dataset Endpoints
  getAITrainingDashboard: () => request('/detection/training/dashboard/'),
  getAITrainingSamples: (params = {}) => request(`/detection/training/samples/${qs(params)}`),
  batchApproveAITrainingSamples: () => request('/detection/training/samples/batch/', { method: 'POST', body: JSON.stringify({ action: 'APPROVE_ALL_PENDING' }) }),
  updateAITrainingSample: (id, data) => request(`/detection/training/samples/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  uploadAITrainingSample: (formData) => request('/detection/training/samples/upload/', { method: 'POST', body: formData }),
  triggerAITraining: (data = {}) => request('/detection/training/trigger/', { method: 'POST', body: JSON.stringify(data) }),
  getAITrainingJobStatus: (jobId = null) => request(jobId ? `/detection/training/jobs/${jobId}/status/` : '/detection/training/jobs/latest/'),
  getModelVersions: () => request('/detection/training/models/'),
  activateModelVersion: (id) => request(`/detection/training/models/${id}/activate/`, { method: 'POST' }),
};

