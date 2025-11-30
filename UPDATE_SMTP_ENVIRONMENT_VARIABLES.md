# 🔄 How to Update SMTP Environment Variables

## ⚠️ Problem
You're still receiving emails from the old Gmail address (`aniffour.dev@gmail.com`) instead of Brevo because your environment variables haven't been updated yet.

## ✅ Solution: Update Environment Variables

### Step 1: Local Development (.env file)

1. **Find your `.env` or `.env.local` file** in the project root directory

2. **Open it and update these variables:**

```env
# OLD Gmail Settings (REMOVE OR UPDATE THESE):
# SMTP_HOST=smtp-relay.brevo.com
# SMTP_USER=locamarrakech.com@gmail.com
# SMTP_PASSWORD=your-old-gmail-password

# NEW Brevo Settings (ADD OR UPDATE TO THESE):
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=aniffour.dev@gmail.com
SMTP_PASSWORD=YOUR_SMTP_PASSWORD_KEY
SMTP_FROM=noreply@yourdomain.com
```

**⚠️ Important:** 
- Replace `yourdomain.com` in `SMTP_FROM` with your actual domain
- Or use a Brevo verified sender address

3. **Save the file**

4. **Restart your development server:**
   - Stop the server (press `Ctrl+C` in terminal)
   - Start it again: `npm run dev`

### Step 2: Vercel Production Environment

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Select your project (AmbersHomes)

2. **Navigate to Environment Variables:**
   - Click **Settings** → **Environment Variables**

3. **Update/Add these variables:**

   **a) SMTP_HOST:**
   - If it exists, click to edit, otherwise click **Add New**
   - Key: `SMTP_HOST`
   - Value: `smtp-relay.brevo.com`
   - Environment: Select **Production**, **Preview**, and **Development**
   - Click **Save**

   **b) SMTP_PORT:**
   - Key: `SMTP_PORT`
   - Value: `587`
   - Environment: Select all
   - Click **Save**

   **c) SMTP_USER:**
   - Key: `SMTP_USER`
   - Value: `7bd403001@smtp-brevo.com`
   - Environment: Select all
   - Click **Save**

   **d) SMTP_PASSWORD:**
   - Key: `SMTP_PASSWORD`
   - Value: `YOUR_SMTP_PASSWORD_KEY`
   - Environment: Select all
   - Click **Save**

   **e) SMTP_FROM:**
   - Key: `SMTP_FROM`
   - Value: `noreply@yourdomain.com` (replace with your actual domain!)
   - Environment: Select all
   - Click **Save**

4. **Delete old Gmail variables (if they exist):**
   - Look for any variables with old Gmail values
   - Delete them or make sure they're not being used

5. **Redeploy the application:**
   - Go to **Deployments** tab
   - Click **"..."** (three dots) on the latest deployment
   - Select **"Redeploy"**
   - ✅ **CRITICAL**: Uncheck **"Use existing Build Cache"**
   - Click **"Redeploy"**

### Step 3: Verify It's Working

1. **Check server logs** when sending an email:
   - Look for: `📧 SMTP Configuration:`
   - Should show:
     ```
     Host: smtp-relay.brevo.com
     Provider: ✅ Brevo
     From Email: noreply@yourdomain.com (or your Brevo email)
     ```

2. **Send a test OTP email**

3. **Check the "From" address** in the received email
   - Should be from Brevo, not Gmail
   - Should show your `SMTP_FROM` address

## 🔍 Troubleshooting

### Still seeing old Gmail address?

1. **Check if you updated the right file:**
   - Make sure you're editing `.env` or `.env.local` (not `.env.example`)
   - File should be in project root (same folder as `package.json`)

2. **Check if server was restarted:**
   - Environment variables are loaded when the server starts
   - You MUST restart after changing `.env` file

3. **Check Vercel environment variables:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Verify all 5 SMTP variables are set correctly
   - Make sure you **redeployed** after updating

4. **Check server logs:**
   - Look at your terminal (local) or Vercel Function Logs (production)
   - Find the log: `📧 SMTP Configuration:`
   - Verify it shows Brevo settings

5. **Check for multiple .env files:**
   - You might have `.env`, `.env.local`, `.env.production`
   - Update the one your app is actually using
   - Next.js priority: `.env.local` > `.env.production` > `.env`

### Common Mistakes

❌ **Forgot to restart server** after updating `.env`  
❌ **Updated wrong environment** (local vs Vercel)  
❌ **Didn't redeploy** after updating Vercel variables  
❌ **Used cached build** - make sure to uncheck "Use existing Build Cache"  
❌ **Wrong SMTP_FROM** - still pointing to Gmail address  

## ✅ Quick Checklist

- [ ] Updated `.env` or `.env.local` file with Brevo credentials
- [ ] Restarted local development server
- [ ] Updated all 5 SMTP variables in Vercel
- [ ] Redeployed Vercel (with cache unchecked)
- [ ] Verified server logs show "✅ Brevo"
- [ ] Test email shows Brevo "From" address

## 📝 Need Help?

If you're still having issues:

1. **Share your server logs** showing the SMTP Configuration output
2. **Check Vercel Function Logs** for any errors
3. **Verify environment variables** are actually set (check Vercel dashboard)

The code is ready - you just need to update your environment variables! 🚀

