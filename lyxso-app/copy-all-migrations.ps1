# ============================================================================
# Kopier alle migrations til clipboard for manuell kjøring
# ============================================================================

Write-Host "`n📋 FORBEREDER MIGRATIONS FOR MANUELL KJØRING..." -ForegroundColor Cyan

$migrationsPath = "supabase\migrations"
$sqlFiles = Get-ChildItem -Path $migrationsPath -Filter "*.sql" | Sort-Object Name

$allSql = @"
-- ============================================================================
-- LYXSO COMPLETE DATABASE MIGRATIONS
-- Automatisk generert: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
-- Antall migrations: $($sqlFiles.Count)
-- ============================================================================

"@

foreach ($file in $sqlFiles) {
    $allSql += @"

-- ============================================================================
-- Migration: $($file.Name)
-- ============================================================================

$(Get-Content $file.FullName -Raw)

"@
}

$allSql | Set-Clipboard

Write-Host "`n✅ ALLE MIGRATIONS KOPIERT TIL CLIPBOARD!" -ForegroundColor Green
Write-Host "="*60

Write-Host "`n📊 MIGRATIONS INKLUDERT:" -ForegroundColor Yellow
foreach ($file in $sqlFiles) {
    Write-Host "   • $($file.Name)" -ForegroundColor White
}

Write-Host "`n🎯 NESTE STEG:" -ForegroundColor Cyan
Write-Host "1. Gå til: https://supabase.com/dashboard/project/qxslqfzudduxvjyxedkh/sql/new" -ForegroundColor White
Write-Host "2. Trykk Ctrl+V for å lime inn SQL" -ForegroundColor White
Write-Host "3. Klikk 'Run' eller trykk Ctrl+Enter" -ForegroundColor White
Write-Host "4. Vent til alle migrations er kjørt" -ForegroundColor White

Write-Host "`n💡 TIP:" -ForegroundColor Yellow
Write-Host "   Hvis det blir for mye, kjør én og én migration." -ForegroundColor Gray
Write-Host "   Bruk scriptet: .\copy-single-migration.ps1" -ForegroundColor Gray

Write-Host "`n✨ Trykk Enter når du har kjørt migrations i Supabase..." -ForegroundColor Cyan
Read-Host

Write-Host "`n🎉 Flott! Migrations er kjørt!" -ForegroundColor Green
