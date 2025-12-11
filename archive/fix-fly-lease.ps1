# Quick Fix for Fly.io Lease Error
# Kjør dette hvis du får lease error under deployment

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FLY.IO LEASE FIX" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "c:\Users\maser\OneDrive\Skrivebord\LYX selskaper\lyxso-app"

Write-Host "Steg 1: Sjekker maskin-status..." -ForegroundColor Yellow
fly machines list

Write-Host ""
Write-Host "Steg 2: Restarter app for å frigjøre leases..." -ForegroundColor Yellow
fly apps restart

Write-Host ""
Write-Host "Venter 30 sekunder..." -ForegroundColor Gray
Start-Sleep -Seconds 30

Write-Host ""
Write-Host "Steg 3: Verifiserer status..." -ForegroundColor Yellow
fly status

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "KLAR FOR NY DEPLOYMENT!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Kjør nå: .\deploy-fly.ps1" -ForegroundColor Cyan
Write-Host ""
