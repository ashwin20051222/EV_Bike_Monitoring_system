import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function ProtectedRoute() {
  const { session, profile, loading } = useAuth();
  const location = useLocation();
  const isAuthenticated = Boolean(session || profile);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <p className="text-sm text-slate-500">Checking session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location, message: 'Sign in first' }}
      />
    );
  }

  return <Outlet />;
}

