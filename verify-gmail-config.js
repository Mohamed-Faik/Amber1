// Verify Gmail SMTP configuration
const fs = require('fs');

console.log('🔍 Checking .env file...\n');

if (fs.existsSync('.env')) {
    const content = fs.readFileSync('.env', 'utf8');
    const lines = content.split('\n');
    
    let smtpHost = null;
    let smtpUser = null;
    let smtpFrom = null;
    
    lines.forEach(line => {
        if (line.startsWith('SMTP_HOST=')) smtpHost = line.split('=')[1]?.trim();
        if (line.startsWith('SMTP_USER=')) smtpUser = line.split('=')[1]?.trim();
        if (line.startsWith('SMTP_FROM=')) smtpFrom = line.split('=')[1]?.trim();
    });
    
    console.log('Current .env settings:');
    console.log('  SMTP_HOST:', smtpHost || 'NOT SET');
    console.log('  SMTP_USER:', smtpUser || 'NOT SET');
    console.log('  SMTP_FROM:', smtpFrom || 'NOT SET');
    console.log('');
    
    if (smtpHost === 'smtp.gmail.com' && smtpUser === 'aniffour.dev@gmail.com') {
        console.log('✅ .env file is CORRECT!');
        console.log('');
        console.log('⚠️  IMPORTANT: Your server is still running with OLD settings!');
        console.log('');
        console.log('🚨 YOU MUST RESTART YOUR SERVER:');
        console.log('  1. Press Ctrl+C to stop the server');
        console.log('  2. Wait 2 seconds');
        console.log('  3. Run: npm run dev');
        console.log('');
        console.log('After restart, it will use Gmail SMTP!');
    } else {
        console.log('❌ .env file still has wrong settings!');
        console.log('Fixing now...');
    }
} else {
    console.log('❌ .env file not found!');
}

