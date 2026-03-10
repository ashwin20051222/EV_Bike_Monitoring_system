# yoloracer pet 🚴‍♂️⚡

**EV Bike Management & Telemetry Platform**

A modern, full-stack application for managing electric bikes with real-time GPS tracking, battery monitoring, remote relay control, and comprehensive admin management.

---

## 🎯 Features

### For Riders
✅ **Real-time GPS Tracking** — View live bike location on interactive maps
✅ **Battery Monitoring** — Track SOC%, voltage, temperature, and health
✅ **Route History** — Access past trips with distance, speed, and energy data
✅ **Relay Control** — Toggle bike relays directly from the app
✅ **Theme Toggle** — Switch between dark and light modes
✅ **Trip Analytics** — View detailed statistics for each journey

### For Admins
✅ **User Management** — Create, edit, delete user accounts
✅ **Device Provisioning** — Generate API tokens for bike devices
✅ **System Monitoring** — Real-time stats (users, bikes, alerts)
✅ **Audit Logging** — Track all admin actions for compliance
✅ **Bulk Data Export** — Export routes as GPX files
✅ **Performance Dashboard** — Monitor system health and alerts

---

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Leaflet
- **Backend**: Node.js + Express.js + PostgreSQL (Timescale extension)
- **Authentication**: Supabase Auth + JWT
- **Hosting**: Vercel (Frontend) + Railway/Render (Backend)
- **Database**: Supabase PostgreSQL + TimescaleDB
- **Real-time**: WebSockets for live telemetry updates

### System Diagram
```
┌─────────────────────────────────────┐
│    ESP Device on Bike (IoT)        │
│  Sends GPS, BMS, Relay data        │
└────────────────┬────────────────────┘
                 │ HTTPS/MQTT
                 ▼
┌─────────────────────────────────────┐
│   Backend API Server (Node.js)      │
│  • Telemetry ingestion              │
│  • Device commands                  │
│  • Auth & authorization             │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│  PostgreSQL + TimescaleDB           │
│  • Time-series telemetry            │
│  • User & device data               │
│  • Command audit logs               │
└─────────────────────────────────────┘
                 ▲
                 │
┌─────────────────────────────────────┐
│   React Frontend (Vite)             │
│  • Dashboard with real-time updates │
│  • Interactive maps (Leaflet)       │
│  • Admin controls                   │
└─────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (https://supabase.com)

### Frontend Setup
```bash
# Clone repository
git clone https://github.com/yourusername/yoloracer-pet.git
cd yoloracer-pet

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Edit with your Supabase credentials
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key

# Start dev server
npm run dev

# Open http://localhost:5173
```

### Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env
cp .env.example .env

# Edit with your credentials
# DATABASE_URL=postgresql://user:password@localhost:5432/yoloracer
# JWT_SECRET=your-secret-key

# Start server
npm run dev

# API runs on http://localhost:5000/api/v1
```

### Database Setup (Supabase)
```bash
# Create a Supabase project at https://supabase.com

# Import schema
# 1. Go to SQL Editor in Supabase dashboard
# 2. Create a new query
# 3. Copy contents of supabase/schema.sql
# 4. Execute

# Or use Supabase CLI
supabase link --project-ref your-project-ref
supabase db push
```

---

## 📖 Documentation

- **[API Contract](docs/API_CONTRACT.md)** — Complete REST API reference with examples
- **[Implementation Roadmap](docs/IMPLEMENTATION_ROADMAP.md)** — Development phases and task breakdown
- **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** — Production deployment steps and best practices
- **[Database Schema](supabase/schema.sql)** — PostgreSQL schema with TimescaleDB
- **[Backend Server Template](docs/BACKEND_SERVER.ts)** — Express.js server skeleton

---

## 🔑 Key Endpoints

### Authentication
- `POST /api/v1/auth/signup` — Register new user
- `POST /api/v1/auth/login` — Authenticate user
- `POST /api/v1/auth/refresh` — Refresh access token

### Telemetry (Device → Backend)
- `POST /api/v1/devices/:id/telemetry` — Device sends GPS/BMS data

### Dashboard (Frontend → Backend)
- `GET /api/v1/devices/:id/telemetry` — Fetch historical telemetry
- `GET /api/v1/devices/:id/routes` — Get route list
- `GET /api/v1/devices/:id/routes/:routeId/polyline` — Get route waypoints

### Commands
- `POST /api/v1/devices/:id/commands` — Send relay toggle command
- `GET /api/v1/devices/:id/commands/:cmdId` — Check command status

### Admin
- `GET /api/v1/admin/users` — List all users
- `GET /api/v1/admin/devices` — List all devices
- `GET /api/v1/admin/audit-logs` — View admin actions
- `GET /api/v1/admin/stats` — System statistics

See [API_CONTRACT.md](docs/API_CONTRACT.md) for full details.

---

## 📂 Project Structure

```
yoloracer-pet/
├── src/
│   ├── pages/
│   │   ├── auth/              # Login, Signup, Admin login
│   │   ├── admin/             # Admin dashboard
│   │   └── dashboard/         # User dashboard pages
│   ├── components/
│   │   ├── layout/            # Layouts, FloatingPanel
│   │   ├── dashboard/         # Dashboard widgets (Map, Battery, etc.)
│   │   ├── ui/                # Reusable UI components
│   │   └── routing/           # Route guards
│   ├── contexts/              # React contexts (Auth, Theme, etc.)
│   ├── services/              # API calls
│   ├── types/                 # TypeScript types
│   └── main.tsx
├── backend/                   # Express.js server
│   ├── src/
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Auth, error handling
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── supabase/
│   ├── schema.sql             # Database schema
│   ├── seed.sql               # Sample data
│   └── config.toml            # Supabase config
├── docs/
│   ├── API_CONTRACT.md        # API documentation
│   ├── IMPLEMENTATION_ROADMAP.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── BACKEND_SERVER.ts
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 🧪 Testing

```bash
# Frontend tests
npm run test
npm run test:watch
npm run test:coverage

# Backend tests
cd backend && npm run test

# E2E tests (Playwright)
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

---

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ Role-based access control (RBAC) - User vs Admin
- ✅ Device token validation for telemetry
- ✅ HTTPS/TLS encryption
- ✅ Rate limiting on sensitive endpoints
- ✅ CORS protection
- ✅ Input validation & sanitization
- ✅ SQL injection protection (parameterized queries)
- ✅ Audit logging for all admin actions
- ✅ Password hashing (bcrypt)

---

## 📊 Performance

### Target Metrics
- **Page Load**: < 2 seconds
- **API Response**: < 500ms (p95)
- **Telemetry Ingestion**: 10,000+ requests/second
- **Map Rendering**: 60 FPS
- **Real-time Update Latency**: < 1 second

### Optimizations
- Code splitting and lazy loading
- Redis caching for hot data
- Database query optimization with indexes
- TimescaleDB for efficient time-series storage
- Batch telemetry writes
- CDN for static assets

---

## 🐛 Troubleshooting

### Frontend not connecting to backend
```bash
# Check VITE_API_URL in .env.local
# Ensure backend is running on port 5000
# Check CORS settings in backend
```

### Telemetry not being ingested
```bash
# Verify device API token is correct
# Check backend logs: npm run dev
# Ensure database connection is active
```

### Admin panel not accessible
```bash
# Verify user role is 'admin' in profiles table
# Check authentication token expiry
# Clear browser cache and login again
```

### Database migration errors
```bash
# Reset database: supabase db reset
# Reapply schema: supabase db push
# Check schema.sql for syntax errors
```

---

## 🚀 Deployment

### Quick Deploy to Vercel (Frontend)
```bash
npm install -g vercel
vercel
```

### Quick Deploy to Railway (Backend)
```bash
npm install -g @railway/cli
railway login
railway up
```

See [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 📈 Roadmap

- [x] Core authentication & login UI
- [x] Floating side panel with theme toggle
- [x] Admin dashboard (basic)
- [ ] Real-time GPS tracking with Leaflet
- [ ] Battery monitoring charts
- [ ] Relay control interface
- [ ] Route history and replay
- [ ] WebSocket real-time updates
- [ ] Email alerts and notifications
- [ ] Mobile app (React Native)
- [ ] Google Maps integration option
- [ ] OTA firmware updates

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Code Style:**
- Use TypeScript for type safety
- Follow Prettier formatting
- Write tests for new features
- Document complex logic

---

## 📄 License

This project is licensed under the MIT License — see LICENSE file for details.

---

## 💬 Support

For questions or issues:
- Open a GitHub issue
- Check [FAQ](docs/FAQ.md)
- Email: ashwin.sukumar2005@gmail.com

---

## 🙏 Acknowledgments

- **Leaflet** for amazing mapping library
- **Supabase** for backend infrastructure
- **React** and **Vite** communities
- All contributors and testers

---

**Ready to go? Start with:**
1. Follow [Quick Start](#quick-start) above
2. Read [API_CONTRACT.md](docs/API_CONTRACT.md) to understand endpoints
3. Check [IMPLEMENTATION_ROADMAP.md](docs/IMPLEMENTATION_ROADMAP.md) for development phases
4. Deploy using [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)

**Happy coding! 🚀**

