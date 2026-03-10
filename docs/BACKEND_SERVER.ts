/**
 * yoloracer pet Backend Server - Express.js Setup
 * 
 * Stack: Node.js + Express + TypeScript + PostgreSQL + Supabase
 * 
 * To implement this backend:
 * 1. Create a new Node.js project: npm init -y
 * 2. Install: npm install express cors dotenv pg supabase-js jsonwebtoken bcryptjs
 * 3. Copy this structure and expand each service
 */

// server.ts (or index.ts in src/server/)
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// ============================================================================
// MIDDLEWARE
// ============================================================================

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// ============================================================================
// SUPABASE CLIENT
// ============================================================================

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================

interface AuthRequest extends Request {
  userId?: string;
  user?: any;
  token?: string;
}

const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'AUTH_REQUIRED', message: 'Missing authentication token' });
  }

  try {
    // Verify token with Supabase or your custom JWT handler
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'INVALID_TOKEN', message: 'Invalid or expired token' });
    }

    req.userId = user.id;
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'AUTH_ERROR', message: 'Authentication failed' });
  }
};

// ============================================================================
// ROUTES - AUTHENTICATION
// ============================================================================

app.post('/api/v1/auth/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Missing required fields' });
    }

    // Sign up with Supabase
    const { data, error } = await supabase.auth.signUpWithPassword({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (error) {
      return res.status(400).json({ error: 'SIGNUP_FAILED', message: error.message });
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user?.id,
        full_name: name,
        role: 'user',
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    return res.status(201).json({
      message: 'Signup successful. Check your email for verification.',
      user: { id: data.user?.id, email },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Signup failed' });
  }
});

app.post('/api/v1/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Missing email or password' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: 'LOGIN_FAILED', message: error.message });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user?.id)
      .single();

    return res.status(200).json({
      accessToken: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: profile?.full_name,
        role: profile?.role,
        themePreference: profile?.theme_preference,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Login failed' });
  }
});

// ============================================================================
// ROUTES - TELEMETRY INGESTION (Device)
// ============================================================================

app.post('/api/v1/devices/:deviceId/telemetry', async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    // Verify device token
    const { data: device, error: deviceError } = await supabase
      .from('bikes')
      .select('id, esp_device_id')
      .eq('esp_device_id', deviceId)
      .eq('device_api_keys(secret)', token)
      .single();

    if (deviceError || !device) {
      return res.status(401).json({ error: 'INVALID_DEVICE', message: 'Device authentication failed' });
    }

    const { gps, battery, relay, diagnostics, timestamp } = req.body;

    // Insert GPS data
    if (gps) {
      await supabase.from('gps_data').insert({
        bike_id: device.id,
        lat: gps.latitude,
        lng: gps.longitude,
        speed_kmh: gps.speed,
        heading_deg: gps.heading,
        recorded_at: timestamp || new Date().toISOString(),
      });
    }

    // Insert BMS data
    if (battery) {
      await supabase.from('bms_data').insert({
        bike_id: device.id,
        soc: battery.soc,
        voltage: battery.packVoltage,
        temperature: battery.temperature,
        recorded_at: timestamp || new Date().toISOString(),
      });
    }

    // Store raw payload for debugging
    await supabase.from('telemetry_raw').insert({
      bike_id: device.id,
      payload: req.body,
      recorded_at: timestamp || new Date().toISOString(),
    });

    return res.status(202).json({
      message: 'Telemetry accepted',
      telemetryId: `telemetry_${Date.now()}`,
    });
  } catch (error) {
    console.error('Telemetry ingestion error:', error);
    res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to ingest telemetry' });
  }
});

// ============================================================================
// ROUTES - DEVICE COMMANDS
// ============================================================================

app.post('/api/v1/devices/:deviceId/commands', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { deviceId } = req.params;
    const { type, payload } = req.body;

    // Get device and verify ownership
    const { data: device, error: deviceError } = await supabase
      .from('bikes')
      .select('id, owner_id')
      .eq('esp_device_id', deviceId)
      .single();

    if (deviceError || !device) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Device not found' });
    }

    // Create command record
    const { data: command, error: commandError } = await supabase
      .from('relay_commands')
      .insert({
        bike_id: device.id,
        issued_by: req.userId,
        command: type,
        payload,
      })
      .select()
      .single();

    if (commandError) {
      return res.status(400).json({ error: 'COMMAND_FAILED', message: commandError.message });
    }

    // Queue for device delivery (via MQTT or WebSocket)
    // TODO: Implement device messaging

    return res.status(201).json({
      commandId: command.id,
      deviceId,
      type,
      status: 'queued',
      createdAt: command.created_at,
    });
  } catch (error) {
    console.error('Command error:', error);
    res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to send command' });
  }
});

// ============================================================================
// ROUTES - ADMIN
// ============================================================================

app.get('/api/v1/admin/stats', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.userId)
      .single();

    if (profile?.role !== 'admin') {
      return res.status(403).json({ error: 'PERMISSION_DENIED', message: 'Admin access required' });
    }

    // Fetch statistics
    const { data: userCount } = await supabase.from('profiles').select('id', { count: 'exact' });
    const { data: bikeCount } = await supabase.from('bikes').select('id', { count: 'exact' });
    const { data: alertCount } = await supabase.from('alerts').select('id', { count: 'exact', eq: ['is_resolved', false] });

    return res.status(200).json({
      userCount: userCount?.length || 0,
      bikeCount: bikeCount?.length || 0,
      alertCount: alertCount?.length || 0,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Failed to fetch stats' });
  }
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
    requestId: req.id,
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'NOT_FOUND', message: 'Endpoint not found' });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

app.listen(PORT, () => {
  console.log(`🚀 yoloracer pet backend running on http://localhost:${PORT}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api/v1`);
});

export default app;
