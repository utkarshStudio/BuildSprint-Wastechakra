import { request, qs } from './api';

export const citizenApi = {
  createWasteReport: (formData) => request('/waste-reports/create/', { method: 'POST', body: formData }),
  getWasteReports: (params = {}) => request(`/waste-reports/${qs(params)}`),
  getWasteReport: (id) => request(`/waste-reports/${id}/`),

  createPickup: (data) => request('/pickups/create/', { method: 'POST', body: JSON.stringify(data) }),
  submitQuoteRequest: (data) => request('/pickups/quote-request/', { method: 'POST', body: JSON.stringify(data) }),
  getPickups: (params = {}) => request(`/pickups/${qs(params)}`),
  getPickup: (id) => request(`/pickups/${id}/`),

  getImpact: () => request('/user/impact/'),
  getPassport: (id) => request(`/passports/${id}/`),

  getRewards: () => request('/rewards/'),
  redeemReward: (rewardId) => request('/rewards/redeem/', { method: 'POST', body: JSON.stringify({ reward_id: rewardId }) }),
  getRewardHistory: () => request('/rewards/history/'),

  getCommunityEvents: (params = {}) => request(`/community/events/${qs(params)}`),
  joinCommunityEvent: (id, data = {}) => request(`/community/events/${id}/join/`, { method: 'POST', body: JSON.stringify(data) }),

  processWasteImage: (file, source = 'UPLOAD') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('source', source);
    return request('/pipeline/process/', { method: 'POST', body: formData });
  },
};
