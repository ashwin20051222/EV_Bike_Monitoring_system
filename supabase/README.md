## Supabase Backend

This directory contains everything required to provision the YoloRacer Pet backend:

- `schema.sql` – core tables, extensions, row-level security policies, helper functions and views.
- `seed.sql` – safe sample data for local development (demo admin, bikes, telemetry).
- `functions/` – Supabase Edge Functions for relay control and IoT telemetry ingestion.
- `config.toml` – Supabase project configuration.

### Quickstart

```bash
npm i -g supabase
supabase start
supabase db reset --use-migra --file supabase/schema.sql
supabase db reset --use-migra --file supabase/seed.sql
supabase functions serve relay-control
```

Set the following `.env` variables (and mirror them in `supabase/seed.sql` if you want different defaults):

```
VITE_SUPABASE_URL=<local supabase url>
VITE_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key> # for Edge Functions
```

### Edge Functions

| Function | Description |
| --- | --- |
| `relay-control` | Authenticates the caller, validates bike ownership, and records remote relay commands while broadcasting to realtime listeners. |
| `telemetry-ingest` | Authenticated endpoint for ESP devices to post GPS/BMS payloads using per-device API keys. Inserts rows into `gps_data`, `bms_data`, and optionally generates alerts. |

Both functions expect headers:

- `Authorization: Bearer <service or anon key>`
- `x-device-key: <api key>` (telemetry ingest only)

### Database Roles

- **Users** authenticate via Supabase Auth and automatically get a row in `profiles`.
- **Admins** have `profiles.role = 'admin'` and bypass most RLS restrictions.
- **Devices** use the `device_api_keys` table; each key is scoped to a bike/device pair with expiration and optional IP allowlist.

### Realtime Channels

`RealtimeProvider` in the frontend listens to `postgres_changes` on `gps_data`, `bms_data`, `alerts`, and `relay_commands`. When you deploy Supabase, make sure replication is enabled on those tables (on by default).

