# ✅ Mailtrap SMTP Setup Guide

## 🎉 Switching to Mailtrap

Mailtrap is much simpler to set up! Here's your configuration:

## 📧 Your Mailtrap Credentials

```
Host: live.smtp.mailtrap.io
Port: 587
Username: api
Password: d448bbe7b015a1c90b986eb2f46affec
```

## 🔧 Step 1: Update Your .env File

Open your `.env` or `.env.local` file and update it:

```env
SMTP_HOST=live.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=api
SMTP_PASSWORD=d448bbe7b015a1c90b986eb2f46affec
SMTP_FROM=noreply@yourdomain.com
```

**Note:** Change `SMTP_FROM` to your preferred sender email (e.g., `noreply@amberhomes.com` or `your-email@gmail.com`).

## ✅ Step 2: Restart Your Server

1. Stop your server: `Ctrl+C`
2. Start again: `npm run dev`

## 🧪 Step 3: Test

Try sending an OTP email. You should see:

```
📧 SMTP Configuration:
  Host: live.smtp.mailtrap.io
  Port: 587
  User (FULL): api
  Provider: ✅ Mailtrap
✅ SMTP server connection verified successfully
✅ Email sent successfully!
```

## 🎯 Benefits of Mailtrap

✅ **Simple setup** - No complex authentication  
✅ **Reliable** - Great deliverability  
✅ **Easy credentials** - Just username "api" and your token  
✅ **No sender verification needed** - Works immediately  

## 📝 Quick Reference

| Variable | Value |
|----------|-------|
| `SMTP_HOST` | `live.smtp.mailtrap.io` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `api` |
| `SMTP_PASSWORD` | `d448bbe7b015a1c90b986eb2f46affec` |
| `SMTP_FROM` | Your sender email |

## 🆘 Troubleshooting

### Still getting errors?

1. **Check your .env file** - Make sure all values are correct
2. **Restart server** - Environment variables load on startup
3. **Check Mailtrap dashboard** - Verify your API token is active

### Need to change sender email?

Just update `SMTP_FROM` in your `.env`:
```env
SMTP_FROM=noreply@amberhomes.com
```

That's it! Much simpler than Brevo! 🚀

