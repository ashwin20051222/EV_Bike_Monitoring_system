# yoloracer pet - Deployment & DevOps Guide

## Production Deployment Overview

### Architecture Diagram
```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│        React.js App (Vercel/Netlify) - TLS/HTTPS               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    HTTPS/REST/WebSocket
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│              API GATEWAY / LOAD BALANCER                        │
│            (Cloudflare / AWS ALB)                               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼─────┐      ┌─────▼────┐      ┌────▼─────┐
   │ Backend  │      │ Telemetry│      │ WebSocket│
   │ Container│      │ Worker   │      │ Server   │
   │ (3x)     │      │(Serverless)      │(Redundant)
   └────┬─────┘      └─────┬────┘      └────┬─────┘
        │                  │                │
        └──────────────────┼────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼──────────┐  ┌───▼────┐      ┌─────▼─────┐
   │ PostgreSQL    │  │ Redis  │      │ S3/Blob   │
   │ + Timescale   │  │ Cache  │      │ Storage   │
   │ (RDS Primary) │  │        │      │           │
   └────┬──────────┘  └───┬────┘      └─────┬─────┘
        │                 │                 │
   ┌────▼──────────┐      │                 │
   │ RDS Replica   │      │                 │
   │ (Read-Only)   │      │                 │
   └───────────────┘      │                 │
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   ┌────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
   │ Monitoring│  │  Logging    │  │  Tracing    │
   │Prometheus │  │  (ELK/Loki) │  │ (Jaeger)    │
   │ Grafana   │  │             │  │             │
   └───────────┘  └─────────────┘  └─────────────┘
```

---

## Frontend Deployment

### Option 1: Vercel (Recommended for Next.js-like workflows)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add VITE_API_URL
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Connect to git for automatic deployments
# Just push to main branch and Vercel deploys automatically
```

### Option 2: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist

# Set environment variables in UI
# Settings > Environment > New variable
```

### Option 3: Docker + Self-Hosted
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and push image
docker build -t yoloracer-pet:latest .
docker tag yoloracer-pet:latest your-registry/yoloracer-pet:latest
docker push your-registry/yoloracer-pet:latest
```

---

## Backend Deployment

### Option 1: Railway (Easiest)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Connect to project
railway login

# Deploy
railway up

# Set environment variables
railway variables set SUPABASE_URL=...
railway variables set SUPABASE_ANON_KEY=...
```

### Option 2: Render
```bash
# Push to GitHub
git push origin main

# Connect repository in Render dashboard
# Auto-deploy on push

# Set environment variables in Render UI
```

### Option 3: AWS/GCP/Azure with Docker
```bash
# Build image
docker build -t yoloracer-backend:latest .

# Push to ECR/GCR/ACR
docker push your-registry/yoloracer-backend:latest

# Deploy to ECS/Cloud Run/Container Instances
# Or use Docker Compose with your orchestrator
```

### Docker Compose (Local/On-Premise)
```yaml
# docker-compose.yml
version: '3.9'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: yoloracer
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./supabase/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
      - ./supabase/seed.sql:/docker-entrypoint-initdb.d/02-seed.sql
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build: ./backend
    depends_on:
      - postgres
      - redis
    environment:
      NODE_ENV: production
      PORT: 5000
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/yoloracer
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      SUPABASE_URL: ${SUPABASE_URL}
      SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY}
    ports:
      - "5000:5000"
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

---

## Database Setup (Supabase)

### Initial Setup
```bash
# 1. Create Supabase project at https://supabase.com

# 2. Get credentials
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key"
export SUPABASE_SERVICE_KEY="your-service-key"

# 3. Run migrations
supabase link --project-ref your-project-ref
supabase push

# 4. Seed initial data
supabase db push --file supabase/seed.sql
```

### Backup Strategy
```bash
# Automated backups (Supabase handles daily backups automatically)

# Manual backup
pg_dump "postgresql://user:password@db.supabase.co:5432/postgres" > backup.sql

# Restore
psql "postgresql://user:password@db.supabase.co:5432/postgres" < backup.sql

# Enable point-in-time recovery (PITR) in Supabase dashboard
```

---

## CI/CD Pipeline (GitHub Actions)

### .github/workflows/deploy.yml
```yaml
name: Deploy yoloracer pet

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

jobs:
  frontend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build

  backend-test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      
      - working-directory: ./backend
        run: npm ci
      
      - working-directory: ./backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/postgres
        run: |
          npm run lint
          npm run type-check
          npm run test

  deploy-frontend:
    needs: frontend-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - run: npm ci
      - run: npm run build
      
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          production: true

  deploy-backend:
    needs: backend-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
          RAILWAY_PROJECT_ID: ${{ secrets.RAILWAY_PROJECT_ID }}
```

---

## Monitoring & Observability

### Prometheus Configuration
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'yoloracer-backend'
    static_configs:
      - targets: ['localhost:5000']
    metrics_path: '/metrics'
```

### Grafana Dashboards
- Request latency and throughput
- Database query performance
- Telemetry ingestion rate
- Active device connections
- Error rates by endpoint
- System resource usage (CPU, memory, disk)

### ELK Stack (Logging)
```bash
# Docker Compose for ELK
docker-compose -f docker-compose.elk.yml up

# Backend logs -> Elasticsearch -> Kibana
```

### Alerts
```yaml
# Alert rules (Prometheus AlertManager)
groups:
  - name: yoloracer
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        annotations:
          summary: "High error rate detected"
      
      - alert: TelemetryBacklog
        expr: telemetry_queue_size > 10000
        for: 10m
        annotations:
          summary: "Telemetry ingestion backlog building"
      
      - alert: DatabaseConnectionFailure
        expr: database_connections{status="error"} > 5
        for: 2m
        annotations:
          summary: "Database connection errors"
```

---

## Security Hardening

### HTTPS/TLS
```bash
# Generate self-signed certificate (development)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

# Production: Use Let's Encrypt with Certbot
certbot certonly --standalone -d yoloracer.pet

# Or use managed certs (Cloudflare, AWS ACM, etc.)
```

### Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// Stricter limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
});
app.use('/api/v1/auth/login', authLimiter);
```

### CORS Configuration
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
}));
```

### CSRF Protection
```typescript
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: true });
app.post('/api/v1/commands', csrfProtection, (req, res) => {
  // Endpoint protected by CSRF token
});
```

### Input Validation
```typescript
import { body, validationResult } from 'express-validator';

app.post('/api/v1/auth/login',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process login
  }
);
```

---

## Performance Optimization

### Frontend
```bash
# Code splitting
npm run build -- --report

# Asset compression
# Use gzip/brotli (Nginx/Vercel handles automatically)

# CDN caching headers
# Cache-Control: public, max-age=31536000 (for static assets)
```

### Backend
```typescript
// Database connection pooling
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Redis caching for frequently accessed data
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

// Telemetry batch writes
const telemetryBatcher = [];
const BATCH_SIZE = 1000;
const BATCH_TIMEOUT = 5000;

function addTelemetry(data) {
  telemetryBatcher.push(data);
  if (telemetryBatcher.length >= BATCH_SIZE) {
    flushTelemetry();
  }
}

function flushTelemetry() {
  if (telemetryBatcher.length > 0) {
    db.telemetry.insertMany(telemetryBatcher);
    telemetryBatcher.length = 0;
  }
}

setInterval(flushTelemetry, BATCH_TIMEOUT);
```

---

## Disaster Recovery

### RTO/RPO Targets
- **RTO (Recovery Time Objective)**: < 1 hour
- **RPO (Recovery Point Objective)**: < 15 minutes

### Backup Strategy
```bash
# Automated daily backups to S3
aws s3 sync /backup s3://yoloracer-backups/daily/

# Weekly full snapshots
aws ec2 create-snapshot --volume-id vol-xxxxx

# Test recovery quarterly
# Restore from backup to staging environment
```

### Failover Procedure
```bash
# 1. Monitor detects primary failure
# 2. Automatically promote read replica to primary
# 3. DNS updated to point to new primary
# 4. Alert sent to operations team
# 5. Analyze root cause and restore

# Expected downtime: 2-5 minutes
```

---

## Cost Optimization

### Estimated Monthly Costs (Production)
- Vercel (Frontend): ~$20/month
- Railway/Render (Backend): ~$50-100/month
- Supabase (PostgreSQL + Auth): ~$50-200/month
- S3 Storage (Backups, exports): ~$10-30/month
- Monitoring (Datadog/New Relic): ~$30-100/month
- **Total**: ~$160-450/month for small-to-medium scale

### Cost Reduction Tips
- Use Supabase's free tier for development
- Auto-scale backend during off-peak hours
- Implement data retention policies
- Use CloudFront/CDN for static assets
- Compress telemetry data before storage

---

## Deployment Checklist

### Pre-deployment
- [ ] Code review and approval
- [ ] All tests passing (unit, integration, e2e)
- [ ] Database migrations tested on staging
- [ ] Security scan completed
- [ ] Performance benchmarks meet targets
- [ ] Rollback procedure documented

### Deployment
- [ ] Deploy to staging first
- [ ] Smoke tests pass on staging
- [ ] Approve production deployment
- [ ] Deploy frontend
- [ ] Deploy backend
- [ ] Verify health checks
- [ ] Monitor error rates (30 minutes)

### Post-deployment
- [ ] All critical endpoints responding
- [ ] Database connections healthy
- [ ] Telemetry ingesting normally
- [ ] Real-time updates working
- [ ] Admin panel accessible
- [ ] Audit logs recording events

### Rollback Procedure
```bash
# If issues detected, rollback immediately
vercel rollback
railway revert
# Or restore from backup
```

---

## Support

For deployment issues:
1. Check logs: `vercel logs` or `railway logs`
2. Monitor dashboard (Grafana/Datadog)
3. Check database status (Supabase dashboard)
4. Contact platform support (Vercel, Railway, etc.)

See `IMPLEMENTATION_ROADMAP.md` for development notes.
