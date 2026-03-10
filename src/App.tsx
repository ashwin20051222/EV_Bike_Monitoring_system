import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { BikeProvider } from './contexts/BikeContext';
import { RealtimeProvider } from './contexts/RealtimeContext';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { AdminRoute } from './components/routing/AdminRoute';
import { AppLayout } from './components/layout/AppLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { Overview } from './pages/dashboard/Overview';
import { Routes as RouteHistory } from './pages/dashboard/Routes';
import { Charging } from './pages/dashboard/Charging';
import { Analytics } from './pages/dashboard/Analytics';
import { Security } from './pages/dashboard/Security';
import { Maintenance } from './pages/dashboard/Maintenance';
import { Environment } from './pages/dashboard/Environment';
import { Reports } from './pages/dashboard/Reports';
import { Settings } from './pages/Settings';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { AdminLogin } from './pages/auth/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BikeProvider>
          <RealtimeProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin" element={<AdminLogin />} />

                <Route element={<ProtectedRoute />}>
                  <Route element={<AdminRoute />}>
                    <Route element={<AdminLayout />}>
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    </Route>
                  </Route>

                  <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<Overview />} />
                    <Route path="/dashboard/routes" element={<RouteHistory />} />
                    <Route path="/dashboard/charging" element={<Charging />} />
                    <Route path="/dashboard/analytics" element={<Analytics />} />
                    <Route path="/dashboard/security" element={<Security />} />
                    <Route
                      path="/dashboard/maintenance"
                      element={<Maintenance />}
                    />
                    <Route
                      path="/dashboard/environment"
                      element={<Environment />}
                    />
                    <Route path="/dashboard/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>
                </Route>

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </BrowserRouter>
          </RealtimeProvider>
        </BikeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
