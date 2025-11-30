# 🔍 Verify Your Brevo SMTP Credentials

## ❌ You're Still Getting Authentication Error

The error shows: `User: ani***` which means your `.env` file still has the wrong value.

## ✅ Step-by-Step Fix

### Step 1: Get Your EXACT Credentials from Brevo

1. **Go to Brevo Dashboard:**
   - Visit: https://app.brevo.com
   - Login with your account

2. **Navigate to SMTP Settings:**
   - Click: **Settings** (top right)
   - Click: **SMTP & API** (left sidebar)
   - Click: **SMTP** tab

3. **Copy Your EXACT Credentials:**
   - **SMTP Login:** (copy this EXACTLY)
   - **SMTP Key:** (copy the full key starting with `xsmtpsib-`)

   **Write them down here:**
   ```
   SMTP Login: ________________________________
   SMTP Key: __________________________________
   ```

### Step 2: Check Your .env File

1. **Find your `.env` file:**
   - It should be in: `C:\Users\aniff\Documents\Projects\clients\medfaiks\AmbersHomes\.env`
   - Or look for `.env.local` in the same folder

2. **Open it and check these lines:**

   ```env
   SMTP_USER=?????????
   SMTP_PASSWORD=?????????
   ```

3. **Compare with Brevo Dashboard:**
   - `SMTP_USER` should EXACTLY match "SMTP Login" from Brevo
   - `SMTP_PASSWORD` should EXACTLY match "SMTP Key" from Brevo

### Step 3: Common Issues to Check

#### Issue A: Wrong File
You might have multiple `.env` files:
- `.env`
- `.env.local`
- `.env.development`

**Check ALL of them!** Next.js uses `.env.local` first if it exists.

#### Issue B: SMTP_USER Format
Brevo might use different formats. Try BOTH:

**Option 1:**
```env
SMTP_USER=YOUR_SMTP_USERNAME@smtp-brevo.com
```

**Option 2 (without @smtp-brevo.com):**
```env
SMTP_USER=YOUR_SMTP_USERNAME
```

#### Issue C: Server Not Restarted
**CRITICAL:** Environment variables only load when server starts!

1. Stop server completely (`Ctrl+C`)
2. Wait 2 seconds
3. Start again: `npm run dev`

### Step 4: Test Different Formats

Try these configurations one by one:

**Test 1: Full format**
```env
SMTP_USER=YOUR_SMTP_USERNAME@smtp-brevo.com
SMTP_PASSWORD=YOUR_SMTP_PASSWORD_KEY
```

**Test 2: Username only**
```env
SMTP_USER=YOUR_SMTP_USERNAME
SMTP_PASSWORD=YOUR_SMTP_PASSWORD_KEY
```

### Step 5: Verify SMTP Key

1. **Check if key is correct:**
   - Should start with: `xsmtpsib-`
   - Should be very long (around 90 characters)
   - No spaces before/after

2. **Check if key is active:**
   - In Brevo Dashboard → SMTP & API → SMTP
   - Make sure key is "Active" (not deleted/expired)
   - If inactive, create a NEW key

3. **Generate a new key if needed:**
   - Click "Generate a new key"
   - Copy the new key
   - Update `.env` with new key
   - Restart server

## 🔧 Quick Debugging Steps

### 1. Print Your Current Values

Add this temporarily to see what's actually loaded:

Add this to your `.env` file temporarily:
```env
# Debug: Print these values
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=YOUR_SMTP_USERNAME@smtp-brevo.com
SMTP_PASSWORD=YOUR_SMTP_PASSWORD_KEY
SMTP_FROM=aniffour.dev@gmail.com
```

### 2. Check for Hidden Characters

Make sure there are NO:
- Spaces before/after `=`
- Quotes around values (unless needed)
- Special characters
- Line breaks in the middle

### 3. Verify File Location

Run this command in your project folder to find `.env` files:
```bash
dir .env* /s
```

Make sure you're editing the RIGHT file!

## ✅ Final Checklist

- [ ] Opened Brevo Dashboard → Settings → SMTP & API → SMTP
- [ ] Copied EXACT "SMTP Login" value
- [ ] Copied EXACT "SMTP Key" value
- [ ] Opened `.env` file (or `.env.local`)
- [ ] `SMTP_USER` matches "SMTP Login" EXACTLY
- [ ] `SMTP_PASSWORD` matches "SMTP Key" EXACTLY
- [ ] No extra spaces or quotes
- [ ] Saved the file
- [ ] Stopped server completely (`Ctrl+C`)
- [ ] Waited 2 seconds
- [ ] Started server again (`npm run dev`)
- [ ] Tested sending OTP

## 🆘 If Still Not Working

If you've tried everything and it still doesn't work:

1. **Create a NEW SMTP key in Brevo:**
   - Brevo Dashboard → SMTP & API → SMTP
   - Delete old key
   - Generate new key
   - Copy new key to `.env`

2. **Check Brevo account status:**
   - Make sure account is active
   - Check if you've hit sending limits
   - Verify account hasn't been suspended

3. **Try a different port:**
   ```env
   SMTP_PORT=2525
   ```

4. **Contact Brevo support:**
   - They can verify your credentials are correct
   - They can check if there's an account issue

## 📞 Need Immediate Help?

If you want to try a different solution:
- **Resend** (modern, easy setup)
- **SendGrid** (popular alternative)
- **Mailgun** (developer-friendly)
- **Postmark** (great deliverability)

I can help you set up any of these if Brevo continues to have issues!

