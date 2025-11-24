# 🔐 Facebook Credentials Update Guide

## New Facebook App Credentials

**APP ID:** `1113892244237925`  
**APP SECRET:** `23da64b9794cade44f971f5089ecff9b`

## ✅ Steps to Update

### Step 1: Update Local Environment File

1. **Create or update `.env.local` file** in your project root (if it doesn't exist)
2. Add or update these lines:

```env
FACEBOOK_CLIENT_ID=1113892244237925
FACEBOOK_CLIENT_SECRET=23da64b9794cade44f971f5089ecff9b
```

**Note:** The `.env.local` file should already be in `.gitignore` and will not be committed to git.

### Step 2: Update Vercel Environment Variables (For Production)

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Update or add these variables:

   - **Variable Name:** `FACEBOOK_CLIENT_ID`
   - **Value:** `1113892244237925`
   - **Environment:** Production, Preview, Development (select all)

   - **Variable Name:** `FACEBOOK_CLIENT_SECRET`
   - **Value:** `23da64b9794cade44f971f5089ecff9b`
   - **Environment:** Production, Preview, Development (select all)

3. Click **"Save"** for each variable

### Step 3: Redeploy Your Application

After updating environment variables in Vercel:

1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Select **"Redeploy"**
4. ✅ **IMPORTANT**: Uncheck **"Use existing Build Cache"**
5. Click **"Redeploy"**

### Step 4: Restart Local Development Server

If you're running locally:

1. Stop your dev server (Ctrl+C)
2. Restart it: `npm run dev`

---

## 🔍 Verify Configuration

After updating, you can verify the credentials are loaded:

1. Check browser console for any Facebook login errors
2. Try logging in with Facebook
3. Check Vercel Function Logs if you see any errors

---

## 📝 Important Notes

1. **Never commit** `.env.local` or `.env` files to git
2. The `.env.local` file should be in `.gitignore`
3. Always update both local and Vercel environment variables
4. Restart your server after changing environment variables

---

## ✅ Checklist

- [ ] Updated `.env.local` file with new credentials
- [ ] Updated Vercel environment variables
- [ ] Redeployed Vercel application
- [ ] Restarted local dev server (if applicable)
- [ ] Tested Facebook login functionality

---

## 🚨 Troubleshooting

If Facebook login still doesn't work after updating:

1. **Clear browser cache** and try again
2. **Check Vercel Function Logs** for errors
3. **Verify** the Facebook App is in **Live Mode**
4. **Verify** redirect URIs are configured correctly
5. **Wait 2-3 minutes** for changes to propagate

See `FACEBOOK_LOGIN_QUICK_FIX.md` for more troubleshooting help.

