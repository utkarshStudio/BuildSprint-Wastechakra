import { request } from './api';

export const authApi = {
  register: (data) => request('/auth/register/', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login/', { method: 'POST', body: JSON.stringify(data) }),
  profile: () => request('/auth/profile/'),
  updateProfile: (data) => request('/auth/profile/', { method: 'PATCH', body: JSON.stringify(data) }),
};
