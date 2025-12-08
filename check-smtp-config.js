// Quick check of SMTP configuration
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

console.log('📧 Current SMTP Configuration:');
console.log('SMTP_HOST:', process.env.SMTP_HOST || 'NOT SET');
console.log('SMTP_USER:', process.env.SMTP_USER || 'NOT SET');
console.log('SMTP_FROM:', process.env.SMTP_FROM || 'NOT SET');
console.log('');
console.log('✅ Should be:');
console.log('SMTP_HOST: smtp.gmail.com');
console.log('SMTP_USER: aniffour.dev@gmail.com');
console.log('SMTP_FROM: aniffour.dev@gmail.com');

