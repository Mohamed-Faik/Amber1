# 🔧 Quick Fix: Facebook Login "Feature Unavailable" Error

## The Problem
You're seeing this error:
```
Feature Unavailable
Facebook Login is currently unavailable for this app, since we are updating additional details for this app. Please try again later.
```

## ✅ Solution Steps (Do These in Order)

### Step 1: Check Your Facebook App Mode

1. Go to [Facebook Developers Console](https://developers.facebook.com/)
2. Select your app
3. Look at the top right - you'll see either **"Development"** or **"Live"** mode

### Step 2: Switch App to Live Mode (Most Common Fix)

If your app is in **Development Mode**, you need to switch it to **Live Mode**:

1. In Facebook Developers Console, go to **App Review** (left sidebar)
2. At the top, you'll see a toggle switch
3. Click it to switch from **"Development"** to **"Live"**
4. ✅ **Good news**: Since we only use `public_profile` permission, you can switch to Live mode immediately - no App Review needed!

### Step 3: Add Required URLs to Facebook App Settings

1. Go to **Settings** → **Basic** in your Facebook app
2. Scroll down to **"Valid OAuth Redirect URIs"**
3. Add these URIs (replace with your actual domain):

   **For Production (Vercel):**
   ```
   https://your-domain.vercel.app/api/auth/callback/facebook
   https://www.your-domain.vercel.app/api/auth/callback/facebook
   ```

   **For Local Development:**
   ```
   http://localhost:3000/api/auth/callback/facebook
   ```

   **If you have a custom domain:**
   ```
   https://your-custom-domain.com/api/auth/callback/facebook
   https://www.your-custom-domain.com/api/auth/callback/facebook
   ```

4. Click **"Save Changes"**

### Step 4: Add App Domains

1. Still in **Settings** → **Basic**
2. Find **"App Domains"**
3. Add your domains (one per line):
   ```
   your-domain.vercel.app
   www.your-domain.vercel.app
   your-custom-domain.com
   www.your-custom-domain.com
   ```

### Step 5: Add Privacy Policy URL (Required)

1. Still in **Settings** → **Basic**
2. Find **"Privacy Policy URL"**
3. Add: `https://your-domain.vercel.app/privacy-policy`
   (Or your actual privacy policy URL)

### Step 6: Verify Environment Variables

Make sure these are set in your Vercel project:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Verify these exist:
   - `FACEBOOK_CLIENT_ID` - Your Facebook App ID
   - `FACEBOOK_CLIENT_SECRET` - Your Facebook App Secret
   - `NEXTAUTH_URL` - Must be exactly: `https://your-domain.vercel.app` (no trailing slash)
   - `NEXTAUTH_SECRET` - Your secret key

### Step 7: Redeploy Your App

After making changes:

1. Go to **Vercel Dashboard** → **Deployments**
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. ✅ Make sure to **uncheck** "Use existing Build Cache"
5. Click **"Redeploy"**

### Step 8: Wait a Few Minutes

Facebook changes can take 2-5 minutes to propagate. Wait a bit before testing.

---

## 🎯 Quick Checklist

Before testing, make sure:

- [ ] Facebook App is in **Live Mode** (not Development)
- [ ] Valid OAuth Redirect URIs are added with your exact domain
- [ ] App Domains are configured
- [ ] Privacy Policy URL is set
- [ ] Environment variables are set in Vercel
- [ ] App has been redeployed
- [ ] Waited 2-5 minutes after making changes

---

## 🚨 Still Not Working?

### Check 1: Is the redirect URI exact?
The redirect URI must be **exactly**:
```
https://your-domain.vercel.app/api/auth/callback/facebook
```
- No trailing slashes
- Must be `https://` (not `http://`)
- Must match your Vercel deployment URL exactly

### Check 2: Is NEXTAUTH_URL correct?
In Vercel environment variables, `NEXTAUTH_URL` must be:
```
https://your-domain.vercel.app
```
- No trailing slash
- Must match your deployment URL

### Check 3: Test with Incognito Mode
Clear your browser cache or test in incognito/private mode to rule out cached errors.

### Check 4: Check Vercel Function Logs
1. Go to Vercel Dashboard → Your Project → **Functions** tab
2. Look for errors related to `/api/auth/callback/facebook`
3. Check for any configuration errors

---

## 📝 Common Mistakes to Avoid

❌ **Don't** add trailing slashes to redirect URIs  
❌ **Don't** use `http://` for production URLs  
❌ **Don't** forget to switch to Live Mode  
❌ **Don't** forget to save changes in Facebook Console  
❌ **Don't** forget to redeploy after changing environment variables  

✅ **Do** use exact URLs (no typos)  
✅ **Do** wait 2-5 minutes after making changes  
✅ **Do** check that all environment variables are set  
✅ **Do** verify the app is in Live Mode  

---

## 💡 Why This Happens

Facebook shows this error when:
1. App is in Development mode and you're trying to use it in production
2. Redirect URIs don't match exactly
3. Required settings (like Privacy Policy URL) are missing
4. App domains are not configured

The good news: Once you switch to Live Mode and configure the redirect URIs correctly, it should work immediately!

---

## 📞 Need More Help?

If you're still stuck:
1. Check the full guide: `FACEBOOK_LOGIN_SETUP.md`
2. Verify all steps above are completed
3. Check Vercel Function Logs for specific error messages
4. Make sure your Facebook App ID and Secret are correct

