# Update .env file to use Mailtrap
$envFile = ".env"

if (Test-Path $envFile) {
    Write-Host "📝 Updating .env file with Mailtrap credentials..."
    
    $content = Get-Content $envFile -Raw
    
    # Replace SMTP settings
    $content = $content -replace 'SMTP_HOST=.*', 'SMTP_HOST=live.smtp.mailtrap.io'
    $content = $content -replace 'SMTP_PORT=.*', 'SMTP_PORT=587'
    $content = $content -replace 'SMTP_USER=.*', 'SMTP_USER=api'
    $content = $content -replace 'SMTP_PASSWORD=.*', 'SMTP_PASSWORD=d448bbe7b015a1c90b986eb2f46affec'
    
    # If SMTP_FROM doesn't exist or is empty, add it
    if ($content -notmatch 'SMTP_FROM=') {
        $content += "`nSMTP_FROM=noreply@yourdomain.com"
    }
    
    Set-Content -Path $envFile -Value $content -NoNewline
    
    Write-Host "✅ .env file updated successfully!"
    Write-Host ""
    Write-Host "Updated values:"
    Write-Host "  SMTP_HOST=live.smtp.mailtrap.io"
    Write-Host "  SMTP_PORT=587"
    Write-Host "  SMTP_USER=api"
    Write-Host "  SMTP_PASSWORD=d448bbe7b015a1c90b986eb2f46affec"
    Write-Host ""
    Write-Host "💡 Don't forget to:"
    Write-Host "  1. Update SMTP_FROM with your preferred sender email"
    Write-Host "  2. Restart your server (Ctrl+C, then npm run dev)"
} else {
    Write-Host "❌ .env file not found!"
    Write-Host "Creating new .env file..."
    
    $newContent = @"
SMTP_HOST=live.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=api
SMTP_PASSWORD=d448bbe7b015a1c90b986eb2f46affec
SMTP_FROM=noreply@yourdomain.com
"@
    
    Set-Content -Path $envFile -Value $newContent
    Write-Host "✅ Created new .env file with Mailtrap credentials!"
}

