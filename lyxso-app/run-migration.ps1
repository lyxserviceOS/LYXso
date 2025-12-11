# ============================================================================
# Supabase Migration Runner
# Kjør dette scriptet for å kjøre migrations direkte
# ============================================================================

Write-Host "`n🚀 SUPABASE MIGRATION RUNNER" -ForegroundColor Cyan
Write-Host "="*60 -ForegroundColor Cyan

# Les migration fil
$migrationFile = "lib\database\webshop_advanced_migration.sql"
$sql = Get-Content $migrationFile -Raw

Write-Host "`n📄 Migration fil: $migrationFile" -ForegroundColor Yellow
Write-Host "📏 Størrelse: $($sql.Length) bytes" -ForegroundColor Yellow

Write-Host "`n📋 SQL INNHOLD:" -ForegroundColor Cyan
Write-Host "="*60 -ForegroundColor Gray
Write-Host $sql -ForegroundColor White
Write-Host "="*60 -ForegroundColor Gray

Write-Host "`n💡 INSTRUKSJONER:" -ForegroundColor Green
Write-Host "1. Gå til: https://supabase.com/dashboard/project/qxslqfzudduxvjyxedkh/sql/new" -ForegroundColor White
Write-Host "2. Kopier SQL-en ovenfor (mellom ===)" -ForegroundColor White
Write-Host "3. Lim inn i SQL Editor" -ForegroundColor White
Write-Host "4. Klikk 'Run' (Ctrl+Enter)" -ForegroundColor White
Write-Host "5. Verifiser at tabellene ble opprettet" -ForegroundColor White

Write-Host "`n✅ FORVENTEDE TABELLER:" -ForegroundColor Green
Write-Host "   • webshop_discounts" -ForegroundColor White
Write-Host "   • webshop_discount_usage" -ForegroundColor White

Write-Host "`n💾 SQL er kopiert til clipboard!" -ForegroundColor Cyan
$sql | Set-Clipboard

Write-Host "`n✨ Trykk Enter når du har kjørt migration i Supabase..." -ForegroundColor Yellow
Read-Host

Write-Host "`n🎉 Takk! Deployment fullført!" -ForegroundColor Green
