# Booking Settings Endpoint Added - December 7, 2024

## Problem
Frontend was making requests to a non-existent endpoint:
```
PUT https://lyx-api.fly.dev/api/orgs/{orgId}/booking-settings
404 (Not Found)
```

Error in browser console:
```
[OrgSettings] Booking settings endpoint returned non-OK status
```

## Root Cause
The `/api/orgs/:orgId/booking-settings` endpoint was never implemented in the API, but the frontend expected it to exist for managing booking-related settings (business hours, timezone, etc.).

## Solution
Added two new endpoints to `lyx-api/routes/orgSettings.mjs`:

### GET /api/orgs/:orgId/booking-settings
Returns booking-specific settings for an organization.

**Response:**
```json
{
  "businessHours": {
    "monday": { "open": "08:00", "close": "17:00" },
    "tuesday": { "open": "08:00", "close": "17:00" },
    ...
  },
  "timezone": "Europe/Oslo",
  "enabledModules": ["booking", "crm", ...]
}
```

### PUT /api/orgs/:orgId/booking-settings
Updates booking-specific settings.

**Request Body:**
```json
{
  "businessHours": {
    "monday": { "open": "08:00", "close": "17:00" },
    ...
  },
  "timezone": "Europe/Oslo"
}
```

**Response:** Same as GET endpoint

## Implementation Details

### File Modified
`lyx-api/routes/orgSettings.mjs`

### Changes Made
1. Added GET endpoint that retrieves `business_hours`, `timezone`, and `enabled_modules` from the `orgs` table
2. Added PUT endpoint that updates `business_hours` and `timezone` fields
3. Proper error handling with 400 for validation errors, 404 for not found, 500 for server errors
4. Returns camelCase JSON for frontend consistency

### Database Fields Used
- `orgs.business_hours` (JSONB) - Stores opening hours per day
- `orgs.timezone` (TEXT) - Timezone identifier (e.g., "Europe/Oslo")
- `orgs.enabled_modules` (JSONB) - Array of enabled module names

## Code Added

```javascript
// GET /api/orgs/:orgId/booking-settings
fastify.get("/api/orgs/:orgId/booking-settings", async (request, reply) => {
  const orgId = getOrgId(request);
  // ... retrieves business_hours, timezone, enabled_modules
});

// PUT /api/orgs/:orgId/booking-settings
fastify.put("/api/orgs/:orgId/booking-settings", async (request, reply) => {
  const orgId = getOrgId(request);
  const body = request.body || {};
  // ... updates business_hours and timezone
});
```

## Deployment
After adding the endpoints, redeploy the API:
```powershell
cd "c:\Users\maser\OneDrive\Skrivebord\LYX selskaper\lyx-api"
fly deploy --remote-only
```

## Testing
Once deployed, test the endpoint:
```powershell
# Get booking settings
Invoke-WebRequest -Uri "https://lyx-api.fly.dev/api/orgs/ae407558-7f44-40cb-8fe9-1d023212b926/booking-settings" -Headers @{ "Authorization" = "Bearer YOUR_TOKEN" }

# Update booking settings
Invoke-WebRequest -Uri "https://lyx-api.fly.dev/api/orgs/ae407558-7f44-40cb-8fe9-1d023212b926/booking-settings" -Method PUT -Headers @{ "Authorization" = "Bearer YOUR_TOKEN"; "Content-Type" = "application/json" } -Body '{"timezone":"Europe/Oslo"}'
```

## Expected Result
- Frontend will no longer show 404 errors for booking-settings
- Organization settings page will properly load and save booking configuration
- Business hours and timezone can be managed through the UI

## Status
✅ Code added to orgSettings.mjs
⏳ Deployment in progress (use `fly status` to check)

## Related Files
- `lyx-api/routes/orgSettings.mjs` - Endpoint implementation
- Frontend org-settings page - Consuming the endpoint
