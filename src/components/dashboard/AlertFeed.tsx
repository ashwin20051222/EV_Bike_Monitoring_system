import { ReactNode } from 'react';
import { AlertTriangle, BatteryCharging, ShieldAlert } from 'lucide-react';
import { Card } from '../ui/Card';
import { useRealtime } from '../../contexts/RealtimeContext';

const iconMap: Record<string, ReactNode> = {
  battery: <BatteryCharging size={16} />,
  security: <ShieldAlert size={16} />,
};

export function AlertFeed() {
  const { payload } = useRealtime();

  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-widest text-slate-400">
        Notifications
      </p>
      <div className="mt-4 space-y-3">
        {payload.alerts?.length ? (
          payload.alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center gap-3 rounded-2xl border border-slate-100/70 px-4 py-3 text-sm dark:border-white/5"
            >
              <div className="rounded-full bg-primary-500/10 p-2 text-primary-500">
                {iconMap[alert.type] ?? <AlertTriangle size={16} />}
              </div>
              <div>
                <p className="font-medium">{alert.message}</p>
                <p className="text-xs text-slate-500">{alert.timestamp}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">
            All quiet. You&apos;ll see alerts here when something needs
            attention.
          </p>
        )}
      </div>
    </Card>
  );
}

