import { Card } from '../../components/ui/Card';
import { MapPanel } from '../../components/dashboard/MapPanel';

export function Routes() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Route playback
            </p>
            <h2 className="text-xl font-semibold">Today’s route history</h2>
          </div>
          <button className="text-sm font-semibold text-primary-500">
            Export GPX
          </button>
        </div>
        <p className="mt-3 text-sm text-slate-500">
          Visualize breadcrumbs, stop events and route performance.
        </p>
        <div className="mt-6">
          <MapPanel lat={12.9716} lng={77.5946} label="Bangalore Loop" />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {['Start · 08:32', 'Fast charge · 10:05', 'End · 11:14'].map(
          (title) => (
            <Card key={title} className="p-4">
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Waypoint
              </p>
              <p className="text-lg font-semibold">{title}</p>
              <p className="text-xs text-slate-500">
                Auto-generated from trip telemetry.
              </p>
            </Card>
          )
        )}
      </div>
    </div>
  );
}

