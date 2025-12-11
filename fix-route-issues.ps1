# Fix Route Issues Script
# This script fixes the following issues in Next.js route files:
# 1. Replace NEXT_PUBLIC_SUPABASE_URL with SUPABASE_URL (server-only)
# 2. Replace NEXT_PUBLIC_SUPABASE_ANON_KEY with SUPABASE_ANON_KEY (server-only)
# Note: Defensive param checks are already in place, so we don't modify those

Write-Host "Starting route fixes..." -ForegroundColor Cyan

$routeFiles = Get-ChildItem -Path "lyxso-app\app\api" -Recurse -Filter "*.ts"
$fixedCount = 0
$filesWithIssues = @()

foreach ($file in $routeFiles) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    $modified = $false
    
    # Replace NEXT_PUBLIC_SUPABASE_URL with SUPABASE_URL (server-only)
    if ($content -match "NEXT_PUBLIC_SUPABASE_URL") {
        $content = $content -replace "process\.env\.NEXT_PUBLIC_SUPABASE_URL", "process.env.SUPABASE_URL"
        $content = $content -replace "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL"
        $modified = $true
        Write-Host "  Fixed SUPABASE_URL in: $($file.FullName)" -ForegroundColor Yellow
    }
    
    # Replace NEXT_PUBLIC_SUPABASE_ANON_KEY with SUPABASE_ANON_KEY (server-only)
    if ($content -match "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
        $content = $content -replace "process\.env\.NEXT_PUBLIC_SUPABASE_ANON_KEY", "process.env.SUPABASE_ANON_KEY"
        $content = $content -replace "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_ANON_KEY"
        $modified = $true
        Write-Host "  Fixed SUPABASE_ANON_KEY in: $($file.FullName)" -ForegroundColor Yellow
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $fixedCount++
        $filesWithIssues += $file.FullName
    }
}

Write-Host "`nFixed $fixedCount route files" -ForegroundColor Green
Write-Host "`nFiles modified:" -ForegroundColor Cyan
foreach ($file in $filesWithIssues) {
    Write-Host "  - $file" -ForegroundColor White
}

Write-Host "`nDone! Please update your .env file with:" -ForegroundColor Green
Write-Host "  SUPABASE_URL=your-supabase-url" -ForegroundColor Yellow
Write-Host "  SUPABASE_ANON_KEY=your-supabase-anon-key" -ForegroundColor Yellow
Write-Host "`nNote: Keep NEXT_PUBLIC_* versions for client-side usage only" -ForegroundColor Cyan
