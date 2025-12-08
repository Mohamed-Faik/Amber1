// Fix Mailtrap sender address - can't use Gmail
const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '.env');

console.log('📝 Fixing SMTP_FROM address for Mailtrap...\n');

if (fs.existsSync(envFile)) {
    let content = fs.readFileSync(envFile, 'utf8');
    
    // Check current SMTP_FROM
    const fromMatch = content.match(/SMTP_FROM=(.+)/);
    const currentFrom = fromMatch ? fromMatch[1].trim() : '';
    
    if (currentFrom.includes('@gmail.com')) {
        console.log('⚠️  Found Gmail address:', currentFrom);
        console.log('   Mailtrap does not allow Gmail addresses!\n');
        
        // Replace with a valid sender (using a custom domain format)
        const newFrom = 'noreply@amberhomes.com';
        content = content.replace(/SMTP_FROM=.*/g, `SMTP_FROM=${newFrom}`);
        
        fs.writeFileSync(envFile, content, 'utf8');
        
        console.log('✅ Updated SMTP_FROM to:', newFrom);
        console.log('\n💡 Note: You can change this to:');
        console.log('   - Your custom domain email (e.g., noreply@yourdomain.com)');
        console.log('   - Or any email that\'s NOT from gmail.com, yahoo.com, etc.');
        console.log('\n⚠️  Remember to restart your server!');
    } else {
        console.log('✅ SMTP_FROM is already set to a valid address:', currentFrom);
        console.log('   (Not a Gmail address)');
    }
} else {
    console.log('❌ .env file not found!');
}

