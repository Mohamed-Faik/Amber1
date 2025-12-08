// Update .env file to use Mailtrap
const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '.env');

console.log('📝 Updating .env file with Mailtrap credentials...\n');

if (fs.existsSync(envFile)) {
    let content = fs.readFileSync(envFile, 'utf8');
    
    // Replace SMTP settings
    content = content.replace(/SMTP_HOST=.*/g, 'SMTP_HOST=live.smtp.mailtrap.io');
    content = content.replace(/SMTP_PORT=.*/g, 'SMTP_PORT=587');
    content = content.replace(/SMTP_USER=.*/g, 'SMTP_USER=api');
    content = content.replace(/SMTP_PASSWORD=.*/g, 'SMTP_PASSWORD=d448bbe7b015a1c90b986eb2f46affec');
    
    // Ensure SMTP_FROM exists (if not, add it)
    if (!content.includes('SMTP_FROM=')) {
        content += '\nSMTP_FROM=noreply@yourdomain.com';
    }
    
    fs.writeFileSync(envFile, content, 'utf8');
    
    console.log('✅ .env file updated successfully!\n');
    console.log('Updated values:');
    console.log('  SMTP_HOST=live.smtp.mailtrap.io');
    console.log('  SMTP_PORT=587');
    console.log('  SMTP_USER=api');
    console.log('  SMTP_PASSWORD=d448bbe7b015a1c90b986eb2f46affec\n');
    console.log('💡 Don\'t forget to:');
    console.log('  1. Update SMTP_FROM with your preferred sender email (if needed)');
    console.log('  2. Restart your server (Ctrl+C, then npm run dev)');
} else {
    console.log('❌ .env file not found!');
    console.log('Creating new .env file...\n');
    
    const newContent = `SMTP_HOST=live.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=api
SMTP_PASSWORD=d448bbe7b015a1c90b986eb2f46affec
SMTP_FROM=noreply@yourdomain.com
`;
    
    fs.writeFileSync(envFile, newContent, 'utf8');
    console.log('✅ Created new .env file with Mailtrap credentials!');
}

