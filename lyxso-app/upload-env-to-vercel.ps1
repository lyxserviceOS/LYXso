# Script for å laste opp environment variables til Vercel
# Kjør: .\upload-env-to-vercel.ps1

Write-Host "Laster opp PUBLIC environment variables til Vercel..." -ForegroundColor Cyan

# Les .env.local
$envFile = Get-Content ".env.local"

foreach ($line in $envFile) {
    if ($line -match '^(NEXT_PUBLIC[^=]+)=(.+)$') {
        $key = $matches[1]
        $value = $matches[2]
        
        Write-Host "Setter $key..." -ForegroundColor Yellow
        
        # Sett for production
        vercel env add $key production --force <<< $value
        
        # Sett for preview
        vercel env add $key preview --force <<< $value
        
        # Sett for development
        vercel env add $key development --force <<< $value
    }
}

Write-Host "`nFerdig! Alle PUBLIC keys er lastet opp til Vercel." -ForegroundColor Green
Write-Host "Nå kan du deploye på nytt med: vercel --prod" -ForegroundColor Cyan
