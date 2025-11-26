/**
 * Script to help diagnose Facebook Login configuration issues
 * Run this to check your Facebook redirect URI configuration
 */

console.log('🔍 Facebook Login Configuration Checker\n');

// Get the base URL from environment or use default
const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000';

// Ensure no trailing slash
const cleanBaseUrl = baseUrl.replace(/\/$/, '');

// Construct the redirect URI
const redirectUri = `${cleanBaseUrl}/api/auth/callback/facebook`;

console.log('📋 Your Facebook Redirect URI should be:');
console.log(`\n   ${redirectUri}\n`);
console.log('📝 Steps to fix:');
console.log('   1. Go to https://developers.facebook.com/');
console.log('   2. Select your app');
console.log('   3. Go to Settings → Basic');
console.log('   4. Scroll to "Valid OAuth Redirect URIs"');
console.log('   5. Add the URI above (copy-paste it exactly)');
console.log('   6. Click "Save Changes"');
console.log('   7. Wait 2-3 minutes and try again\n');

console.log('✅ Checklist:');
console.log(`   [ ] Redirect URI added: ${redirectUri}`);
console.log(`   [ ] NEXTAUTH_URL is set to: ${cleanBaseUrl}`);
console.log('   [ ] Facebook app is in Live mode (not Development)');
console.log('   [ ] FACEBOOK_CLIENT_ID is set');
console.log('   [ ] FACEBOOK_CLIENT_SECRET is set');
console.log('   [ ] Privacy Policy URL is set in Facebook app\n');

console.log('📚 For more help, see: FACEBOOK_REDIRECT_URI_FIX.md\n');

