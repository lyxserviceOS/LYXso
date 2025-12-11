# Fly.io API Issues Fixed - December 7, 2024

## Problems Identified

### 1. Machines Stopped
- Both API machines (148e73e5a55748 and e2863334a34768) were stopped
- Auto-stop triggered due to excess capacity
- Machines were auto-starting but immediately failing

### 2. Health Check Failures
```
TypeError: reply.addHook is not a function
at Object.requestLogger (file:///app/lib/errors/errorHandler.mjs:246:9)
```
- Every health check request was returning 500 error
- Deployed code was outdated/corrupted
- Local code was correct but not deployed

### 3. CORS Errors (Secondary Effect)
```
Access to fetch at 'https://lyx-api.fly.dev/api/...' from origin 'https://www.lyxso.no' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```
- CORS was actually configured correctly
- Errors occurred because unhealthy machines weren't receiving traffic
- Fly.io was rejecting requests to failed machines

## Solution Applied

### Redeployed API with Current Code
```powershell
cd "c:\Users\maser\OneDrive\Skrivebord\LYX selskaper\lyx-api"
fly deploy --remote-only
```

## Results

### Before Fix
```
PROCESS ID              VERSION REGION  STATE   ROLE    CHECKS                  
app     148e73e5a55748  31      arn     stopped         1 total, 1 warning      
app     e2863334a34768  31      arn     stopped         1 total, 1 critical     
```

### After Fix
```
PROCESS ID              VERSION REGION  STATE   ROLE    CHECKS                  
app     148e73e5a55748  32      arn     started         1 total, 1 passing      
app     e2863334a34768  32      arn     started         1 total, 1 passing      
```

### Health Check Verification
```
GET https://lyx-api.fly.dev/health
Status: 200 OK
Response: {"ok":true,"service":"LYXso API"}
```

## CORS Configuration (Verified Correct)
```javascript
const allowedOrigins = [
  'https://www.lyxso.no',      // ✅ Production
  'https://lyxso.no',           // ✅ Production (www redirect)
  'https://app.lyxso.no',       // ✅ App subdomain
  'http://localhost:3000',      // ✅ Development
  'http://localhost:3001',      // ✅ Development (alt port)
];
```

## What Was Wrong

The deployed code had an old version of `errorHandler.mjs` that tried to use `reply.addHook()` which doesn't exist. The `requestLogger` function was calling this non-existent method, causing every request (including health checks) to crash with a 500 error.

This prevented:
1. Health checks from passing
2. Machines from being marked as healthy
3. Fly.io from routing traffic to the machines
4. Frontend requests from reaching the API (causing CORS-like errors)

## Prevention

To avoid this in the future:
1. Always verify health checks pass after deployment
2. Monitor `fly status` for health check status
3. Check `fly logs` immediately if health checks fail
4. Don't interrupt deployments (Ctrl+C) - let them complete
5. Use `fly deploy --remote-only` for clean deployments

## Commands for Future Reference

```powershell
# Check app status
fly status -a lyx-api

# View logs
fly logs -a lyx-api

# Test health endpoint
Invoke-WebRequest -Uri "https://lyx-api.fly.dev/health"

# Deploy fresh code
cd "c:\Users\maser\OneDrive\Skrivebord\LYX selskaper\lyx-api"
fly deploy --remote-only

# Start stopped machines
fly machines start <machine-id>

# Restart all machines
fly apps restart -a lyx-api
```

## Status: ✅ FIXED

- Both machines running with passing health checks
- API responding correctly to requests
- CORS working for all configured origins
- Frontend can now communicate with backend
