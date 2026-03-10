# yoloracer pet - Implementation Roadmap & Setup Guide

## Quick Start

### Frontend Setup (React + TypeScript + Vite)
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### Backend Setup (Node.js + Express + PostgreSQL)
```bash
# Create backend directory
mkdir backend && cd backend

# Initialize Node project
npm init -y

# Install dependencies
npm install express cors dotenv pg @supabase/supabase-js jsonwebtoken bcryptjs
npm install --save-dev typescript @types/express @types/node ts-node

# Create .env file
cat > .env << EOF
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:5173
EOF

# Start server
npm run dev
```

---

## Implementation Phases

### Phase 1: Core Authentication & UI (Weeks 1-2)
**Deliverables:**
- Login/Signup pages with validation
- Floating side panel with theme toggle
- Admin login route
- Email verification flow

**Tasks:**
- [ ] Create responsive auth forms (Login.tsx, Signup.tsx)
- [ ] Implement FloatingPanel component with hamburger menu
- [ ] Set up theme switching in ThemeContext
- [ ] Add authentication middleware to backend
- [ ] Test sign-up → email verification → login flow

**Files:**
- `src/pages/auth/Login.tsx` ✅
- `src/pages/auth/Signup.tsx`
- `src/pages/auth/AdminLogin.tsx` ✅
- `src/components/layout/FloatingPanel.tsx` ✅
- `src/contexts/ThemeContext.tsx` ✅

---

### Phase 2: Device Provisioning & Telemetry (Weeks 3-4)
**Deliverables:**
- Device registration and API token generation
- Telemetry ingestion pipeline
- Telemetry data persistence

**Tasks:**
- [ ] Create device provisioning API endpoint
- [ ] Implement telemetry ingestion endpoint (POST /devices/:id/telemetry)
- [ ] Set up PostgreSQL time-series tables (Timescale)
- [ ] Create telemetry data models
- [ ] Build device simulator for testing
- [ ] Add device management to admin panel

**Backend Services:**
- Telemetry service (validates, stores, routes data)
- Device service (provisioning, token rotation)
- Auth service (device token validation)

**Database:**
- `telemetry` table (time-series)
- `devices` table
- `device_api_keys` table

---

### Phase 3: Dashboard & Visualization (Weeks 5-6)
**Deliverables:**
- Real-time GPS map with Leaflet
- Battery/BMS gauge and graphs
- Relay control UI
- Route history and playback

**Tasks:**
- [ ] Implement MapPanel with Leaflet
- [ ] Create BatteryGauge component with time-series graph
- [ ] Build RelayToggle with confirmation modal
- [ ] Display live GPS location on map
- [ ] Show historical routes as polylines
- [ ] Add route statistics (distance, avg speed, duration)

**Frontend Components:**
- `src/components/dashboard/MapPanel.tsx` ✅
- `src/components/dashboard/BatteryGauge.tsx` ✅
- `src/components/dashboard/RelayToggle.tsx` ✅
- `src/pages/dashboard/Overview.tsx` ✅
- `src/pages/dashboard/Routes.tsx` ✅
- `src/pages/dashboard/Charging.tsx` ✅

**API Endpoints Used:**
- `GET /devices/:id/telemetry`
- `GET /devices/:id/routes`
- `POST /devices/:id/commands`

---

### Phase 4: Admin Controls & Audit (Weeks 7-8)
**Deliverables:**
- Admin dashboard for user/device management
- Audit logging and admin actions tracking
- Database control panel
- System statistics and health monitoring

**Tasks:**
- [ ] Build admin user management table
- [ ] Add device provisioning UI in admin
- [ ] Implement user password reset (admin)
- [ ] Create audit log viewer
- [ ] Build system stats dashboard
- [ ] Add data export functionality

**Frontend Pages:**
- `src/pages/admin/AdminDashboard.tsx` ✅

**Backend Endpoints:**
- `GET /admin/users`
- `PUT /admin/users/:id`
- `DELETE /admin/users/:id`
- `POST /admin/devices`
- `GET /admin/audit-logs`
- `GET /admin/stats`

---

### Phase 5: Advanced Features (Weeks 9-10)
**Deliverables:**
- Real-time WebSocket updates
- Route replay and animation
- Google Maps integration (optional)
- Charging session tracking
- Environment & diagnostics pages

**Tasks:**
- [ ] Set up WebSocket server for live telemetry
- [ ] Implement route playback with speed control
- [ ] Add GPS reverse geocoding (Nominatim/Google)
- [ ] Create charging session tracker
- [ ] Build environment monitoring page
- [ ] Add maintenance records page

**Frontend Pages:**
- `src/pages/dashboard/Environment.tsx`
- `src/pages/dashboard/Maintenance.tsx`
- `src/pages/dashboard/Analytics.tsx`

**Backend Services:**
- WebSocket handler for real-time updates
- Route compression (Douglas-Peucker algorithm)
- Charging session aggregation

---

### Phase 6: Testing & Security (Weeks 11-12)
**Deliverables:**
- Comprehensive test suite
- Security hardening
- Performance optimization
- Deployment pipeline

**Tasks:**
- [ ] Unit tests for components and services
- [ ] Integration tests for API endpoints
- [ ] E2E tests for critical flows
- [ ] Security audit (OWASP Top 10)
- [ ] Load testing for telemetry ingestion
- [ ] Performance profiling (Lighthouse)
- [ ] Set up CI/CD pipeline (GitHub Actions)

**Testing Coverage:**
- Auth flows (sign-up, login, token refresh)
- Telemetry ingestion (validation, storage)
- Device commands (queuing, delivery)
- Admin operations (user management, audit logs)

---

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast builds
- **Tailwind CSS** for styling
- **Leaflet** for mapping
- **Supabase JS Client** for auth/realtime

### Backend
- **Node.js** with Express.js
- **PostgreSQL** with Timescale extension
- **Supabase** for auth and DB hosting
- **JWT** for token-based auth
- **MQTT** (optional) for device messaging

### Infrastructure
- **Supabase** (PostgreSQL, Auth, Realtime, Storage)
- **Docker** for containerization
- **GitHub Actions** for CI/CD
- **Vercel/Netlify** for frontend hosting
- **Railway/Render** for backend hosting

---

## Key Files & Components

### Frontend Structure
```
src/
├── pages/
│   ├── auth/
│   │   ├── Login.tsx ✅
│   │   ├── Signup.tsx
│   │   └── AdminLogin.tsx ✅
│   ├── admin/
│   │   └── AdminDashboard.tsx ✅
│   └── dashboard/
│       ├── Overview.tsx ✅
│       ├── Routes.tsx ✅
│       ├── Charging.tsx ✅
│       ├── Analytics.tsx
│       ├── Environment.tsx
│       ├── Maintenance.tsx
│       ├── Security.tsx
│       └── Reports.tsx
├── components/
│   ├── layout/
│   │   ├── FloatingPanel.tsx ✅
│   │   ├── AppLayout.tsx
│   │   └── AdminLayout.tsx
│   ├── dashboard/
│   │   ├── MapPanel.tsx ✅
│   │   ├── BatteryGauge.tsx ✅
│   │   ├── RelayToggle.tsx ✅
│   │   ├── TripList.tsx
│   │   ├── AlertFeed.tsx
│   │   └── StatTile.tsx
│   ├── ui/
│   │   ├── Button.tsx ✅
│   │   └── Card.tsx ✅
│   ├── routing/
│   │   ├── ProtectedRoute.tsx
│   │   └── AdminRoute.tsx
├── contexts/
│   ├── AuthContext.tsx ✅
│   ├── ThemeContext.tsx ✅
│   ├── BikeContext.tsx
│   └── RealtimeContext.tsx
├── services/
│   ├── api.ts ✅
│   └── telemetryService.ts
└── types/
    └── domain.ts ✅
```

### Backend Structure (To Create)
```
backend/
├── src/
│   ├── server.ts (main Express app)
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── devices.ts
│   │   ├── telemetry.ts
│   │   ├── commands.ts
│   │   └── admin.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── deviceService.ts
│   │   ├── telemetryService.ts
│   │   └── commandService.ts
│   ├── models/
│   │   └── types.ts
│   └── utils/
│       ├── db.ts (Supabase client)
│       └── validation.ts
├── tests/
│   ├── auth.test.ts
│   ├── telemetry.test.ts
│   └── commands.test.ts
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Database Schema

### Core Tables
- **users** - User accounts and profiles
- **devices** (bikes) - EV bike devices with ESP controllers
- **telemetry** - Time-series GPS, BMS, relay data
- **routes** - Trip history and route data
- **commands** - Device command queue and logs
- **admin_audit_log** - Admin actions for compliance
- **api_tokens** - Device authentication tokens
- **charging_sessions** - Battery charging history
- **alerts** - System alerts and notifications

See `supabase/schema.sql` for full schema.

---

## API Endpoints Reference

### Authentication
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`

### Telemetry
- `POST /api/v1/devices/:id/telemetry` (device sends data)
- `GET /api/v1/devices/:id/telemetry` (query historical)

### Commands
- `POST /api/v1/devices/:id/commands` (send command)
- `GET /api/v1/devices/:id/commands/:cmdId` (check status)

### Routes
- `GET /api/v1/devices/:id/routes`
- `GET /api/v1/devices/:id/routes/:routeId/polyline`
- `GET /api/v1/devices/:id/routes/:routeId.gpx`

### Admin
- `GET /api/v1/admin/users`
- `PUT /api/v1/admin/users/:id`
- `POST /api/v1/admin/devices`
- `GET /api/v1/admin/audit-logs`
- `GET /api/v1/admin/stats`

See `docs/API_CONTRACT.md` for full contract.

---

## Environment Variables

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api/v1
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Backend (.env)
```
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:5173
MQTT_BROKER_URL=mqtt://localhost:1883
```

---

## Testing Checklist

### Authentication
- [ ] Sign up with valid email/password
- [ ] Receive verification email
- [ ] Verify email and login
- [ ] Invalid credentials rejected
- [ ] Token refresh works
- [ ] Logout clears session

### Telemetry
- [ ] Device can send telemetry with valid token
- [ ] Invalid device token rejected
- [ ] GPS data persisted and queryable
- [ ] BMS data stored with correct schema
- [ ] Time-series queries perform efficiently
- [ ] Data retention policy works

### Dashboard
- [ ] Map loads and displays current location
- [ ] Routes load and polylines render
- [ ] Battery percentage updates in real-time
- [ ] Relay toggle sends command
- [ ] Command confirmation modal works
- [ ] Theme toggle persists

### Admin
- [ ] Admin can view all users
- [ ] Admin can reset user password
- [ ] Admin can provision devices and get token
- [ ] Audit log records admin actions
- [ ] Stats dashboard shows correct counts
- [ ] Non-admins cannot access admin panel

---

## Performance Targets

- Page load time: < 2 seconds
- API response time: < 500ms (p95)
- Telemetry ingestion: 10,000+ requests/second
- Map pan/zoom: 60 FPS
- Dashboard real-time update: < 1 second latency

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] CORS properly configured
- [ ] SSL/TLS enabled
- [ ] Rate limiting configured
- [ ] Monitoring & alerting set up
- [ ] Backup strategy implemented
- [ ] Disaster recovery plan documented

---

## Support & Documentation

- API Documentation: `docs/API_CONTRACT.md`
- Backend Server Template: `docs/BACKEND_SERVER.ts`
- Database Schema: `supabase/schema.sql`
- Development Guide: This file

For questions or issues, refer to the component-specific README files in each directory.
