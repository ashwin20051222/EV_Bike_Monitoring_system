export type Role = 'user' | 'admin';

export type Profile = {
  id: string;
  full_name: string | null;
  role: Role;
  theme_preference: 'light' | 'dark';
  created_at: string;
};

export type Bike = {
  id: string;
  owner_id: string;
  name: string;
  vin: string;
  esp_device_id: string | null;
  battery_capacity_kwh: number;
  created_at: string;
};

export type GPSData = {
  id: number;
  bike_id: string;
  lat: number;
  lng: number;
  speed_kmh: number;
  heading_deg: number;
  recorded_at: string;
};

export type BMSData = {
  id: number;
  bike_id: string;
  soc: number;
  voltage: number;
  current: number;
  temperature: number;
  health: number;
  recorded_at: string;
};

export type Trip = {
  id: string;
  bike_id: string;
  started_at: string;
  ended_at: string | null;
  distance_km: number | null;
  avg_speed_kmh: number | null;
  energy_wh: number | null;
  route_geojson: unknown | null;
  duration_min?: number | null;
  route_summary?: string | null;
};

export type Alert = {
  id: string;
  bike_id: string;
  type: 'battery' | 'security' | 'maintenance' | 'system';
  message: string;
  severity: 'info' | 'warning' | 'critical';
  created_at: string;
};

