import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function Reports() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Reports center
            </p>
            <h2 className="text-2xl font-semibold">Export analytics</h2>
            <p className="text-sm text-slate-500">
              Daily, weekly or custom ranges. CSV and PDF supported.
            </p>
          </div>
          <Button>Generate report</Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-3">
          {[
            'Daily ride summary · 27 Nov 2025 · Ready',
            'Battery analytics · Last 7 days · Scheduled',
            'Maintenance log · November · Completed',
          ].map((report) => (
            <div
              key={report}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100/70 p-4 text-sm dark:border-white/5"
            >
              <p>{report}</p>
              <Button variant="outline">Download</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

