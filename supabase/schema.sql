-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";

-- Profiles table mirrors auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  theme_preference text not null default 'dark' check (theme_preference in ('light', 'dark')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Bikes
create table if not exists public.bikes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  vin text not null unique,
  esp_device_id text unique,
  battery_capacity_kwh numeric(5,2) not null default 5.50,
  created_at timestamptz not null default now()
);

-- Device API keys
create table if not exists public.device_api_keys (
  id uuid primary key default gen_random_uuid(),
  bike_id uuid not null references public.bikes(id) on delete cascade,
  device_id text not null,
  secret text not null,
  expires_at timestamptz,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (bike_id, device_id)
);

-- GPS telemetry
create table if not exists public.gps_data (
  id bigserial primary key,
  bike_id uuid not null references public.bikes(id) on delete cascade,
  lat double precision not null,
  lng double precision not null,
  speed_kmh double precision not null default 0,
  heading_deg double precision not null default 0,
  recorded_at timestamptz not null default now()
);
create index if not exists idx_gps_bike_time on public.gps_data (bike_id, recorded_at desc);

-- Battery telemetry
create table if not exists public.bms_data (
  id bigserial primary key,
  bike_id uuid not null references public.bikes(id) on delete cascade,
  soc double precision not null check (soc between 0 and 100),
  voltage double precision,
  current double precision,
  temperature double precision,
  health double precision check (health between 0 and 100),
  recorded_at timestamptz not null default now()
);
create index if not exists idx_bms_bike_time on public.bms_data (bike_id, recorded_at desc);

-- Trips
create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  bike_id uuid not null references public.bikes(id) on delete cascade,
  started_at timestamptz not null,
  ended_at timestamptz,
  distance_km numeric(8,2),
  avg_speed_kmh numeric(6,2),
  energy_wh numeric(10,2),
  duration_min numeric(8,2),
  route_geojson jsonb,
  route_summary text,
  created_at timestamptz not null default now()
);

-- Relay commands
create table if not exists public.relay_commands (
  id uuid primary key default gen_random_uuid(),
  bike_id uuid not null references public.bikes(id) on delete cascade,
  issued_by uuid references auth.users(id),
  command text not null check (command in ('IGNITION_ON','IGNITION_OFF','IMMOBILIZE','UNLOCK')),
  payload jsonb default '{}'::jsonb,
  issued_at timestamptz not null default now()
);
create index if not exists idx_relay_bike_time on public.relay_commands (bike_id, issued_at desc);

-- Geofences
create table if not exists public.geofences (
  id uuid primary key default gen_random_uuid(),
  bike_id uuid not null references public.bikes(id) on delete cascade,
  name text not null,
  zone geography(polygon, 4326) not null,
  notify_email boolean default true,
  notify_push boolean default true,
  created_at timestamptz not null default now()
);

-- Alerts
create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  bike_id uuid not null references public.bikes(id) on delete cascade,
  type text not null check (type in ('battery','security','maintenance','system')),
  severity text not null check (severity in ('info','warning','critical')),
  message text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_alerts_bike_time on public.alerts (bike_id, created_at desc);

-- Maintenance logs
create table if not exists public.maintenance_logs (
  id uuid primary key default gen_random_uuid(),
  bike_id uuid not null references public.bikes(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'scheduled' check (status in ('scheduled','in_progress','done')),
  mileage_km numeric(8,2),
  cost_currency text default 'INR',
  cost_amount numeric(10,2),
  service_center text,
  scheduled_for timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Charging stations cache
create table if not exists public.charging_stations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  coordinates geography(point, 4326) not null,
  connector_types text[] default '{TYPE2,CCS}',
  max_kw numeric(6,2),
  availability jsonb default '{}'::jsonb,
  rating numeric(2,1),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Notification preferences
create table if not exists public.notification_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  push boolean default true,
  email boolean default true,
  sms boolean default false,
  created_at timestamptz not null default now(),
  unique(user_id)
);

-- Row Level Security Policies
alter table public.bikes enable row level security;
alter table public.gps_data enable row level security;
alter table public.bms_data enable row level security;
alter table public.trips enable row level security;
alter table public.relay_commands enable row level security;
alter table public.geofences enable row level security;
alter table public.alerts enable row level security;
alter table public.maintenance_logs enable row level security;

create policy "Users see own bikes"
  on public.bikes
  for select using (
    owner_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Users insert own bikes"
  on public.bikes
  for insert with check (owner_id = auth.uid());

create policy "Users update own bikes"
  on public.bikes
  for update using (owner_id = auth.uid());

create policy "Users read own telemetry" on public.gps_data
  for select using (
    bike_id in (select id from public.bikes where owner_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Users read own battery" on public.bms_data
  for select using (
    bike_id in (select id from public.bikes where owner_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Users manage own trips"
  on public.trips
  using (
    bike_id in (select id from public.bikes where owner_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    bike_id in (select id from public.bikes where owner_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Users manage own alerts"
  on public.alerts
  using (
    bike_id in (select id from public.bikes where owner_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    bike_id in (select id from public.bikes where owner_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Users manage own relay commands"
  on public.relay_commands
  using (
    bike_id in (select id from public.bikes where owner_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    bike_id in (select id from public.bikes where owner_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Users manage own maintenance logs"
  on public.maintenance_logs
  using (
    bike_id in (select id from public.bikes where owner_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    bike_id in (select id from public.bikes where owner_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Device key validation function
create or replace function public.validate_device_key(device text, device_secret text)
returns uuid
language plpgsql
as $$
declare
  bike uuid;
begin
  select bike_id into bike
  from public.device_api_keys
  where device_id = device
    and secret = device_secret
    and (expires_at is null or expires_at > now());

  return bike;
end;
$$;

