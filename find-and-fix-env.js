// Quick script to find and check .env files
const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;

console.log('🔍 Searching for .env files in:', projectRoot);
console.log('');

const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];

envFiles.forEach(fileName => {
    const filePath = path.join(projectRoot, fileName);
    if (fs.existsSync(filePath)) {
        console.log(`✅ Found: ${fileName}`);
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        let smtpUser = null;
        let smtpFrom = null;
        
        lines.forEach(line => {
            if (line.startsWith('SMTP_USER=')) {
                smtpUser = line.split('=')[1]?.trim();
            }
            if (line.startsWith('SMTP_FROM=')) {
                smtpFrom = line.split('=')[1]?.trim();
            }
        });
        
        console.log(`   SMTP_USER: ${smtpUser || 'NOT SET'}`);
        if (smtpUser && smtpUser.includes('@gmail.com')) {
            console.log(`   ❌ ERROR: SMTP_USER should NOT be your Gmail!`);
            console.log(`   ✅ Should be: 7bd403001@smtp-brevo.com`);
        }
        console.log(`   SMTP_FROM: ${smtpFrom || 'NOT SET'}`);
        console.log('');
    } else {
        console.log(`❌ Not found: ${fileName}`);
        console.log('');
    }
});

console.log('💡 Next steps:');
console.log('1. Open the .env or .env.local file that exists');
console.log('2. Change SMTP_USER to: 7bd403001@smtp-brevo.com');
console.log('3. Save the file');
console.log('4. Restart your server');

