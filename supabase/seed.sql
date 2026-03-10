-- Demo admin profile (replace with your own UUID)
insert into auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
values (
  '11111111-1111-1111-1111-111111111111',
  'admin@yoloracer.pet',
  crypt('Admin@123', gen_salt('bf')),
  now(),
  '{"full_name": "Command Ops"}'
)
on conflict (id) do nothing;

insert into public.profiles (id, full_name, role)
values ('11111111-1111-1111-1111-111111111111', 'Command Ops', 'admin')
on conflict (id) do nothing;

-- Demo rider
insert into auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
values (
  '22222222-2222-2222-2222-222222222222',
  'rider@yoloracer.pet',
  crypt('Rider@123', gen_salt('bf')),
  now(),
  '{"full_name": "Rider One"}'
)
on conflict (id) do nothing;

insert into public.profiles (id, full_name, role)
values ('22222222-2222-2222-2222-222222222222', 'Rider One', 'user')
on conflict (id) do nothing;

-- Bikes
insert into public.bikes (id, owner_id, name, vin, esp_device_id, battery_capacity_kwh)
values
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaa0001', '22222222-2222-2222-2222-222222222222', 'YoloRacer Pro', 'YR-PRO-001', 'esp-pro-001', 5.4),
  ('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaa0002', '22222222-2222-2222-2222-222222222222', 'YoloRacer City', 'YR-CITY-008', 'esp-city-008', 4.8)
on conflict (id) do nothing;

-- Device keys
insert into public.device_api_keys (bike_id, device_id, secret)
values
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaa0001', 'esp-pro-001', 'demo-device-key-pro'),
  ('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaa0002', 'esp-city-008', 'demo-device-key-city')
on conflict (bike_id, device_id) do nothing;

-- Sample telemetry
insert into public.gps_data (bike_id, lat, lng, speed_kmh, heading_deg)
values
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaa0001', 12.9716, 77.5946, 42, 90),
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaa0001', 12.972, 77.598, 38, 88);

insert into public.bms_data (bike_id, soc, voltage, current, temperature, health)
values
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaa0001', 78, 52.4, -18.5, 31.4, 92),
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaa0001', 76, 52.1, -19.1, 31.7, 92);

insert into public.trips (bike_id, started_at, ended_at, distance_km, avg_speed_kmh, energy_wh, duration_min, route_summary)
values
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaa0001', now() - interval '3 hours', now() - interval '2 hours 30 minutes', 14.6, 27.5, 1100, 32, 'Indiranagar → MG Road'),
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaa0001', now() - interval '1 day', now() - interval '22 hours', 18.2, 26.6, 1320, 41, 'HSR Layout → Electronic City');

insert into public.alerts (bike_id, type, severity, message)
values
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaa0001', 'battery', 'info', 'Battery at 78%, estimated 54km range remaining.'),
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaa0001', 'security', 'warning', 'Bike exited geofence zone: Koramangala');

insert into public.relay_commands (bike_id, issued_by, command)
values
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaa0001', '22222222-2222-2222-2222-222222222222', 'IGNITION_ON');

