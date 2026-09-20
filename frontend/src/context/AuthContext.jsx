import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, setTokens, clearTokens, getStoredUser, setStoredUser, getToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    const data = await api.login({ email, password });
    setTokens(data.access, data.refresh);
    setStoredUser(data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (formData) => {
    const data = await api.register(formData);
    setTokens(data.access, data.refresh);
    setStoredUser(data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!getToken()) return;
    try {
      const data = await api.profile();
      setStoredUser(data);
      setUser(data);
      return data;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (getToken() && !getStoredUser()) {
      refreshProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    user,
    setUser,
    login,
    register,
    logout,
    refreshProfile,
    loading,
    isAuthenticated: !!user || !!getToken(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext) || {};
}
