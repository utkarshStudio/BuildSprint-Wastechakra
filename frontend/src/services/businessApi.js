import { request, qs } from './api';

export const businessApi = {
  createBulkPickup: (data) => request('/pickups/create/', { method: 'POST', body: JSON.stringify(data) }),
  getPickups: (params = {}) => request(`/pickups/${qs(params)}`),
  getPickup: (id) => request(`/pickups/${id}/`),
  updatePickup: (id, data) => request(`/pickups/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  getPassports: (params = {}) => request(`/passports/${qs(params)}`),
  getPassport: (id) => request(`/passports/${id}/`),
  getProfile: () => request('/auth/profile/'),
  updateProfile: (data) => request('/auth/profile/', { method: 'PATCH', body: JSON.stringify(data) }),
  getImpact: () => request('/user/impact/'),
};
