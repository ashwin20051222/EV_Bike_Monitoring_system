import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function AdminRoute() {
  const { loading, profileLoading, session, profile } = useAuth();
  const location = useLocation();
  const isAuthenticated = Boolean(session || profile);

  if (loading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-sm text-white/70">Verifying admin access...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin"
        replace
        state={{ message: 'Sign in with an admin account first', from: location }}
      />
    );
  }

  if (profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

