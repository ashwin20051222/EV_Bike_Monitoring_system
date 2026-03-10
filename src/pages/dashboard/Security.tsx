import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function Security() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Geo-fencing
            </p>
            <h2 className="text-2xl font-semibold">Secure perimeter</h2>
            <p className="text-sm text-slate-500">
              Define safe zones and get alerts when the bike exits them.
            </p>
          </div>
          <Button>Set new geofence</Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {['Koramangala HQ', 'HSR Service Zone'].map((zone) => (
            <Card key={zone} className="p-4">
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Active zone
              </p>
              <h3 className="text-lg font-semibold">{zone}</h3>
              <p className="text-sm text-slate-500">
                Radius 2.5 km · Alerts to Ops + Rider
              </p>
              <Button variant="outline" className="mt-4 w-full">
                Edit
              </Button>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <p className="text-xs uppercase tracking-widest text-slate-400">
          Security events
        </p>
        <div className="mt-4 space-y-3">
          {[
            'Geo-fence breach · Bike moved outside Koramangala safe zone.',
            'Immobilization command issued by Ops team.',
            'Tamper alert resolved · Seat latch secured.',
          ].map((log, index) => (
            <div
              key={log}
              className="rounded-2xl border border-slate-100/70 p-4 text-sm dark:border-white/5"
            >
              <p className="font-semibold">Event #{index + 1}</p>
              <p className="text-slate-500">{log}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

