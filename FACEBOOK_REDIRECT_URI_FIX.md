# 🔧 Fix: Facebook Redirect URI Mismatch Error

## The Error
```
Facebook login callback failed. Please verify your redirect URI is configured correctly in Facebook App settings.
```

## ✅ Quick Fix

### Step 1: Find Your Domain

Your redirect URI depends on where you're running the app:

**For Production (Vercel):**
- Check your Vercel deployment URL
- Or check your `NEXTAUTH_URL` environment variable in Vercel
- Format: `https://your-domain.vercel.app`

**For Local Development:**
- Format: `http://localhost:3000`

### Step 2: Add the Exact Redirect URI to Facebook

1. Go to https://developers.facebook.com/
2. Select your app
3. Go to **Settings** → **Basic**
4. Scroll down to **"Valid OAuth Redirect URIs"**
5. Add these URIs (one per line):

   **For Production:**
   ```
   https://your-domain.vercel.app/api/auth/callback/facebook
   ```

   **If you have www subdomain, also add:**
   ```
   https://www.your-domain.vercel.app/api/auth/callback/facebook
   ```

   **For Local Development:**
   ```
   http://localhost:3000/api/auth/callback/facebook
   ```

6. **IMPORTANT**: 
   - ✅ Must be **exactly** this format (no trailing slashes)
   - ✅ Must use `https://` for production (not `http://`)
   - ✅ Must include `/api/auth/callback/facebook` at the end
   - ❌ No trailing slash after `facebook`
   - ❌ No extra paths or parameters

7. Click **"Save Changes"**

### Step 3: Verify NEXTAUTH_URL

Make sure your `NEXTAUTH_URL` environment variable matches:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Check `NEXTAUTH_URL`:
   - Should be: `https://your-domain.vercel.app` (no trailing slash)
   - Should match your actual deployment URL
3. If it's wrong, update it and **redeploy**

### Step 4: Wait and Test

1. Wait 2-3 minutes for Facebook to process the changes
2. Clear your browser cache or try incognito mode
3. Try logging in again

---

## 📋 Exact Format Examples

**✅ CORRECT:**
```
https://myapp.vercel.app/api/auth/callback/facebook
https://www.myapp.vercel.app/api/auth/callback/facebook
http://localhost:3000/api/auth/callback/facebook
```

**❌ WRONG:**
```
https://myapp.vercel.app/api/auth/callback/facebook/  (trailing slash)
https://myapp.vercel.app/api/auth/callback/facebook?param=value  (extra params)
http://myapp.vercel.app/api/auth/callback/facebook  (http instead of https for production)
myapp.vercel.app/api/auth/callback/facebook  (missing protocol)
```

---

## 🔍 How to Find Your Exact Domain

### Option 1: Check Vercel Dashboard
1. Go to Vercel Dashboard
2. Select your project
3. Look at the deployment URL (e.g., `myapp-abc123.vercel.app`)

### Option 2: Check Environment Variables
1. Vercel Dashboard → Settings → Environment Variables
2. Look for `NEXTAUTH_URL`
3. That's your domain (without the `/api/auth/callback/facebook` part)

### Option 3: Check Your Browser
1. Visit your deployed site
2. Look at the URL in the address bar
3. That's your domain

---

## ✅ Checklist

Before testing, make sure:

- [ ] Redirect URI is added in Facebook App Settings
- [ ] Redirect URI format is exactly: `https://your-domain/api/auth/callback/facebook`
- [ ] No trailing slashes in the redirect URI
- [ ] Using `https://` for production (not `http://`)
- [ ] `NEXTAUTH_URL` in Vercel matches your domain
- [ ] Saved changes in Facebook Console
- [ ] Waited 2-3 minutes after making changes
- [ ] Cleared browser cache or using incognito mode

---

## 🚨 Still Not Working?

### Check 1: Exact Match Required
Facebook requires the redirect URI to match **exactly**. Check for:
- Typos in the domain
- Missing `https://` or `http://`
- Trailing slashes
- Extra spaces

### Check 2: Multiple Domains
If you have multiple domains (e.g., custom domain + Vercel domain), add **all** of them:
```
https://myapp.vercel.app/api/auth/callback/facebook
https://www.myapp.com/api/auth/callback/facebook
https://myapp.com/api/auth/callback/facebook
```

### Check 3: App Mode
Make sure your Facebook app is in **Live Mode** (not Development mode):
1. Go to **App Review** in Facebook Developers
2. Switch to **Live** mode

### Check 4: Vercel Redeploy
After updating environment variables:
1. Go to Vercel → Deployments
2. Click **"..."** → **"Redeploy"**
3. Uncheck **"Use existing Build Cache"**
4. Click **"Redeploy"**

---

## 💡 Common Mistakes

❌ **Adding the wrong path**: Should be `/api/auth/callback/facebook` not `/auth/callback/facebook`  
❌ **Forgetting the protocol**: Must include `https://` or `http://`  
❌ **Adding trailing slash**: Should end with `facebook` not `facebook/`  
❌ **Using wrong domain**: Must match your actual deployment URL  
❌ **Not waiting**: Facebook changes take 2-3 minutes to propagate  

✅ **Correct format**: `https://your-domain.vercel.app/api/auth/callback/facebook`

---

## 📞 Need Help?

If you're still stuck:
1. Double-check the redirect URI matches exactly (copy-paste to avoid typos)
2. Verify `NEXTAUTH_URL` in Vercel matches your domain
3. Make sure the app is in Live mode
4. Wait 5 minutes and try again
5. Check Vercel Function Logs for any errors

