# Fix Fly.io Machine Lease Error

## Problem
```
[PM01] machines API returned an error: "machine ID e2863334a34768 lease currently held by b3ae2304-bca8-5ab8-8699-549c0a233e92@tokens.fly.io, expires at 2025-12-07T00:02:22Z"
```

## Solutions (try in order)

### 1. Wait for Lease to Expire
The lease expires at `2025-12-07T00:02:22Z`. Wait until that time (about 2 minutes from your error) and try again.

### 2. Release the Lease Manually
```powershell
cd "c:\Users\maser\OneDrive\Skrivebord\LYX selskaper\lyxso-app"

# List all machines to see status
fly machines list

# Force release the lease on the specific machine
fly machines update e2863334a34768 --yes

# Or stop the machine first
fly machines stop e2863334a34768

# Then start it again
fly machines start e2863334a34768
```

### 3. Cancel Running Deployment
```powershell
# Check for running deployments
fly status

# If a deployment is stuck, cancel it
fly deploy --detach=false

# Or force a new deployment
fly deploy --force
```

### 4. Restart All Machines
```powershell
# Restart the entire app
fly apps restart

# Wait 30 seconds
Start-Sleep -Seconds 30

# Try deploying again
fly deploy --remote-only
```

### 5. Use Updated Deploy Script
The new script includes lease handling and retry logic.

## Prevention
- Don't run multiple deployments simultaneously
- Wait for previous deployment to complete
- Use `fly status` to check before deploying
- Don't manually interrupt deployments (Ctrl+C)

## Quick Fix Command
```powershell
# All-in-one fix
cd "c:\Users\maser\OneDrive\Skrivebord\LYX selskaper\lyxso-app"
fly machines list
fly apps restart
Start-Sleep -Seconds 30
fly deploy --remote-only
```
