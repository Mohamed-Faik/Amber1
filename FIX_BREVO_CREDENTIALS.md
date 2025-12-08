# 🔧 Fix: Brevo Authentication Error (535)

## ❌ The Problem

You're getting:
```
Error: Invalid login: 535 5.7.8 Authentication failed
```

This means Brevo is rejecting your login credentials.

## 🚨 Root Cause: Confused SMTP_USER and SMTP_FROM

You have **TWO different email addresses** for Brevo:

1. **SMTP_USER** = Your Brevo SMTP login (for authentication)
2. **SMTP_FROM** = Your sender email (what appears in emails)

**These are DIFFERENT things!**

## ✅ Correct Configuration

### Your .env file should have:

```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587

# This is your BREVO SMTP login (for connecting to Brevo servers)
SMTP_USER=7bd403001@smtp-brevo.com

# This is your BREVO SMTP key (password)
SMTP_PASSWORD=YOUR_SMTP_PASSWORD_KEY

# This is your VERIFIED sender email (what appears in the email "From" field)
SMTP_FROM=aniffour.dev@gmail.com
```

## 📝 Key Points

### SMTP_USER (For Authentication)
- **Must be:** `7bd403001@smtp-brevo.com` (your Brevo SMTP login)
- **Purpose:** Used to authenticate with Brevo's SMTP server
- **Do NOT change this!** This is your Brevo account login

### SMTP_FROM (For Sender Display)
- **Must be:** Your verified sender email in Brevo (e.g., `aniffour.dev@gmail.com`)
- **Purpose:** The email address that appears in the "From" field
- **Must be verified** in Brevo Dashboard → Settings → Sender & IP → Senders

## 🔧 How to Fix

### Step 1: Check Your Current .env File

Open your `.env` file and make sure it looks like this:

```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=7bd403001@smtp-brevo.com
SMTP_PASSWORD=YOUR_SMTP_PASSWORD_KEY
SMTP_FROM=aniffour.dev@gmail.com
```

**Important:**
- `SMTP_USER` = `7bd403001@smtp-brevo.com` (NOT your Gmail!)
- `SMTP_FROM` = `aniffour.dev@gmail.com` (your verified sender)

### Step 2: Verify Your Brevo Credentials

1. Go to: https://app.brevo.com
2. Navigate to: **Settings** → **SMTP & API** → **SMTP**
3. Check:
   - **SMTP Login:** Should be `7bd403001@smtp-brevo.com`
   - **SMTP Key:** Should match your `SMTP_PASSWORD` in `.env`

If your SMTP key has changed, update it in `.env`.

### Step 3: Verify Your Sender Email

1. Go to: https://app.brevo.com
2. Navigate to: **Settings** → **Sender & IP** → **Senders**
3. Make sure `aniffour.dev@gmail.com` shows as **"Verified"** ✅

If not verified:
- Click on it
- Check if verification email was sent
- Verify it via the confirmation link

### Step 4: Restart Server

After updating `.env`:
1. Stop server: `Ctrl+C`
2. Start again: `npm run dev`

### Step 5: Test Again

Try sending an OTP and check console for:
- ✅ `SMTP server connection verified successfully`
- ✅ `Email sent successfully!`

## 📊 Quick Reference

| Variable | Value | Purpose |
|----------|-------|---------|
| `SMTP_USER` | `7bd403001@smtp-brevo.com` | Login to Brevo SMTP server |
| `SMTP_PASSWORD` | `xsmtpsib-...` | Password (SMTP key) for Brevo |
| `SMTP_FROM` | `aniffour.dev@gmail.com` | Sender email (verified in Brevo) |

## 🔍 Common Mistakes

❌ **Wrong:**
```env
SMTP_USER=aniffour.dev@gmail.com  # NO! This is for SMTP_FROM
```

✅ **Correct:**
```env
SMTP_USER=7bd403001@smtp-brevo.com  # YES! This is your Brevo login
SMTP_FROM=aniffour.dev@gmail.com     # YES! This is your sender email
```

## 🎯 Summary

- **SMTP_USER** = Always `7bd403001@smtp-brevo.com` (Brevo login)
- **SMTP_FROM** = Your verified Gmail (`aniffour.dev@gmail.com`)
- They serve different purposes - don't mix them up!

## ✅ Checklist

- [ ] `SMTP_USER` = `7bd403001@smtp-brevo.com` (NOT your Gmail)
- [ ] `SMTP_PASSWORD` = Your Brevo SMTP key (starts with `xsmtpsib-`)
- [ ] `SMTP_FROM` = `aniffour.dev@gmail.com` (your verified sender)
- [ ] Sender email is verified in Brevo Dashboard
- [ ] Server restarted after updating `.env`
- [ ] Test sending OTP - should work now!

