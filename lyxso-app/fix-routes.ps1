# Fix all API route files to use async params (Next.js 15+)

$routeFiles = Get-ChildItem -Path "app\api" -Recurse -Filter "route.ts"

foreach ($file in $routeFiles) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Pattern 1: { params }: { params: { xxx: string } }
    $content = $content -replace '\{ params \}: \{ params: \{ (\w+): string \} \}', '{ params }: { params: Promise<{ $1: string }> }'
    
    # Pattern 2: Need to await params and extract variables
    # Find all function signatures with params
    if ($content -match 'export async function (GET|POST|PUT|PATCH|DELETE)\s*\([^)]*\{ params \}: \{ params: Promise<\{[^}]+\}> \}\s*\)') {
        # Extract parameter names from the type definition
        if ($content -match 'params: Promise<\{ (\w+): string \}>') {
            $paramName = $Matches[1]
            
            # Add await params line after function start
            $content = $content -replace "(\) \{[\r\n\s]*try \{)", "`$1`n    const { $paramName } = await params;"
            
            # Replace params.xxx with just xxx in the function body
            $content = $content -replace "params\.$paramName", $paramName
        }
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.FullName)"
    }
}

Write-Host "`nAll route files have been processed."
