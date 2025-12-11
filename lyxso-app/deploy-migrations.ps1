# ============================================================================
# Deploy Migrations til Supabase
# Kjører alle migrations direkte via Supabase Management API
# ============================================================================

param(
    [string]$AccessToken = "",
    [string]$ProjectRef = "qxslqfzudduxvjyxedkh"
)

Write-Host "`n🚀 SUPABASE MIGRATION DEPLOYER" -ForegroundColor Cyan
Write-Host "="*60

if ([string]::IsNullOrEmpty($AccessToken)) {
    Write-Host "`n⚠️  MANGLER ACCESS TOKEN!" -ForegroundColor Red
    Write-Host "Hent token fra: https://supabase.com/dashboard/account/tokens" -ForegroundColor Yellow
    Write-Host "`nKjør scriptet slik:" -ForegroundColor White
    Write-Host '.\deploy-migrations.ps1 -AccessToken "din_token_her"' -ForegroundColor Gray
    exit 1
}

$migrationsPath = "supabase\migrations"
$sqlFiles = Get-ChildItem -Path $migrationsPath -Filter "*.sql" | Sort-Object Name

Write-Host "`n📋 Fant $($sqlFiles.Count) migration filer" -ForegroundColor Yellow

foreach ($file in $sqlFiles) {
    Write-Host "`n📄 Kjører: $($file.Name)" -ForegroundColor Cyan
    
    $sql = Get-Content $file.FullName -Raw
    
    $body = @{
        query = $sql
    } | ConvertTo-Json
    
    $headers = @{
        "Authorization" = "Bearer $AccessToken"
        "Content-Type" = "application/json"
    }
    
    $url = "https://api.supabase.com/v1/projects/$ProjectRef/database/query"
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body -ErrorAction Stop
        Write-Host "   ✅ Success!" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        
        if ($_.ErrorDetails) {
            Write-Host "   Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host "`n✅ MIGRATION DEPLOYMENT FULLFØRT!" -ForegroundColor Green
Write-Host "`nVerifiser i Supabase Dashboard:" -ForegroundColor Yellow
Write-Host "https://supabase.com/dashboard/project/$ProjectRef/editor" -ForegroundColor White
