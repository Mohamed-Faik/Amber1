# 🚀 Brevo SMTP - Quick Setup Reference

## Your Credentials (Already Configured)

```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=aniffour.dev@gmail.com
SMTP_PASSWORD=YOUR_SMTP_PASSWORD_KEY
SMTP_FROM=noreply@yourdomain.com  ⚠️ CHANGE THIS to your actual domain!
```

## ⚡ Quick Setup Steps

### 1. Local Development (.env file)
Copy the credentials above to your `.env` or `.env.local` file.

**Important:** Change `SMTP_FROM` to use your actual domain email (e.g., `noreply@amberhomes.com`).

### 2. Vercel Production
Go to: **Vercel Dashboard** → **Settings** → **Environment Variables**

Add these 5 variables:
- `SMTP_HOST` = `smtp-relay.brevo.com`
- `SMTP_PORT` = `587`
- `SMTP_USER` = `aniffour.dev@gmail.com`
- `SMTP_PASSWORD` = `YOUR_SMTP_PASSWORD_KEY`
- `SMTP_FROM` = `noreply@yourdomain.com` (change to your domain!)

Then **Redeploy** (uncheck "Use existing Build Cache").

### 3. Domain Authentication (IMPORTANT for Outlook!)

**Go to Brevo Dashboard:**
1. Login: https://app.brevo.com
2. Navigate: **Settings** → **Sender & IP** → **Domains**
3. Click: **"Add a domain"** or **"Authenticate a domain"**
4. Enter your domain name
5. Add the DNS records Brevo provides to your domain's DNS
6. Wait 24-48 hours for verification

**This is critical for Outlook deliverability!**

## ✅ Testing

1. Send a test OTP email
2. Check server logs for: `✅ SMTP server connection verified`
3. Test with an Outlook email address
4. Verify it lands in inbox (not spam)

## 📚 Full Documentation

See `BREVO_SMTP_SETUP.md` for complete instructions.

## ⚠️ Important Notes

- **SMTP_FROM must match your verified domain** in Brevo
- Domain authentication is **required** for Outlook to trust your emails
- DNS changes take 24-48 hours to propagate
- Never commit `.env` files to git

## 🎯 What's Been Done

✅ Email code updated with proper headers and plain text  
✅ Brevo SMTP configuration prepared  
✅ Better deliverability features added  
✅ Domain authentication guide created  

**Next Step:** Configure your domain in Brevo Dashboard and add DNS records!

