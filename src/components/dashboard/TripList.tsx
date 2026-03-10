import { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { useBike } from '../../contexts/BikeContext';
import { fetchTrips } from '../../services/api';
import type { Trip } from '../../types/domain';
import { mockTrips } from '../../data/mockData';

export function TripList() {
  const { activeBike } = useBike();
  const [trips, setTrips] = useState<Trip[]>(
    mockTrips.map((trip) => ({
      id: trip.id,
      bike_id: 'mock-bike',
      started_at: new Date().toISOString(),
      ended_at: new Date().toISOString(),
      distance_km: trip.distanceKm,
      avg_speed_kmh: trip.distanceKm / (trip.durationMin / 60),
      energy_wh: trip.consumptionWh,
      route_geojson: null,
      duration_min: trip.durationMin,
      route_summary: `${trip.start} → ${trip.end}`,
    }))
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!activeBike?.id) return;
    const loadTrips = async () => {
      try {
        setLoading(true);
        const data = await fetchTrips(activeBike.id);
        if (isMounted && data.length) {
          setTrips(data);
        }
      } catch (error) {
        console.warn('Using mock trips', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadTrips();
    return () => {
      isMounted = false;
    };
  }, [activeBike?.id]);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">
            Recent rides
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Past 48 hours
          </p>
        </div>
        <button className="text-xs font-medium text-primary-500">
          View all
        </button>
      </div>
      <div className="mt-4 space-y-3">
        {loading && (
          <p className="text-xs text-slate-500">Syncing trip history...</p>
        )}
        {trips.length === 0 && !loading && (
          <p className="text-xs text-slate-500">No trips recorded yet.</p>
        )}
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="rounded-2xl border border-slate-100/70 p-4 dark:border-white/5"
          >
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>{trip.route_summary ?? 'Trip'}</span>
              <span>{trip.distance_km ?? 0} km</span>
            </div>
            <p className="text-xs text-slate-500">
              {trip.duration_min ?? '--'} min · {trip.energy_wh ?? '--'} Wh
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

