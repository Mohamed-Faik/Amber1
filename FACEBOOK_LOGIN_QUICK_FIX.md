# 🚀 Quick Fix: Facebook Login "Feature Unavailable" Error

## The Error
You're seeing:
```
Feature Unavailable
Facebook Login is currently unavailable for this app, since we are updating additional details for this app.
```

## ✅ Quick Fix (3 Steps)

### Step 1: Switch Facebook App to Live Mode

1. Go to https://developers.facebook.com/
2. Select your app
3. Click **"App Review"** in the left sidebar
4. Look for the toggle at the top (shows "Development" or "Live")
5. **Switch it to "Live"** ⬅️ **THIS IS THE MAIN FIX!**

**Good News**: Since you're only using `public_profile` permission, you can switch to Live mode immediately - no App Review needed!

### Step 2: Add Redirect URI

1. Go to **Settings** → **Basic** in your Facebook app
2. Scroll to **"Valid OAuth Redirect URIs"**
3. Add this (replace with your actual domain):
   ```
   https://your-domain.vercel.app/api/auth/callback/facebook
   ```
4. Also add for local development:
   ```
   http://localhost:3000/api/auth/callback/facebook
   ```
5. Click **"Save Changes"**

### Step 3: Add Privacy Policy URL

1. Still in **Settings** → **Basic**
2. Find **"Privacy Policy URL"**
3. Add: `https://your-domain.vercel.app/privacy-policy`
4. Click **"Save Changes"**

## ✅ That's It!

Wait 2-3 minutes for Facebook to update, then try logging in again.

---

## 🔍 Need Your Domain?

To find your domain:
- Check your Vercel deployment URL
- Or check your `NEXTAUTH_URL` environment variable in Vercel

The redirect URI format must be:
```
https://YOUR-DOMAIN/api/auth/callback/facebook
```

---

## ❌ Still Not Working?

1. **Double-check the toggle is on "Live"** (not Development)
2. **Verify redirect URI is exactly**: `https://your-domain.vercel.app/api/auth/callback/facebook`
3. **Wait 5 minutes** after making changes
4. **Clear browser cache** or try incognito mode
5. **Redeploy your Vercel app** after making changes

---

## 📋 Full Guide

For more detailed instructions, see: `FACEBOOK_LOGIN_SETUP.md`

