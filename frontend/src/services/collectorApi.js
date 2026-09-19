import { request, qs } from './api';

export const collectorApi = {
  getAssignedPickups: (params = {}) => request(`/pickups/${qs(params)}`),
  getPickupDetail: (id) => request(`/pickups/${id}/`),
  updatePickupStatus: (id, data) => request(`/pickups/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  uploadPickupProof: (id, formData) => request(`/pickups/${id}/`, { method: 'PATCH', body: formData }),
  acceptPickup: (id) => request(`/pickups/${id}/accept/`, { method: 'POST' }),
  rejectPickup: (id) => request(`/pickups/${id}/reject/`, { method: 'POST' }),
  claimPickup: (id) => request(`/pickups/${id}/claim/`, { method: 'POST' }),
  getProfile: () => request('/auth/profile/'),
  updateProfile: (data) => request('/auth/profile/', { method: 'PATCH', body: JSON.stringify(data) }),
  getImpact: () => request('/user/impact/'),
};
