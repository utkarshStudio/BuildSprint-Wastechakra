import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <FullScreenLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export function RequireRole({ roles, children }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <FullScreenLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user && roles.includes(user.role)) return children;
  return <Navigate to="/app" replace />;
}

export function FullScreenLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface">
      <div className="w-10 h-10 border-4 border-surface-container-high border-t-primary rounded-full animate-spin" />
      <p className="mt-4 font-label-md text-label-md text-on-surface-variant">Loading...</p>
    </div>
  );
}
