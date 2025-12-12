# Deploy og Restart Script
# Kjør dette skriptet for å deploye endringer til Fly.io

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "LYXSO - Deploy til Fly.io" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Gå til riktig mappe
Set-Location "c:\Users\maser\OneDrive\Skrivebord\LYX selskaper\lyxso-app"

Write-Host "Steg 1: Verifiserer git status..." -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "Steg 2: Sjekker for aktive leases..." -ForegroundColor Yellow
fly machines list

Write-Host ""
Write-Host "Steg 3: Venter på eventuelle aktive leases..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "Steg 4: Starter deployment til Fly.io..." -ForegroundColor Yellow
Write-Host "Dette vil ta 5-8 minutter..." -ForegroundColor Gray
Write-Host ""

# Deploy til Fly med retry logic
$deploySuccess = $false
$retryCount = 0
$maxRetries = 3

while (-not $deploySuccess -and $retryCount -lt $maxRetries) {
    fly deploy --remote-only
    
    if ($LASTEXITCODE -eq 0) {
        $deploySuccess = $true
    } else {
        $retryCount++
        if ($retryCount -lt $maxRetries) {
            Write-Host ""
            Write-Host "Deployment feilet. Venter 30 sekunder før retry $retryCount/$maxRetries..." -ForegroundColor Yellow
            Start-Sleep -Seconds 30
            
            Write-Host "Prøver å frigjøre leases..." -ForegroundColor Yellow
            fly apps restart
            Start-Sleep -Seconds 10
        }
    }
}

if ($deploySuccess) {

if ($deploySuccess) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "DEPLOYMENT VELLYKKET!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Steg 5: Restarter app..." -ForegroundColor Yellow
    fly apps restart
    
    Write-Host ""
    Write-Host "Venter 10 sekunder for restart..." -ForegroundColor Gray
    Start-Sleep -Seconds 10
    
    Write-Host ""
    Write-Host "Sjekker status..." -ForegroundColor Yellow
    fly status
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "FERDIG!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Gå til din app-URL og test funksjonaliteten:" -ForegroundColor Cyan
    Write-Host "1. Logg inn" -ForegroundColor White
    Write-Host "2. Gå til Booking" -ForegroundColor White
    Write-Host "3. Klikk 'Administrer lokasjoner'" -ForegroundColor White
    Write-Host "4. Test opprett/rediger/slett" -ForegroundColor White
    Write-Host ""
    
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "DEPLOYMENT FEILET ETTER $maxRetries FORSØK!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Mulige løsninger:" -ForegroundColor Yellow
    Write-Host "1. Vent 2-3 minutter og kjør scriptet på nytt" -ForegroundColor White
    Write-Host "2. Kjør: fly machines list" -ForegroundColor White
    Write-Host "3. Kjør: fly apps restart" -ForegroundColor White
    Write-Host "4. Vent 30 sekunder og prøv igjen" -ForegroundColor White
    Write-Host ""
    Write-Host "For mer info, kjør: fly logs" -ForegroundColor White
    Write-Host ""
}
