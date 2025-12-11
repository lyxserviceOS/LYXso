# Migration Fixer Script
# Fikser migration filnavn til Supabase CLI format

$migrationsPath = "lyxso-app\supabase\migrations"
$timestamp = "20241210"
$counter = 100000

Write-Host "🔧 FIXING SUPABASE MIGRATIONS" -ForegroundColor Cyan
Write-Host "=" * 50
Write-Host ""

# Få alle SQL filer
$files = Get-ChildItem -Path $migrationsPath -Filter "*.sql" | Where-Object { 
    $_.Name -notmatch '^\d{14}_' -and 
    $_.Name -notmatch '^00\d_' -and
    $_.Name -notmatch '^202\d{5}_'
}

if ($files.Count -eq 0) {
    Write-Host "✅ Alle migrations har allerede riktig format!" -ForegroundColor Green
    exit 0
}

Write-Host "📋 Fant $($files.Count) migrations som trenger fixing:" -ForegroundColor Yellow
Write-Host ""

foreach ($file in $files) {
    $oldName = $file.Name
    $newName = "${timestamp}${counter}_$oldName"
    $counter += 1000
    
    Write-Host "  📄 $oldName"
    Write-Host "     → $newName" -ForegroundColor Green
    
    # Rename file
    Rename-Item -Path $file.FullName -NewName $newName
}

Write-Host ""
Write-Host "=" * 50
Write-Host "✅ FERDIG! Alle migrations har nå riktig format" -ForegroundColor Green
Write-Host ""

# Sjekk gamle migrations som kan feile
Write-Host "⚠️  VIKTIG: Sjekker gamle migrations..." -ForegroundColor Yellow
Write-Host ""

$oldMigrations = @(
    "001_enable_rls.sql",
    "002_complete_rls_policies.sql"
)

$foundOldMigrations = @()
foreach ($oldMig in $oldMigrations) {
    $fullPath = Join-Path $migrationsPath $oldMig
    if (Test-Path $fullPath) {
        $foundOldMigrations += $oldMig
    }
}

if ($foundOldMigrations.Count -gt 0) {
    Write-Host "🚨 Disse migrations refererer til tabeller som ikke eksisterer:" -ForegroundColor Red
    foreach ($mig in $foundOldMigrations) {
        Write-Host "   ❌ $mig" -ForegroundColor Red
    }
    Write-Host ""
    
    $response = Read-Host "Vil du flytte disse til backup? (y/n)"
    if ($response -eq 'y') {
        $backupPath = "lyxso-app\supabase\migrations_backup"
        if (-not (Test-Path $backupPath)) {
            New-Item -ItemType Directory -Path $backupPath | Out-Null
        }
        
        foreach ($mig in $foundOldMigrations) {
            $sourcePath = Join-Path $migrationsPath $mig
            $destPath = Join-Path $backupPath $mig
            Move-Item -Path $sourcePath -Destination $destPath
            Write-Host "   ✅ Flyttet $mig til backup" -ForegroundColor Green
        }
        Write-Host ""
    }
}

Write-Host "=" * 50
Write-Host "🚀 KLART FOR DEPLOYMENT!" -ForegroundColor Green
Write-Host ""
Write-Host "Neste steg:" -ForegroundColor Cyan
Write-Host "  1. cd lyxso-app" -ForegroundColor White
Write-Host "  2. supabase db push" -ForegroundColor White
Write-Host ""
Write-Host "Dette vil kjøre alle migrations til Supabase! 🎉" -ForegroundColor Green
