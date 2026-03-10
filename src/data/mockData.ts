export const bikes = [
  {
    id: 'bike-001',
    name: 'YoloRacer Pro',
    vin: 'YR-PRO-001',
    batteryCapacity: 5.4,
  },
  {
    id: 'bike-002',
    name: 'YoloRacer City',
    vin: 'YR-CITY-008',
    batteryCapacity: 4.8,
  },
] as const;

export const sampleRealtimePayload = {
  gps: {
    lat: 12.9716,
    lng: 77.5946,
    speed: 42,
    heading: 90,
  },
  battery: {
    soc: 78,
    voltage: 52.4,
    current: -18.5,
    temperature: 31.4,
    health: 92,
  },
  relay: {
    ignition: true,
    immobilized: false,
  },
  alerts: [
    {
      id: 'alert-1',
      type: 'battery',
      message: 'Battery at 78%, estimated 54km range remaining.',
      timestamp: '2 min ago',
    },
    {
      id: 'alert-2',
      type: 'security',
      message: 'Bike exited geofence zone: Koramangala',
      timestamp: '12 min ago',
    },
  ],
};

export const mockTrips = [
  {
    id: 'trip-1',
    start: 'Indiranagar',
    end: 'MG Road',
    distanceKm: 14.6,
    durationMin: 32,
    consumptionWh: 1100,
  },
  {
    id: 'trip-2',
    start: 'HSR Layout',
    end: 'Electronic City',
    distanceKm: 18.2,
    durationMin: 41,
    consumptionWh: 1320,
  },
] as const;

