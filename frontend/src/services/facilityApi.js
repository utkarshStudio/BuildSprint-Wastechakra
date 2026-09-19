import { request, qs } from './api';

export const facilityApi = {
  getFacilityPickups: (params = {}) => request(`/pickups/${qs(params)}`),
  getPickup: (id) => request(`/pickups/${id}/`),
  getPassport: (id) => request(`/passports/${id}/`),
  updatePassport: (id, data) => request(`/passports/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  processWasteImage: (file, source = 'FACILITY') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('source', source);
    return request('/pipeline/process/', { method: 'POST', body: formData });
  },
  getStatsSummary: () => request('/stats/summary/'),
};
