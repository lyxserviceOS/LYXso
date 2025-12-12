# Quick Voice Diagnostics Script
# Sjekker om alt er klart for Twilio Voice

Write-Host "`n🔍 TWILIO VOICE DIAGNOSTICS`n" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════`n" -ForegroundColor Cyan

# 1. Check if API is reachable
Write-Host "1️⃣  Checking API health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "https://lyx-api.fly.dev/health" -TimeoutSec 10 -ErrorAction Stop
    Write-Host "   ✅ API is UP and running" -ForegroundColor Green
    Write-Host "   Status: $($health.status)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ API is NOT reachable!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Action: Run 'fly deploy' in lyx-api folder`n" -ForegroundColor Yellow
}

# 2. Check voice webhook endpoint
Write-Host "`n2️⃣  Checking voice webhook endpoint..." -ForegroundColor Yellow
try {
    $body = @{
        CallSid = "TEST_DIAGNOSTIC_$(Get-Date -Format 'yyyyMMddHHmmss')"
        From = "%2B4712345678"
        To = "%2B46724004859"
        CallStatus = "ringing"
    }
    
    $response = Invoke-RestMethod -Uri "https://lyx-api.fly.dev/api/webhooks/twilio/voice" `
        -Method Post `
        -Body $body `
        -ContentType "application/x-www-form-urlencoded" `
        -TimeoutSec 10 `
        -ErrorAction Stop
    
    Write-Host "   ✅ Voice webhook responds correctly" -ForegroundColor Green
    
    # Check if response contains TwiML
    if ($response -match "<Response>") {
        Write-Host "   ✅ TwiML XML generated successfully" -ForegroundColor Green
        
        # Extract the welcome message
        if ($response -match "<Say[^>]*>([^<]+)</Say>") {
            $message = $matches[1]
            Write-Host "   📢 AI will say: '$message'" -ForegroundColor Cyan
        }
    } else {
        Write-Host "   ⚠️  Response doesn't look like TwiML" -ForegroundColor Yellow
        Write-Host "   Response: $($response | ConvertTo-Json)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Voice webhook NOT working!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Action: Redeploy API with 'fly deploy'`n" -ForegroundColor Yellow
}

# 3. Check database table (indirectly via API response)
Write-Host "`n3️⃣  Checking database readiness..." -ForegroundColor Yellow
Write-Host "   ℹ️  Cannot check database directly from here" -ForegroundColor Gray
Write-Host "   Action: Go to Supabase SQL Editor and run:" -ForegroundColor Yellow
Write-Host "   SELECT * FROM ai_voice_sessions LIMIT 1;" -ForegroundColor White

# 4. Check if lyx-api folder exists locally
Write-Host "`n4️⃣  Checking local setup..." -ForegroundColor Yellow
$apiPath = "c:\Users\maser\OneDrive\Skrivebord\LYX selskaper\lyx-api"
if (Test-Path $apiPath) {
    Write-Host "   ✅ lyx-api folder found" -ForegroundColor Green
    
    # Check if voice files exist
    $voiceWebhook = Join-Path $apiPath "routes\twilioVoiceWebhook.mjs"
    $voiceService = Join-Path $apiPath "services\aiVoiceService.mjs"
    
    if (Test-Path $voiceWebhook) {
        Write-Host "   ✅ twilioVoiceWebhook.mjs exists" -ForegroundColor Green
    } else {
        Write-Host "   ❌ twilioVoiceWebhook.mjs NOT FOUND!" -ForegroundColor Red
    }
    
    if (Test-Path $voiceService) {
        Write-Host "   ✅ aiVoiceService.mjs exists" -ForegroundColor Green
    } else {
        Write-Host "   ❌ aiVoiceService.mjs NOT FOUND!" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ lyx-api folder not found at: $apiPath" -ForegroundColor Red
}

# Summary
Write-Host "`n════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📋 SUMMARY & NEXT STEPS`n" -ForegroundColor Cyan

Write-Host "✅ DONE (if green above):" -ForegroundColor Green
Write-Host "   • API is deployed and running" -ForegroundColor White
Write-Host "   • Voice webhook endpoint responds" -ForegroundColor White
Write-Host "   • TwiML generation works" -ForegroundColor White

Write-Host "`n⏳ TODO (manual steps):" -ForegroundColor Yellow
Write-Host "   1. Configure Twilio webhook:" -ForegroundColor White
Write-Host "      https://console.twilio.com/" -ForegroundColor Gray
Write-Host "      Phone Numbers → +46 72 400 48 59" -ForegroundColor Gray
Write-Host "      Voice Configuration → Webhook:" -ForegroundColor Gray
Write-Host "      https://lyx-api.fly.dev/api/webhooks/twilio/voice" -ForegroundColor Cyan

Write-Host "`n   2. Create database table:" -ForegroundColor White
Write-Host "      https://supabase.com/dashboard" -ForegroundColor Gray
Write-Host "      Run: create_ai_voice_sessions.sql" -ForegroundColor Gray

Write-Host "`n   3. Test by calling:" -ForegroundColor White
Write-Host "      +46 72 400 48 59" -ForegroundColor Cyan

Write-Host "`n   4. Check Twilio Debugger if issues:" -ForegroundColor White
Write-Host "      https://console.twilio.com/debugger" -ForegroundColor Gray

Write-Host "`n════════════════════════════════════════`n" -ForegroundColor Cyan

# Final recommendation
Write-Host "💡 If API checks fail above:" -ForegroundColor Yellow
Write-Host "   cd `"$apiPath`"" -ForegroundColor White
Write-Host "   fly deploy" -ForegroundColor White
Write-Host "`n"
