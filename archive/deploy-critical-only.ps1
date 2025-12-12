# Deploy kun den kritiske migrasjonen
# Denne er laget med IF NOT EXISTS og vil fungere

Write-Host "🚀 DEPLOYER KUN KRITISK MIGRATION" -ForegroundColor Cyan
Write-Host "=" * 50
Write-Host ""

$migrationFile = "lyxso-app\supabase\migrations\20241210_critical_tables.sql"

if (-not (Test-Path $migrationFile)) {
    Write-Host "❌ Finner ikke $migrationFile" -ForegroundColor Red
    exit 1
}

Write-Host "📄 Leser migration fil..." -ForegroundColor Yellow
$sql = Get-Content $migrationFile -Raw

Write-Host "📊 Migration inneholder:" -ForegroundColor Cyan
Write-Host "  - organizations tabell"
Write-Host "  - subscriptions tabell"
Write-Host "  - RLS aktivering på alle tabeller"
Write-Host ""

Write-Host "🔧 Deployer via psql..." -ForegroundColor Yellow
Write-Host ""

# Les .env.local for credentials
$envFile = "lyxso-app\.env.local"
if (Test-Path $envFile) {
    $env:PGPASSWORD = (Get-Content $envFile | Select-String "SUPABASE_DB_PASSWORD" | ForEach-Object { $_ -replace '.*=', '' }).Trim()
}

# Deploy med psql
$dbUrl = "postgresql://postgres.gedoxtrdylqxyyvfjmtb@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"

# Save SQL to temp file
$tempFile = [System.IO.Path]::GetTempFileName() + ".sql"
$sql | Out-File -FilePath $tempFile -Encoding UTF8

try {
    # Run psql
    psql $dbUrl -f $tempFile 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "=" * 50
        Write-Host "✅ DEPLOYMENT VELLYKKET!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Neste: Kjør analyse for å verifisere" -ForegroundColor Cyan
        Write-Host "  node comprehensive-supabase-analysis.mjs" -ForegroundColor White
    } else {
        Write-Host "❌ Deployment feilet" -ForegroundColor Red
    }
} finally {
    Remove-Item $tempFile -ErrorAction SilentlyContinue
}
