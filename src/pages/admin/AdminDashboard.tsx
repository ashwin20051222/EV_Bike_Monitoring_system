import { useEffect, useState } from 'react';
import { Shield, Users, AlertTriangle, Bike } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { fetchAdminStats } from '../../services/api';
import { useBike } from '../../contexts/BikeContext';

type AdminStats = {
  userCount: number;
  bikeCount: number;
  alertCount: number;
};

const defaultStats: AdminStats = {
  userCount: 2,
  bikeCount: 2,
  alertCount: 2,
};

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>(defaultStats);
  const [loading, setLoading] = useState(false);
  const { bikes } = useBike();

  useEffect(() => {
    let isMounted = true;
    const loadStats = async () => {
      try {
        setLoading(true);
        const result = await fetchAdminStats();
        if (isMounted) {
          setStats(result);
        }
      } catch (error) {
        console.warn('Falling back to default stats', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const statTiles = [
    {
      label: 'Registered users',
      value: stats.userCount,
      icon: <Users size={18} />,
    },
    {
      label: 'Fleet bikes',
      value: stats.bikeCount,
      icon: <Bike size={18} />,
    },
    {
      label: 'Open alerts',
      value: stats.alertCount,
      icon: <AlertTriangle size={18} />,
    },
  ];

  return (
    <div className="space-y-6 text-white">
      <Card className="bg-white/5 p-6 text-white">
        <p className="text-xs uppercase tracking-[0.4em] text-primary-300">
          Control room
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-semibold">Admin overview</h2>
            <p className="text-sm text-white/60">
              Provision bikes, manage accounts, and watch telemetry health.
            </p>
          </div>
          <Shield size={40} className="text-primary-300" />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {statTiles.map((stat) => (
          <Card key={stat.label} className="bg-white/5 p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-semibold">
                  {loading ? '...' : stat.value}
                </p>
              </div>
              <div className="rounded-full bg-primary-500/20 p-3 text-primary-200">
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="bg-white/5 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              Bikes
            </p>
            <h3 className="text-xl font-semibold">Device provisioning</h3>
            <p className="text-sm text-white/60">
              Overview of registered bikes and device IDs.
            </p>
          </div>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-white/50">
              <tr>
                <th className="pb-3 pr-4 font-medium">Bike</th>
                <th className="pb-3 pr-4 font-medium">VIN</th>
                <th className="pb-3 pr-4 font-medium">Battery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bikes.map((bike) => (
                <tr key={bike.id}>
                  <td className="py-3 pr-4">{bike.name}</td>
                  <td className="py-3 pr-4 text-white/60">{bike.vin}</td>
                  <td className="py-3 pr-4 text-white/60">
                    {bike.batteryCapacity} kWh
                  </td>
                </tr>
              ))}
              {!bikes.length && (
                <tr>
                  <td className="py-4 text-white/60" colSpan={3}>
                    No bikes registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

