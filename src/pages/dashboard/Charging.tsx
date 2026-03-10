import { BatteryCharging, MapPin, Star } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const stations = [
  {
    id: 'cs-1',
    name: 'VoltPoint Koramangala',
    distance: '2.1 km',
    speed: '120 kW',
    availability: '3 / 6 slots free',
    rating: 4.7,
  },
  {
    id: 'cs-2',
    name: 'GridSwap Indiranagar',
    distance: '4.6 km',
    speed: 'Battery swap',
    availability: '5 packs ready',
    rating: 4.5,
  },
];

export function Charging() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Charging network
            </p>
            <h2 className="text-2xl font-semibold">Nearby stations</h2>
            <p className="text-sm text-slate-500">
              Filter by distance, connector type and availability.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">Filters</Button>
            <Button>Reserve slot</Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {stations.map((station) => (
          <Card key={station.id} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  {station.distance}
                </p>
                <h3 className="text-lg font-semibold">{station.name}</h3>
                <p className="text-sm text-slate-500">{station.availability}</p>
              </div>
              <div className="rounded-full bg-primary-500/10 p-3 text-primary-500">
                <BatteryCharging size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span>{station.speed}</span>
              <span className="flex items-center gap-1 text-primary-500">
                <Star size={14} />
                {station.rating}
              </span>
            </div>
            <Button variant="outline" className="mt-4 w-full">
              <MapPin size={16} />
              Navigate
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

