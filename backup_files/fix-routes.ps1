# Script to analyze and report issues in route files

$basePath = "lyxso-app\app\api"
$routeFiles = Get-ChildItem -Path $basePath -Filter "route.ts" -Recurse -File

$issues = @()

foreach ($file in $routeFiles) {
    $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "")
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
        if (-not $content) { continue }
        
        $fileIssues = @{
            Path = $relativePath
            HasNEXT_PUBLIC = $content -match 'process\.env\.NEXT_PUBLIC_SUPABASE'
            HasPromiseParams = $content -match 'context: \{ params: Promise'
            HasTempOrgId = $content -match 'temp-org-id'
            HasMissingValidation = ($content -match 'const \{ \w+ \} = await context\.params;') -and ($content -notmatch 'if \(!params')
        }
        
        if ($fileIssues.HasNEXT_PUBLIC -or $fileIssues.HasPromiseParams -or $fileIssues.HasTempOrgId -or $fileIssues.HasMissingValidation) {
            $issues += [PSCustomObject]$fileIssues
        }
    } catch {
        Write-Host "Error reading file: $relativePath" -ForegroundColor Yellow
    }
}

Write-Host "`n=== ROUTE FILE ANALYSIS ===" -ForegroundColor Cyan
Write-Host "Total route files: $($routeFiles.Count)" -ForegroundColor White
Write-Host "Files with issues: $($issues.Count)`n" -ForegroundColor Yellow

$issues | Format-Table -AutoSize

# Export to JSON for programmatic processing
$issues | ConvertTo-Json -Depth 3 | Out-File "route-issues.json" -Encoding UTF8
Write-Host "`nIssues exported to route-issues.json" -ForegroundColor Green
