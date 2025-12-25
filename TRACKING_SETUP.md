# User Tracking Feature Setup Guide

This feature tracks website visitors, their locations, and visit counts.

## Database Setup

### Neon Database (Production)

The application is configured to use **Neon Database** (serverless PostgreSQL).

1. **Environment Variables**:
   - The `DATABASE_URL` is already configured in `.env.local` pointing to Neon
   - Connection string format: `postgres://user:password@host/database?sslmode=require`

2. **Create Tables in Neon**:
   - Connect to your Neon database using the Neon console or any PostgreSQL client
   - Execute the SQL schema from `src/lib/db-schema.sql` to create the necessary tables
   - Or use the Neon SQL editor to run the schema

### Local PostgreSQL (Development)

For local development with Docker:

1. **Run the SQL schema** to create the necessary tables:
   ```bash
   psql -U postgres -d postgres -f src/lib/db-schema.sql
   ```
   
   Or manually execute the SQL from `src/lib/db-schema.sql` in your PostgreSQL database.

2. **Environment Variables**:
   - Set `DATABASE_URL` in your `.env.local` file (or use the default local connection)
   - Example: `DATABASE_URL=postgres://postgres:pass123@localhost:5433/postgres`

## Database Schema

### Users Table
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `phoneno` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Locations Table
- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR, FK to users.email)
- `location` (VARCHAR) - City, Region, Country
- `last_login` (TIMESTAMP)
- `login_date` (DATE)
- `number_of_logins_today` (INTEGER)
- `ip_address` (VARCHAR)
- `user_agent` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## How It Works

1. **Authentication Tracking**: When users log in via Google OAuth, the `/api/track-user` endpoint is called automatically to track their visit with location data.

2. **Anonymous Tracking**: The middleware tracks all page visits (including anonymous visitors) and stores them with a generated email based on IP address.

3. **Location Detection**: Uses IP geolocation via ip-api.com (free service) to determine visitor location.

4. **Daily Visit Counts**: Tracks the number of times a user visits from each location per day.

## API Endpoints

### POST `/api/track-user`
Tracks authenticated user visits. Called automatically during login.

**Body:**
```json
{
  "auth_id": "google_user_id",
  "username": "User Name",
  "email": "user@example.com",
  "phoneno": "optional"
}
```

### GET `/api/analytics`
Retrieves analytics data.

**Query Parameters:**
- `days` (optional): Number of days to look back (default: 7)
- `email` (optional): Filter by specific user email

**Response:**
```json
{
  "ok": true,
  "data": {
    "summary": {
      "total_users": 100,
      "active_users": 50,
      "total_visits": 500,
      "unique_locations": 25
    },
    "topLocations": [...],
    "dailyStats": [...]
  }
}
```

## Viewing Analytics

Visit `/admin/analytics` to see a dashboard with:
- Total users and active users
- Total visits and unique locations
- Top locations by visit count
- Daily statistics

## Notes

- Location detection uses a free IP geolocation service (ip-api.com)
- Anonymous visitors are tracked with email format: `anonymous_{ip}@visitor`
- Visit tracking is non-blocking and won't slow down your application
- All tracking happens asynchronously in the background

