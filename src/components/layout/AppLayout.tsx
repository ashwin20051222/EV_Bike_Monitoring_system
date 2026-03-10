import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useBike } from '../../contexts/BikeContext';
import { SidePanel } from './SidePanel';

const titleMap: Record<string, string> = {
  '/dashboard': 'EV Bike Command Center',
  '/dashboard/routes': 'Route History',
  '/dashboard/charging': 'Charging Network',
  '/dashboard/analytics': 'Predictive Analytics',
  '/dashboard/security': 'Security & Geo-fencing',
  '/dashboard/maintenance': 'Maintenance Planner',
  '/dashboard/environment': 'Environmental Impact',
  '/dashboard/reports': 'Reports',
  '/settings': 'Experience Settings',
};

export function AppLayout() {
  const { theme } = useTheme();
  const { activeBike } = useBike();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const location = useLocation();

  const pageTitle =
    titleMap[location.pathname] ?? 'EV Bike Command Center';

  return (
    <div className="relative flex min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="flex-1">
        <header className="sticky top-0 z-20 border-b border-white/50 bg-white/70 px-6 py-4 backdrop-blur dark:border-white/5 dark:bg-slate-900/70">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:bg-slate-900 dark:text-white lg:hidden"
                onClick={() => setIsPanelOpen((prev) => !prev)}
                aria-label="Toggle menu"
              >
                <Menu size={18} />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  YoloRacer Pet
                </p>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {pageTitle ?? 'EV Bike Command Center'}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeBike.name} · VIN {activeBike.vin} · Theme {theme}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3"></div>
          </div>
        </header>
        <main className="p-6">
          <div className="mx-auto max-w-6xl space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      <SidePanel open={isPanelOpen} onClose={() => setIsPanelOpen(false)} />

      {isPanelOpen && (
        <div
          className="blur-overlay fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setIsPanelOpen(false)}
        />
      )}
    </div>
  );
}

