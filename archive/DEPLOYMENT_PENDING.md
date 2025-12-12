# Manual Deployment Required

## Issue
Fly CLI is hanging during deployment attempts. This may be due to:
1. Network connectivity issues
2. Fly.io service experiencing delays
3. Large image build taking longer than expected

## What Was Done
✅ Added booking-settings endpoints to `lyx-api/routes/orgSettings.mjs`:
- GET `/api/orgs/:orgId/booking-settings`
- PUT `/api/orgs/:orgId/booking-settings`

## Next Steps - Manual Deployment

### Option 1: Try deployment in a new terminal
```powershell
cd "c:\Users\maser\OneDrive\Skrivebord\LYX selskaper\lyx-api"
fly deploy --remote-only
```

### Option 2: Check if deployment is already running
```powershell
fly status -a lyx-api
fly logs -a lyx-api
```

### Option 3: Use the deploy script if it exists
```powershell
cd "c:\Users\maser\OneDrive\Skrivebord\LYX selskaper"
.\deploy-fly.ps1
```

### Option 4: Wait and retry
The previous deployment may still be processing. Wait 5-10 minutes and check:
```powershell
fly status -a lyx-api
```

If machines show version 33 (increased from 32), the deployment succeeded.

## Verification After Deployment

Once deployed, test the new endpoint:
```powershell
# Test GET endpoint
Invoke-WebRequest -Uri "https://lyx-api.fly.dev/api/orgs/ae407558-7f44-40cb-8fe9-1d023212b926/booking-settings" -UseBasicParsing

# Expected: 200 OK with businessHours, timezone, enabledModules
```

## Changes Made
File: `lyx-api/routes/orgSettings.mjs`
Lines added: ~110 lines at the end before the closing brace
Added: 2 new endpoints for booking settings management

The code is ready and saved locally. Only deployment is pending.
