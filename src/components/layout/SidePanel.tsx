import { Link, NavLink } from 'react-router-dom';
import { Moon, Sun, Shield, Settings, LogIn } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '../ui/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { useBike } from '../../contexts/BikeContext';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { label: 'Overview', path: '/dashboard' },
  { label: 'Routes', path: '/dashboard/routes' },
  { label: 'Charging', path: '/dashboard/charging' },
  { label: 'Analytics', path: '/dashboard/analytics' },
  { label: 'Security', path: '/dashboard/security' },
  { label: 'Maintenance', path: '/dashboard/maintenance' },
  { label: 'Environment', path: '/dashboard/environment' },
  { label: 'Reports', path: '/dashboard/reports' },
];

type SidePanelProps = {
  open: boolean;
  onClose: () => void;
};

export function SidePanel({ open, onClose }: SidePanelProps) {
  const { theme, toggleTheme } = useTheme();
  const { bikes, activeBike, setActiveBike } = useBike();
  const { profile } = useAuth();
  const adminLink = profile?.role === 'admin' ? '/admin/dashboard' : '/admin';
  const adminLabel = profile?.role === 'admin' ? 'Admin Console' : 'Admin Login';

  return (
    <aside
      className={clsx(
        'fixed inset-y-0 right-0 z-40 w-full max-w-md bg-white/95 dark:bg-slate-900/95 border-l border-slate-100/80 dark:border-white/10 shadow-2xl transition-transform duration-300',
        open ? 'translate-x-0' : 'translate-x-full',
        'lg:static lg:translate-x-0 lg:max-w-xs'
      )}
    >
      <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5 lg:hidden">
        <p className="text-lg font-semibold">Menu</p>
        <button
          className="text-sm text-slate-500 hover:text-slate-900"
          onClick={onClose}
        >
          Close
        </button>
      </div>
      <div className="flex h-full flex-col gap-6 overflow-y-auto p-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-slate-400">
            Bike selection
          </p>
          <div className="space-y-2">
            {bikes.map((bike) => (
              <button
                key={bike.id}
                className={clsx(
                  'w-full rounded-xl border px-4 py-3 text-left transition',
                  bike.id === activeBike.id
                    ? 'border-primary-500 bg-primary-500/10 text-primary-700 dark:text-primary-200'
                    : 'border-slate-100 hover:border-primary-300 dark:border-white/5 dark:hover:border-primary-400'
                )}
                onClick={() => {
                  setActiveBike(bike.id);
                  onClose();
                }}
              >
                <p className="font-semibold">{bike.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {bike.vin}
                </p>
              </button>
            ))}
          </div>
        </div>

        <nav className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-slate-400">
            Navigation
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'block rounded-xl px-4 py-2.5 text-sm font-medium transition',
                  isActive
                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-300'
                    : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5'
                )
              }
              onClick={onClose}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </Button>

          <Link to={adminLink} onClick={onClose}>
            <Button variant="outline" className="w-full">
              <Shield size={16} />
              {adminLabel}
            </Button>
          </Link>

          <Link to="/settings" onClick={onClose}>
            <Button variant="ghost" className="w-full">
              <Settings size={16} />
              Settings & Preferences
            </Button>
          </Link>
        </div>

        <div className="mt-auto rounded-2xl bg-slate-900 text-white p-5 dark:bg-primary-500">
          <p className="text-sm font-medium uppercase tracking-widest">
            Need access?
          </p>
          <p className="mt-2 text-sm text-white/70">
            Admins can provision bikes, issue API keys and manage users.
          </p>
          <Link to={adminLink} onClick={onClose}>
            <Button className="mt-4 w-full bg-white text-slate-900 hover:bg-slate-100 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800">
              <LogIn size={16} />
              {profile?.role === 'admin'
                ? 'Open Admin Portal'
                : 'Go to Admin Portal'}
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}

