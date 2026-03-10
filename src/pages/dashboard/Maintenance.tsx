import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const maintenanceItems = [
  {
    id: 'mnt-1',
    title: 'Brake pad inspection',
    schedule: 'Every 800km',
    status: 'Due in 150km',
  },
  {
    id: 'mnt-2',
    title: 'Battery thermal check',
    schedule: 'Monthly',
    status: 'Scheduled · Dec 3',
  },
  {
    id: 'mnt-3',
    title: 'Firmware OTA',
    schedule: 'Latest build v2.1.4',
    status: 'Ready to deploy',
  },
];

export function Maintenance() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Maintenance tracker
            </p>
            <h2 className="text-2xl font-semibold">Upcoming services</h2>
            <p className="text-sm text-slate-500">
              Track each bike’s service history, receipts and reminders.
            </p>
          </div>
          <Button>Add record</Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {maintenanceItems.map((item) => (
          <Card key={item.id} className="p-4">
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Task
            </p>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-slate-500">{item.schedule}</p>
            <p className="text-xs text-emerald-500">{item.status}</p>
            <Button variant="outline" className="mt-4 w-full">
              Update status
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

