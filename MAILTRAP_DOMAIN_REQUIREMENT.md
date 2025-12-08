# ⚠️ Mailtrap Domain Requirement

## The Problem

Mailtrap does NOT allow sending from:
- ❌ Gmail addresses (`@gmail.com`)
- ❌ Mailtrap's own domain (`@mailtrap.io`)

**You MUST verify your own domain first!**

## ✅ Solution Options

### Option 1: Verify Your Domain in Mailtrap (Recommended)

1. Go to Mailtrap Dashboard: https://mailtrap.io
2. Navigate to: **Email Sending** → **Domains**
3. Click **"Add Domain"**
4. Enter your domain (e.g., `amberhomes.com`)
5. Add the DNS records Mailtrap provides
6. Wait for verification (can take a few minutes)
7. Then use:
   ```env
   SMTP_FROM=noreply@amberhomes.com
   ```

### Option 2: Switch to Resend (Easier - 2 minutes setup)

Resend is much simpler and doesn't require domain verification for basic sending. Want me to set it up?

## 🆘 Quick Temporary Fix

For now, use ANY email that's NOT Gmail or Mailtrap:
```env
SMTP_FROM=noreply@yourdomain.com
SMTP_FROM=contact@amberhomes.com
```

But you still need to verify the domain in Mailtrap first!

## 💡 Recommendation

**Switch to Resend** - it's much simpler and faster to set up. Would you like me to configure Resend instead?

