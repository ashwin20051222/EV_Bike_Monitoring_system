import { supabase, hasSupabaseConfig } from '../lib/supabaseClient';
import type {
  Bike,
  GPSData,
  BMSData,
  Trip,
  Alert,
} from '../types/domain';
import {
  bikes as mockBikes,
  mockTrips,
  sampleRealtimePayload,
} from '../data/mockData';

const relayStateFromCommand = (
  command?: { command: string } | null,
  previous = sampleRealtimePayload.relay
) => {
  if (!command) return previous;
  switch (command.command) {
    case 'IGNITION_ON':
      return { ...previous, ignition: true };
    case 'IGNITION_OFF':
      return { ...previous, ignition: false };
    case 'IMMOBILIZE':
      return { ...previous, immobilized: true };
    case 'UNLOCK':
      return { ...previous, immobilized: false };
    default:
      return previous;
  }
};

export async function fetchBikes(): Promise<Bike[]> {
  if (!hasSupabaseConfig) {
    return mockBikes as unknown as Bike[];
  }
  const { data, error } = await supabase
    .from('bikes')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as Bike[];
}

export async function fetchLatestTelemetry(bikeId: string) {
  if (!hasSupabaseConfig) {
    return sampleRealtimePayload;
  }

  const [{ data: gps }, { data: bms }, { data: alerts }, { data: relayCommand }] =
    await Promise.all([
    supabase
      .from('gps_data')
      .select('*')
      .eq('bike_id', bikeId)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('bms_data')
      .select('*')
      .eq('bike_id', bikeId)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('alerts')
      .select('*')
      .eq('bike_id', bikeId)
      .order('created_at', { ascending: false })
      .limit(5),
      supabase
        .from('relay_commands')
        .select('*')
        .eq('bike_id', bikeId)
        .order('issued_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  return {
    gps: gps as GPSData | null,
    battery: bms as BMSData | null,
    alerts: ((alerts as Alert[]) ?? []).map((alert) => ({
      ...alert,
      timestamp: alert.created_at,
    })),
    relay: relayStateFromCommand(relayCommand),
  };
}

export async function fetchTrips(bikeId: string): Promise<Trip[]> {
  if (!hasSupabaseConfig) {
    return mockTrips.map((trip) => ({
      id: trip.id,
      bike_id: bikeId,
      started_at: new Date().toISOString(),
      ended_at: new Date().toISOString(),
      distance_km: trip.distanceKm,
      avg_speed_kmh: trip.distanceKm / (trip.durationMin / 60),
      energy_wh: trip.consumptionWh,
      duration_min: trip.durationMin,
      route_summary: `${trip.start} → ${trip.end}`,
      route_geojson: null,
    })) as Trip[];
  }

  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('bike_id', bikeId)
    .order('started_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data as Trip[];
}

export async function sendRelayCommand({
  bikeId,
  command,
  payload,
}: {
  bikeId: string;
  command: 'IGNITION_ON' | 'IGNITION_OFF' | 'IMMOBILIZE' | 'UNLOCK';
  payload?: Record<string, unknown>;
}) {
  if (!hasSupabaseConfig) {
    console.info('Mock relay command', { bikeId, command, payload });
    return;
  }

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/relay-control`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''
        }`,
      },
      body: JSON.stringify({ bikeId, command, payload }),
    }
  );

  if (!response.ok) {
    throw new Error(`Relay command failed: ${await response.text()}`);
  }

  return response.json();
}

export async function fetchAdminStats() {
  if (!hasSupabaseConfig) {
    return {
      userCount: 2,
      bikeCount: mockBikes.length,
      alertCount: sampleRealtimePayload.alerts.length,
    };
  }

  const [profiles, bikesCount, alerts] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('bikes').select('*', { count: 'exact', head: true }),
    supabase.from('alerts').select('*', { count: 'exact', head: true }),
  ]);

  return {
    userCount: profiles.count ?? 0,
    bikeCount: bikesCount.count ?? 0,
    alertCount: alerts.count ?? 0,
  };
}

