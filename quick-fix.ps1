# LYXso Quick Fix Script
# Kjør denne for å fikse de kritiske feilene

Write-Host "🔧 LYXso Quick Fix - Starter..." -ForegroundColor Cyan
Write-Host ""

# 1. Fjern duplicate booking page
Write-Host "1️⃣ Fjerner duplicate booking page..." -ForegroundColor Yellow
$bookingPath = ".\app\(public)\booking"
if (Test-Path $bookingPath) {
    Remove-Item -Recurse -Force $bookingPath
    Write-Host "✅ Slettet app/(public)/booking" -ForegroundColor Green
} else {
    Write-Host "⚠️  app/(public)/booking finnes ikke allerede" -ForegroundColor Gray
}
Write-Host ""

# 2. Sjekk at API-serveren kjører
Write-Host "2️⃣ Sjekker API-server..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "http://localhost:4000/health" -Method GET -ErrorAction Stop
    Write-Host "✅ API-server kjører (port 4000)" -ForegroundColor Green
} catch {
    Write-Host "❌ API-server kjører IKKE" -ForegroundColor Red
    Write-Host "   Start API med: cd lyx-api && npm run dev" -ForegroundColor Yellow
}
Write-Host ""

# 3. Sjekk environment variables
Write-Host "3️⃣ Sjekker environment variables..." -ForegroundColor Yellow

if (Test-Path ".env.local") {
    Write-Host "✅ .env.local finnes" -ForegroundColor Green
    
    $envContent = Get-Content ".env.local" -Raw
    
    if ($envContent -match "NEXT_PUBLIC_ORG_ID") {
        Write-Host "✅ NEXT_PUBLIC_ORG_ID er satt" -ForegroundColor Green
    } else {
        Write-Host "❌ NEXT_PUBLIC_ORG_ID mangler" -ForegroundColor Red
    }
    
    if ($envContent -match "NEXT_PUBLIC_API_BASE_URL") {
        Write-Host "✅ NEXT_PUBLIC_API_BASE_URL er satt" -ForegroundColor Green
    } else {
        Write-Host "❌ NEXT_PUBLIC_API_BASE_URL mangler" -ForegroundColor Red
    }
} else {
    Write-Host "❌ .env.local finnes ikke" -ForegroundColor Red
    Write-Host "   Opprett .env.local med nødvendige variabler" -ForegroundColor Yellow
}
Write-Host ""

# 4. Test customers endpoint
Write-Host "4️⃣ Tester customers endpoint..." -ForegroundColor Yellow
try {
    $orgId = "ae407558-7f44-40cb-8fe9-1d023212b926"
    $customersUrl = "http://localhost:4000/api/orgs/$orgId/customers"
    $customers = Invoke-WebRequest -Uri $customersUrl -Method GET -ErrorAction Stop
    Write-Host "✅ Customers endpoint fungerer" -ForegroundColor Green
    
    $data = $customers.Content | ConvertFrom-Json
    $count = $data.customers.Count
    Write-Host "   Fant $count kunder" -ForegroundColor Gray
} catch {
    Write-Host "❌ Customers endpoint feilet" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "   Mulige årsaker:" -ForegroundColor Yellow
    Write-Host "   - API-serveren kjører ikke (start med: cd ..\lyx-api && npm run dev)" -ForegroundColor Yellow
    Write-Host "   - Database-kolonner mangler (kjør SQL-script i Supabase)" -ForegroundColor Yellow
    Write-Host "   - ORG_ID er feil" -ForegroundColor Yellow
}
Write-Host ""

# 5. Sjekk TypeScript-feil
Write-Host "5️⃣ Sjekker TypeScript..." -ForegroundColor Yellow
Write-Host "   (Dette kan ta litt tid...)" -ForegroundColor Gray
try {
    $tscCheck = & npx tsc --noEmit 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Ingen TypeScript-feil" -ForegroundColor Green
    } else {
        Write-Host "⚠️  TypeScript-feil funnet" -ForegroundColor Yellow
        Write-Host "   Kjør 'npx tsc --noEmit' for detaljer" -ForegroundColor Gray
    }
} catch {
    Write-Host "⚠️  Kunne ikke kjøre TypeScript-sjekk" -ForegroundColor Yellow
}
Write-Host ""

# Oppsummering
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📋 OPPSUMMERING" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Neste steg:" -ForegroundColor Yellow
Write-Host "1. Åpne Supabase SQL Editor" -ForegroundColor White
Write-Host "2. Kjør SQL-script fra: ..\lyx-api\add_customer_crm_columns.sql" -ForegroundColor White
Write-Host "3. Start API-server (hvis ikke kjører): cd ..\lyx-api && npm run dev" -ForegroundColor White
Write-Host "4. Start dev-server: npm run dev" -ForegroundColor White
Write-Host "5. Test /kunder i nettleseren" -ForegroundColor White
Write-Host ""
Write-Host "Dokumentasjon:" -ForegroundColor Yellow
Write-Host "- LAUNCH_CHECKLIST.md - Fullstendig sjekkliste" -ForegroundColor White
Write-Host "- ..\lyx-api\CUSTOMER_CRM_API.md - API-dokumentasjon" -ForegroundColor White
Write-Host "- ..\lyx-api\CRM_QUICK_REF.md - Hurtigreferanse" -ForegroundColor White
Write-Host ""
Write-Host "✨ Quick fix fullført!" -ForegroundColor Green
