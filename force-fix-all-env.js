// Force fix ALL .env files to use Gmail
const fs = require('fs');
const path = require('path');

const gmailConfig = {
    SMTP_HOST: 'smtp.hostinger.com',
    SMTP_PORT: '465',
    SMTP_USER: 'support@benjamil.com',
    SMTP_PASSWORD: 'l2d]O8h[2Q',
    SMTP_FROM: 'support@benjamil.com'
};

const envFiles = ['.env', '.env.local', '.env.development'];

console.log('🔧 Force fixing ALL .env files to Gmail SMTP...\n');

envFiles.forEach(fileName => {
    const filePath = path.join(__dirname, fileName);
    
    if (fs.existsSync(filePath)) {
        console.log(`📝 Updating: ${fileName}`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        // Remove all SMTP lines
        const newLines = lines.filter(line => 
            !line.trim().startsWith('SMTP_HOST=') &&
            !line.trim().startsWith('SMTP_PORT=') &&
            !line.trim().startsWith('SMTP_USER=') &&
            !line.trim().startsWith('SMTP_PASSWORD=') &&
            !line.trim().startsWith('SMTP_FROM=')
        );
        
        // Add Gmail config at the end
        newLines.push('');
        newLines.push('# Gmail SMTP Configuration');
        newLines.push(`SMTP_HOST=${gmailConfig.SMTP_HOST}`);
        newLines.push(`SMTP_PORT=${gmailConfig.SMTP_PORT}`);
        newLines.push(`SMTP_USER=${gmailConfig.SMTP_USER}`);
        newLines.push(`SMTP_PASSWORD=${gmailConfig.SMTP_PASSWORD}`);
        newLines.push(`SMTP_FROM=${gmailConfig.SMTP_FROM}`);
        
        fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
        console.log(`   ✅ Fixed ${fileName}\n`);
    } else {
        console.log(`   ⚠️  ${fileName} not found (will be created if needed)\n`);
    }
});

console.log('✅ All .env files fixed!');
console.log('\n🚨 CRITICAL: RESTART YOUR SERVER NOW!');
console.log('   1. Press Ctrl+C to stop');
console.log('   2. Wait 3 seconds');
console.log('   3. Run: npm run dev');
console.log('   4. Test again\n');

