# ✅ Correct Brevo Configuration

## ❌ Current Problem

Your `.env` has:
```env
SMTP_USER=aniffour.dev@gmail.com  # ❌ WRONG!
```

This causes: `Error: Invalid login: 535 5.7.8 Authentication failed`

## ✅ Correct Configuration

Update your `.env` file to:

```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587

# ✅ This is your BREVO SMTP LOGIN (for authentication)
#    Get this from: Brevo Dashboard → Settings → SMTP & API → SMTP
SMTP_USER=7bd403001@smtp-brevo.com

# ✅ This is your BREVO SMTP KEY (password)
SMTP_PASSWORD=YOUR_SMTP_PASSWORD_KEY

# ✅ This is your VERIFIED SENDER EMAIL (what appears in emails)
#    Must be verified in: Brevo Dashboard → Settings → Sender & IP → Senders
SMTP_FROM=aniffour.dev@gmail.com
```

## 📝 Important Notes

### SMTP_USER
- **What it is:** Your Brevo SMTP server login
- **Format:** `7bd403001@smtp-brevo.com` (your Brevo account login)
- **Purpose:** Authenticates your connection to Brevo's SMTP servers
- **Where to find:** Brevo Dashboard → Settings → SMTP & API → SMTP → "SMTP Login"

### SMTP_FROM
- **What it is:** The email address that appears as the sender
- **Format:** Your verified email (e.g., `aniffour.dev@gmail.com`)
- **Purpose:** Shows up in the "From" field of sent emails
- **Requirement:** Must be verified in Brevo Dashboard → Settings → Sender & IP → Senders

## 🔧 Steps to Fix

1. **Open your `.env` file**

2. **Change `SMTP_USER` back to:**
   ```env
   SMTP_USER=7bd403001@smtp-brevo.com
   ```

3. **Keep `SMTP_FROM` as:**
   ```env
   SMTP_FROM=aniffour.dev@gmail.com
   ```

4. **Save the file**

5. **Restart your server:**
   - Stop: `Ctrl+C`
   - Start: `npm run dev`

6. **Test sending an OTP**

## 🎯 Quick Reference

| Variable | Value | Purpose |
|----------|-------|---------|
| `SMTP_USER` | `7bd403001@smtp-brevo.com` | Login to Brevo SMTP |
| `SMTP_PASSWORD` | `xsmtpsib-...` | Password for Brevo SMTP |
| `SMTP_FROM` | `aniffour.dev@gmail.com` | Sender email address |

## ✅ After Fixing

You should see in console:
```
✅ SMTP server connection verified successfully
✅ Email sent successfully!
```

And emails will show as:
```
From: "AmberHomes" <aniffour.dev@gmail.com>
```

## 🚨 Remember

- **SMTP_USER** = Always your Brevo SMTP login (`7bd403001@smtp-brevo.com`)
- **SMTP_FROM** = Your verified sender email (`aniffour.dev@gmail.com`)
- **Never mix them up!**

