// Fix .env file with Gmail configuration
const fs = require('fs');

console.log('🔧 Fixing .env file with Gmail SMTP...\n');

// Read current .env
let content = '';
if (fs.existsSync('.env')) {
    content = fs.readFileSync('.env', 'utf8');
}

// Remove all old SMTP lines
const lines = content.split('\n').filter(line => 
    !line.trim().startsWith('SMTP_HOST=') &&
    !line.trim().startsWith('SMTP_PORT=') &&
    !line.trim().startsWith('SMTP_USER=') &&
    !line.trim().startsWith('SMTP_PASSWORD=') &&
    !line.trim().startsWith('SMTP_FROM=')
);

// Add Gmail SMTP configuration
const gmailConfig = `
# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=aniffour.dev@gmail.com
SMTP_PASSWORD=xpimysjapqavxdpu
SMTP_FROM=aniffour.dev@gmail.com
`;

// Combine
const newContent = lines.join('\n') + gmailConfig;

// Write back
fs.writeFileSync('.env', newContent, 'utf8');

console.log('✅ .env file fixed!');
console.log('');
console.log('Gmail SMTP Configuration added:');
console.log('  SMTP_HOST=smtp.gmail.com');
console.log('  SMTP_PORT=587');
console.log('  SMTP_USER=aniffour.dev@gmail.com');
console.log('  SMTP_FROM=aniffour.dev@gmail.com');
console.log('');
console.log('🚨 NOW RESTART YOUR SERVER:');
console.log('  1. Press Ctrl+C');
console.log('  2. Run: npm run dev');
console.log('  3. Test sending OTP');

