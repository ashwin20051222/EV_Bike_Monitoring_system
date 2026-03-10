## Backend Roadmap

1. **Supabase project setup**
   - `supabase start` to run a local stack or create a hosted project.
   - Apply `supabase/schema.sql` and `supabase/seed.sql`.
   - Create anon + service role keys and inject them into `.env`.

2. **Edge Functions**
   - Deploy `relay-control` for remote commands.
   - Deploy `telemetry-ingest` for ESP devices (HTTP POST with `x-device-id` + `x-device-key`).
   - Add API policies/rate limits (Supabase Platform > API > Policies).

3. **IoT device workflow**
   - Provision an entry in `device_api_keys` per bike/ESP.
   - Firmware hits `telemetry-ingest` every N seconds with GPS/BMS JSON.
   - Command acknowledgements come via Supabase Realtime or a long-poll endpoint.

4. **Admin tooling**
   - Admin UI will call Supabase RPCs or Edge Functions to:
     - Create bikes and device keys.
     - Trigger firmware updates.
     - Run advanced queries (analytics, reporting).

5. **Analytics jobs**
   - Add scheduled Supabase cron or external worker to compute predictive battery analytics and aggregate ride stats into summary tables.

