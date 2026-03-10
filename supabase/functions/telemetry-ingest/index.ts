// deno-lint-ignore-file no-explicit-any
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const deviceKey = req.headers.get('x-device-key');
  const deviceId = req.headers.get('x-device-id');
  if (!deviceKey || !deviceId) {
    return new Response('Missing device credentials', { status: 401 });
  }

  const { data: keyRecord, error: keyError } = await supabase
    .from('device_api_keys')
    .select('*')
    .eq('device_id', deviceId)
    .eq('secret', deviceKey)
    .maybeSingle();

  if (
    keyError ||
    !keyRecord ||
    (keyRecord.expires_at && new Date(keyRecord.expires_at) < new Date())
  ) {
    return new Response('Invalid device key', { status: 403 });
  }

  const payload = await req.json();
  const { gps, battery } = payload as {
    gps?: { lat: number; lng: number; speed_kmh?: number; heading_deg?: number };
    battery?: { soc: number; voltage?: number; current?: number; temperature?: number; health?: number };
  };

  const inserts: Promise<any>[] = [];

  if (gps) {
    inserts.push(
      supabase.from('gps_data').insert({
        bike_id: keyRecord.bike_id,
        lat: gps.lat,
        lng: gps.lng,
        speed_kmh: gps.speed_kmh ?? 0,
        heading_deg: gps.heading_deg ?? 0,
      })
    );
  }

  if (battery) {
    inserts.push(
      supabase.from('bms_data').insert({
        bike_id: keyRecord.bike_id,
        soc: battery.soc,
        voltage: battery.voltage,
        current: battery.current,
        temperature: battery.temperature,
        health: battery.health ?? 100,
      })
    );
  }

  const results = await Promise.allSettled(inserts);
  const failed = results.find(
    (res) => res.status === 'rejected' || (res.status === 'fulfilled' && (res.value as any)?.error)
  );

  if (failed) {
    return new Response('Failed to persist telemetry', { status: 500 });
  }

  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

