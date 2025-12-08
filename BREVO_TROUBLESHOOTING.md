# 🔧 Brevo SMTP Troubleshooting Guide

## ❌ Problem: OTP Emails Not Sending

If OTP codes are not being sent, follow these steps:

## ✅ Step 1: Verify Your Credentials

**Yes, the SMTP key IS the password!** Here's what you should have:

```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=aniffour.dev@gmail.com
SMTP_PASSWORD=YOUR_SMTP_PASSWORD_KEY
SMTP_FROM=noreply@brevo.com
```

### Important Notes:
- ✅ **SMTP_PASSWORD** = Your SMTP key (starts with `xsmtpsib-`)
- ✅ **SMTP_USER** = Your login email (like `aniffour.dev@gmail.com`)
- ✅ These credentials are correct for Brevo

## 🔍 Step 2: Check Server Logs

When you try to send an OTP, check your server console/terminal for these logs:

### Expected Good Logs:
```
📧 SMTP Configuration:
  Host: smtp-relay.brevo.com
  Port: 587
  User: 7bd***
  Password: ✅ Brevo SMTP Key (VALID)
  Provider: ✅ Brevo
🔍 Verifying SMTP connection...
✅ SMTP server connection verified successfully
📤 Sending email to: user@example.com
✅ Email sent successfully!
```

### Common Error Logs to Look For:

#### 1. Authentication Error (EAUTH or 535):
```
❌ SMTP verification failed!
   Error code: EAUTH
   Error responseCode: 535
```

**Fix:**
- Double-check `SMTP_USER` and `SMTP_PASSWORD` in your `.env` file
- Make sure SMTP_PASSWORD is the full SMTP key (starts with `xsmtpsib-`)
- Go to Brevo Dashboard → Settings → SMTP & API → SMTP to verify your credentials
- Regenerate SMTP key if needed

#### 2. Connection Error (ECONNECTION):
```
❌ SMTP verification failed!
   Error code: ECONNECTION
```

**Fix:**
- Check `SMTP_HOST` is exactly: `smtp-relay.brevo.com`
- Check `SMTP_PORT` is: `587`
- Check your internet connection
- Check firewall isn't blocking port 587

#### 3. Credentials Not Set:
```
❌ SMTP credentials not configured!
```

**Fix:**
- Make sure `.env` file exists in project root
- Make sure all SMTP variables are set
- Restart your dev server after updating `.env`

## 📝 Step 3: Verify Environment Variables

### Check Your .env File:

1. Open `.env` or `.env.local` in your project root
2. Verify these exact variables exist:

```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=aniffour.dev@gmail.com
SMTP_PASSWORD=YOUR_SMTP_PASSWORD_KEY
SMTP_FROM=noreply@brevo.com
```

3. **Make sure:**
   - No extra spaces before/after the `=` sign
   - No quotes around values (unless they contain spaces)
   - File is saved
   - Server was restarted after changes

## 🔄 Step 4: Restart Your Server

**CRITICAL:** Environment variables are only loaded when the server starts!

1. Stop your server: `Ctrl+C`
2. Start again: `npm run dev`
3. Try sending OTP again

## 🧪 Step 5: Test SMTP Connection Manually

You can test if Brevo SMTP is working by checking the logs:

1. Try to send an OTP
2. Look at your server console
3. Check for the detailed error messages (the code now shows more info)

## 📧 Step 6: Verify in Brevo Dashboard

1. Go to: https://app.brevo.com
2. Navigate to: **Settings** → **SMTP & API** → **SMTP**
3. Verify:
   - Your SMTP key is active
   - Your login email matches `SMTP_USER`
   - Check if there are any errors or warnings

## 🚨 Common Issues & Solutions

### Issue 1: "Authentication Failed" or "535 Error"

**Causes:**
- Wrong SMTP_USER
- Wrong SMTP_PASSWORD (not using the SMTP key)
- SMTP key was regenerated but .env wasn't updated

**Solution:**
1. Go to Brevo Dashboard
2. Go to Settings → SMTP & API → SMTP
3. Copy the exact SMTP login and SMTP key
4. Update your `.env` file
5. Restart server

### Issue 2: "Connection Timeout" or "ECONNECTION"

**Causes:**
- Wrong SMTP_HOST
- Wrong SMTP_PORT
- Firewall blocking
- Internet connection issue

**Solution:**
1. Verify SMTP_HOST is: `smtp-relay.brevo.com`
2. Verify SMTP_PORT is: `587`
3. Try port `2525` if 587 doesn't work
4. Check firewall settings

### Issue 3: "Credentials Not Configured"

**Causes:**
- .env file doesn't exist
- Environment variables not set
- Server not restarted

**Solution:**
1. Create/update `.env` file in project root
2. Add all SMTP variables
3. Restart server

### Issue 4: Emails Sent But Not Received

**Causes:**
- Email went to spam
- Wrong email address
- Brevo account limits reached

**Solution:**
1. Check spam/junk folder
2. Verify email address is correct
3. Check Brevo dashboard for sending limits
4. Check Brevo email logs

## 🔑 Understanding Brevo SMTP Key

**The SMTP Key format:**
- Starts with: `xsmtpsib-`
- Very long string (like your key)
- This IS your password - use it in `SMTP_PASSWORD`

**Example:**
```
SMTP_PASSWORD=YOUR_SMTP_PASSWORD_KEY
```

## ✅ Quick Checklist

- [ ] `.env` file exists in project root
- [ ] All 5 SMTP variables are set correctly
- [ ] SMTP_PASSWORD starts with `xsmtpsib-`
- [ ] SMTP_HOST is `smtp-relay.brevo.com`
- [ ] SMTP_PORT is `587`
- [ ] Server was restarted after updating .env
- [ ] Checked server logs for errors
- [ ] Verified credentials in Brevo dashboard

## 🆘 Still Not Working?

If after all these steps emails still don't send:

1. **Share your server logs** - The error messages will tell us exactly what's wrong
2. **Verify Brevo account** - Make sure it's active and not suspended
3. **Check Brevo email logs** - Login to Brevo dashboard and check if emails are being processed
4. **Try a different port** - Sometimes port 587 is blocked, try 2525

## 📞 Need More Help?

The code now has **much better error logging**. When you try to send an OTP, check your console/terminal and you'll see detailed error messages that will tell us exactly what's wrong!

Look for these in the logs:
- ❌ SMTP verification failed!
- ❌ Error sending email:
- 💡 Helpful hints about what to check

