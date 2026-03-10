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

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response('Missing auth header', { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: user, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user.user) {
    return new Response('Invalid session', { status: 401 });
  }

  const body = await req.json();
  const { bikeId, command, payload } = body as {
    bikeId?: string;
    command?: 'IGNITION_ON' | 'IGNITION_OFF' | 'IMMOBILIZE' | 'UNLOCK';
    payload?: Record<string, unknown>;
  };

  if (!bikeId || !command) {
    return new Response('bikeId and command are required', { status: 400 });
  }

  const { data: bikeOwnership } = await supabase
    .from('bikes')
    .select('owner_id')
    .eq('id', bikeId)
    .limit(1)
    .maybeSingle();

  if (
    !bikeOwnership ||
    !(
      bikeOwnership.owner_id === user.user.id ||
      user.user.app_metadata.role === 'admin'
    )
  ) {
    return new Response('Forbidden', { status: 403 });
  }

  const { data, error } = await supabase
    .from('relay_commands')
    .insert({
      bike_id: bikeId,
      issued_by: user.user.id,
      command,
      payload: payload ?? {},
    })
    .select('*')
    .single();

  if (error) {
    return new Response(error.message, { status: 400 });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});

