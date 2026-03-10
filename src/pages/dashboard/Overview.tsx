import {
  Activity,
  BatteryCharging,
  MapPin,
  Route,
  Thermometer,
  Zap,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatTile } from '../../components/dashboard/StatTile';
import { BatteryGauge } from '../../components/dashboard/BatteryGauge';
import { RelayToggle } from '../../components/dashboard/RelayToggle';
import { AlertFeed } from '../../components/dashboard/AlertFeed';
import { TripList } from '../../components/dashboard/TripList';
import { MapPanel } from '../../components/dashboard/MapPanel';
import { useRealtime } from '../../contexts/RealtimeContext';

export function Overview() {
  const { payload } = useRealtime();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatTile
          label="GPS Position"
          value={`${payload.gps.lat.toFixed(4)}, ${payload.gps.lng.toFixed(4)}`}
          subtext="Live location"
          icon={<MapPin size={20} />}
        />
        <StatTile
          label="Speed"
          value={`${payload.gps.speed.toFixed(1)} km/h`}
          subtext="Avg 38 km/h"
          icon={<Route size={20} />}
        />
        <StatTile
          label="Battery health"
          value={`${payload.battery.health}%`}
          subtext="Predictive maintenance: green"
          icon={<Activity size={20} />}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Battery management
              </p>
              <h2 className="text-xl font-semibold">Live SoC</h2>
            </div>
            <BatteryCharging className="text-primary-500" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <BatteryGauge
              value={payload.battery.soc}
              label="State of charge"
              subtitle="Projected range: 54 km"
            />
            <div className="rounded-2xl border border-slate-100/70 p-5 text-sm dark:border-white/5">
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Pack telemetry
              </p>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center justify-between">
                  <span>Voltage</span>
                  <span>{payload.battery.voltage.toFixed(1)} V</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Current</span>
                  <span>{payload.battery.current.toFixed(1)} A</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Temperature</span>
                  <span>{payload.battery.temperature.toFixed(1)} ℃</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Map view
              </p>
              <h2 className="text-xl font-semibold">Live GPS feed</h2>
            </div>
            <Thermometer className="text-primary-500" />
          </div>
          <MapPanel
            lat={payload.gps.lat}
            lng={payload.gps.lng}
            label="YoloRacer Pro"
          />
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <RelayToggle />
          <TripList />
        </div>
        <div className="space-y-6">
          <AlertFeed />
          <Card className="p-5">
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Charging insights
            </p>
            <div className="mt-4 rounded-2xl border border-slate-100/70 p-4 text-sm dark:border-white/5">
              <div className="flex items-center justify-between">
                <span>Next optimal charge</span>
                <span className="font-semibold">09:30 PM</span>
              </div>
              <p className="text-xs text-slate-500">
                Based on predictive analytics and station availability.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-100/70 p-4 text-sm dark:border-white/5">
              <Zap className="text-primary-500" size={18} />
              <div>
                <p className="font-semibold">Nearest fast charger</p>
                <p className="text-xs text-slate-500">2.1km • 120kW • Slots 3</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

