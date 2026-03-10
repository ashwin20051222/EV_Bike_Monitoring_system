/**
 * yoloracer pet Backend API
 * 
 * This file documents the complete backend API contract for the yoloracer pet EV bike management app.
 * 
 * Base URL: https://api.yoloracer.pet/api/v1
 * Authentication: Bearer token in Authorization header
 */

// ============================================================================
// 1. AUTHENTICATION ENDPOINTS
// ============================================================================

/**
 * POST /auth/signup
 * Register a new user account
 * 
 * Request:
 * {
 *   "email": "user@example.com",
 *   "password": "securePassword123",
 *   "name": "John Doe"
 * }
 * 
 * Response (201):
 * {
 *   "accessToken": "eyJhbGciOiJIUzI1NiI...",
 *   "refreshToken": "eyJhbGciOiJIUzI1NiI...",
 *   "user": {
 *     "id": "user_001",
 *     "email": "user@example.com",
 *     "name": "John Doe",
 *     "role": "user",
 *     "themePreference": "dark",
 *     "createdAt": "2025-01-28T10:00:00Z"
 *   }
 * }
 */

/**
 * POST /auth/login
 * Authenticate user and get session tokens
 * 
 * Request:
 * {
 *   "email": "user@example.com",
 *   "password": "securePassword123"
 * }
 * 
 * Response (200):
 * {
 *   "accessToken": "eyJhbGciOiJIUzI1NiI...",
 *   "refreshToken": "eyJhbGciOiJIUzI1NiI...",
 *   "user": { ... } // same as signup response
 * }
 */

/**
 * POST /auth/refresh
 * Refresh access token using refresh token
 * 
 * Request:
 * {
 *   "refreshToken": "eyJhbGciOiJIUzI1NiI..."
 * }
 * 
 * Response (200):
 * {
 *   "accessToken": "eyJhbGciOiJIUzI1NiI..."
 * }
 */

/**
 * POST /auth/logout
 * Invalidate session tokens
 * 
 * Response (200):
 * {
 *   "message": "Logged out successfully"
 * }
 */

// ============================================================================
// 2. USER MANAGEMENT ENDPOINTS
// ============================================================================

/**
 * GET /users/profile
 * Get current user profile
 * 
 * Response (200):
 * {
 *   "id": "user_001",
 *   "email": "user@example.com",
 *   "name": "John Doe",
 *   "role": "user",
 *   "themePreference": "dark"
 * }
 */

/**
 * PUT /users/profile
 * Update user profile
 * 
 * Request:
 * {
 *   "name": "John Smith",
 *   "themePreference": "light"
 * }
 * 
 * Response (200):
 * { updated user object }
 */

/**
 * PUT /users/password
 * Change user password
 * 
 * Request:
 * {
 *   "currentPassword": "oldPassword123",
 *   "newPassword": "newPassword456"
 * }
 * 
 * Response (200):
 * {
 *   "message": "Password updated"
 * }
 */

// ============================================================================
// 3. DEVICE PROVISIONING (ADMIN)
// ============================================================================

/**
 * POST /admin/devices
 * Create new device (admin only)
 * 
 * Request:
 * {
 *   "name": "YoloRacer #001",
 *   "vin": "ABC123DEF456GHI789",
 *   "batteryCapacity": 50
 * }
 * 
 * Response (201):
 * {
 *   "id": "device_001",
 *   "apiToken": "token_abc123_xyz789",
 *   "name": "YoloRacer #001",
 *   "vin": "ABC123DEF456GHI789",
 *   "createdAt": "2025-01-28T10:00:00Z"
 * }
 */

/**
 * GET /admin/devices
 * List all devices (admin only)
 * 
 * Query parameters:
 *   - offset: number (default 0)
 *   - limit: number (default 50)
 *   - status: 'online' | 'offline' (optional filter)
 * 
 * Response (200):
 * {
 *   "devices": [ { device objects } ],
 *   "total": 15,
 *   "offset": 0,
 *   "limit": 50
 * }
 */

/**
 * GET /admin/devices/:deviceId
 * Get device details (admin only)
 * 
 * Response (200):
 * {
 *   "id": "device_001",
 *   "name": "YoloRacer #001",
 *   "vin": "ABC123DEF456GHI789",
 *   "ownerId": "user_001",
 *   "apiToken": "token_abc123_xyz789",
 *   "lastSeen": "2025-01-28T10:15:30Z",
 *   "status": "online"
 * }
 */

/**
 * PUT /admin/devices/:deviceId
 * Update device (admin only)
 * 
 * Request:
 * {
 *   "name": "YoloRacer #001 - Updated",
 *   "ownerId": "user_002"
 * }
 * 
 * Response (200):
 * { updated device object }
 */

/**
 * DELETE /admin/devices/:deviceId
 * Delete device (admin only)
 * 
 * Response (204): No content
 */

/**
 * POST /admin/devices/:deviceId/rotate-token
 * Rotate device API token (admin only)
 * 
 * Response (200):
 * {
 *   "newApiToken": "token_new_xyz789_abc123"
 * }
 */

// ============================================================================
// 4. TELEMETRY INGESTION (Device -> Backend)
// ============================================================================

/**
 * POST /devices/:deviceId/telemetry
 * Device uploads telemetry data
 * 
 * Headers:
 *   Authorization: Bearer {device_api_token}
 * 
 * Request:
 * {
 *   "timestamp": "2025-01-28T10:30:45Z",
 *   "gps": {
 *     "latitude": 40.7128,
 *     "longitude": -74.006,
 *     "speed": 18.5,
 *     "heading": 90,
 *     "accuracy": 5
 *   },
 *   "battery": {
 *     "soc": 84.5,
 *     "packVoltage": 52.3,
 *     "cellVoltages": [3.43, 3.44, 3.42, 3.43, ...],
 *     "temperature": 28,
 *     "current": 25.4
 *   },
 *   "relay": {
 *     "state": "ON",
 *     "voltage": 12.5
 *   },
 *   "diagnostics": {
 *     "faults": [],
 *     "warnings": ["high_temp"]
 *   }
 * }
 * 
 * Response (202):
 * {
 *   "message": "Telemetry accepted",
 *   "telemetryId": "telemetry_12345"
 * }
 */

/**
 * GET /devices/:deviceId/telemetry
 * Retrieve telemetry for a device (paginated, time-range filtered)
 * 
 * Query parameters:
 *   - start: ISO 8601 timestamp
 *   - end: ISO 8601 timestamp
 *   - limit: number (default 100, max 1000)
 *   - offset: number (default 0)
 * 
 * Response (200):
 * {
 *   "telemetry": [ { telemetry objects } ],
 *   "total": 5000,
 *   "limit": 100,
 *   "offset": 0
 * }
 */

// ============================================================================
// 5. DEVICE COMMANDS (Backend -> Device)
// ============================================================================

/**
 * POST /devices/:deviceId/commands
 * Issue a command to device
 * 
 * Request:
 * {
 *   "type": "RELAY_ON",
 *   "payload": {
 *     "relayId": "relay_1"
 *   }
 * }
 * 
 * Valid types: RELAY_ON, RELAY_OFF, REBOOT, FIRMWARE_UPDATE, SET_PARAM
 * 
 * Response (201):
 * {
 *   "commandId": "cmd_12345",
 *   "deviceId": "device_001",
 *   "type": "RELAY_ON",
 *   "status": "queued",
 *   "createdAt": "2025-01-28T10:30:45Z"
 * }
 */

/**
 * GET /devices/:deviceId/commands/:commandId
 * Get command status
 * 
 * Response (200):
 * {
 *   "commandId": "cmd_12345",
 *   "status": "acknowledged",
 *   "createdAt": "2025-01-28T10:30:45Z",
 *   "acknowledgedAt": "2025-01-28T10:30:50Z",
 *   "response": {
 *     "relayState": "ON"
 *   }
 * }
 */

// ============================================================================
// 6. ROUTES & TRIP ANALYTICS
// ============================================================================

/**
 * GET /devices/:deviceId/routes
 * Get recent routes/trips
 * 
 * Query parameters:
 *   - limit: number (default 20)
 *   - offset: number (default 0)
 * 
 * Response (200):
 * {
 *   "routes": [
 *     {
 *       "id": "route_001",
 *       "startTime": "2025-01-28T08:00:00Z",
 *       "endTime": "2025-01-28T08:45:00Z",
 *       "distance": 12.5,
 *       "averageSpeed": 16.7,
 *       "maxSpeed": 45,
 *       "duration": 2700,
 *       "energyConsumed": 3.2
 *     }
 *   ],
 *   "total": 150
 * }
 */

/**
 * GET /devices/:deviceId/routes/:routeId/polyline
 * Get polyline (waypoints) for a route
 * 
 * Response (200):
 * {
 *   "polyline": [
 *     { "lat": 40.7128, "lng": -74.006, "timestamp": "2025-01-28T08:00:00Z" },
 *     { "lat": 40.7150, "lng": -74.005, "timestamp": "2025-01-28T08:05:00Z" },
 *     ...
 *   ]
 * }
 */

/**
 * GET /devices/:deviceId/routes/:routeId/gpx
 * Export route as GPX file
 * 
 * Response (200):
 * [Content-Type: application/gpx+xml]
 * <?xml version="1.0" encoding="UTF-8"?>
 * <gpx version="1.1" ...>
 *   ...
 * </gpx>
 */

// ============================================================================
// 7. ADMIN - USER MANAGEMENT
// ============================================================================

/**
 * GET /admin/users
 * List all users (admin only)
 * 
 * Query parameters:
 *   - offset: number (default 0)
 *   - limit: number (default 50)
 *   - role: 'user' | 'admin' (optional filter)
 * 
 * Response (200):
 * {
 *   "users": [ { user objects } ],
 *   "total": 250
 * }
 */

/**
 * PUT /admin/users/:userId
 * Modify user account (admin only)
 * 
 * Request:
 * {
 *   "role": "admin",
 *   "name": "Jane Doe"
 * }
 * 
 * Response (200):
 * { updated user object }
 */

/**
 * POST /admin/users/:userId/reset-password
 * Reset user password (admin only)
 * 
 * Request:
 * {
 *   "newPassword": "tempPassword123!"
 * }
 * 
 * Response (200):
 * {
 *   "message": "Password reset successfully"
 * }
 */

/**
 * DELETE /admin/users/:userId
 * Delete user account (admin only)
 * 
 * Response (204): No content
 */

// ============================================================================
// 8. ADMIN - AUDIT LOGS
// ============================================================================

/**
 * GET /admin/audit-logs
 * Retrieve audit log entries (admin only)
 * 
 * Query parameters:
 *   - start: ISO 8601 timestamp
 *   - end: ISO 8601 timestamp
 *   - userId: string (filter by admin)
 *   - action: string (filter by action type)
 *   - limit: number (default 100)
 *   - offset: number (default 0)
 * 
 * Response (200):
 * {
 *   "logs": [
 *     {
 *       "id": "log_001",
 *       "adminId": "admin_001",
 *       "action": "user_deleted",
 *       "targetId": "user_123",
 *       "changes": { ... },
 *       "timestamp": "2025-01-28T10:30:45Z",
 *       "ipAddress": "192.168.1.1"
 *     }
 *   ],
 *   "total": 5000
 * }
 */

// ============================================================================
// 9. ADMIN - SYSTEM STATS
// ============================================================================

/**
 * GET /admin/stats
 * Get system statistics (admin only)
 * 
 * Response (200):
 * {
 *   "userCount": 250,
 *   "bikeCount": 145,
 *   "alertCount": 12,
 *   "telemetryPointsLastHour": 45000,
 *   "devicesOnline": 140,
 *   "devicesOffline": 5
 * }
 */

// ============================================================================
// ERROR RESPONSES
// ============================================================================

/**
 * All endpoints return standard error format:
 * 
 * (400) Bad Request:
 * {
 *   "error": "VALIDATION_ERROR",
 *   "message": "Email is invalid",
 *   "details": { ... }
 * }
 * 
 * (401) Unauthorized:
 * {
 *   "error": "AUTH_REQUIRED",
 *   "message": "Missing or invalid authentication token"
 * }
 * 
 * (403) Forbidden:
 * {
 *   "error": "PERMISSION_DENIED",
 *   "message": "You don't have permission to perform this action"
 * }
 * 
 * (404) Not Found:
 * {
 *   "error": "NOT_FOUND",
 *   "message": "Resource not found"
 * }
 * 
 * (429) Rate Limited:
 * {
 *   "error": "RATE_LIMITED",
 *   "message": "Too many requests",
 *   "retryAfter": 60
 * }
 * 
 * (500) Internal Server Error:
 * {
 *   "error": "INTERNAL_ERROR",
 *   "message": "An unexpected error occurred",
 *   "requestId": "req_12345"
 * }
 */

export const API_ENDPOINTS = {
  // Auth
  SIGNUP: '/auth/signup',
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',

  // User
  PROFILE: '/users/profile',
  PASSWORD: '/users/password',

  // Devices
  DEVICES: '/admin/devices',
  DEVICE_DETAIL: '/admin/devices/:deviceId',
  DEVICE_ROTATE_TOKEN: '/admin/devices/:deviceId/rotate-token',
  TELEMETRY: '/devices/:deviceId/telemetry',
  COMMANDS: '/devices/:deviceId/commands',
  COMMAND_STATUS: '/devices/:deviceId/commands/:commandId',
  ROUTES: '/devices/:deviceId/routes',
  ROUTE_POLYLINE: '/devices/:deviceId/routes/:routeId/polyline',
  ROUTE_GPX: '/devices/:deviceId/routes/:routeId/gpx',

  // Admin
  ADMIN_USERS: '/admin/users',
  ADMIN_USER: '/admin/users/:userId',
  ADMIN_RESET_PASSWORD: '/admin/users/:userId/reset-password',
  ADMIN_AUDIT_LOGS: '/admin/audit-logs',
  ADMIN_STATS: '/admin/stats',
};

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.yoloracer.pet/api/v1';
