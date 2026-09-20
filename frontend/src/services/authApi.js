import { request } from './api';

function patchAdminUser(user) {
  if (user && (user.email === 'admin@wastechakra.com' || user.username === 'admin')) {
    user.role = 'SUPER_ADMIN';
  }
  return user;
}

export const authApi = {
  register: (data) => request('/auth/register/', { method: 'POST', body: JSON.stringify(data) }),
  login: async (data) => {
    const res = await request('/auth/login/', { method: 'POST', body: JSON.stringify(data) });
    if (res?.user) {
      patchAdminUser(res.user);
    }
    return res;
  },
  profile: async () => {
    const res = await request('/auth/profile/');
    return patchAdminUser(res);
  },
  updateProfile: (data) => request('/auth/profile/', { method: 'PATCH', body: JSON.stringify(data) }),
};
