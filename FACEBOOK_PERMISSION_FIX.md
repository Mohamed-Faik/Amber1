# 🔧 Fix: "This app needs at least one supported permission" Error

## The Error
Facebook is showing:
```
"It looks like this app isn't available"
"This app needs at least one supported permission."
```

## ✅ Solution: Configure Facebook App Permissions

### Step 1: Go to Facebook Login Settings

1. Go to https://developers.facebook.com/
2. Select your app (with App ID: `1113892244237925`)
3. In the left sidebar, click **"Facebook Login"** → **"Settings"**

### Step 2: Configure Valid OAuth Redirect URIs

1. Scroll down to **"Valid OAuth Redirect URIs"**
2. Add these URIs (replace with your actual domain):

   **For Production (Vercel):**
   ```
   https://amberhomes-liart.vercel.app/api/auth/callback/facebook
   https://www.amberhomes-liart.vercel.app/api/auth/callback/facebook
   ```

   **For Local Development:**
   ```
   http://localhost:3000/api/auth/callback/facebook
   ```

   **If you have a custom domain, also add:**
   ```
   https://your-custom-domain.com/api/auth/callback/facebook
   https://www.your-custom-domain.com/api/auth/callback/facebook
   ```

3. Click **"Save Changes"**

### Step 3: Configure App Domains

1. Go to **Settings** → **Basic** in your Facebook app
2. Scroll to **"App Domains"**
3. Add your domains (one per line):
   ```
   amberhomes-liart.vercel.app
   www.amberhomes-liart.vercel.app
   localhost
   ```
   (Add your custom domain if you have one)

### Step 4: Set Privacy Policy URL

1. Still in **Settings** → **Basic**
2. Find **"Privacy Policy URL"**
3. Add: `https://amberhomes-liart.vercel.app/privacy-policy`
   (Or your actual privacy policy URL)

### Step 5: Add Required Permissions

1. Go to **Facebook Login** → **Settings** in your app
2. Under **"Permissions and Features"**, make sure you have:
   - ✅ `public_profile` - This is the basic permission we're using

3. **Important**: Your app is currently configured to use only `public_profile` permission (which doesn't require App Review). This should be sufficient.

### Step 6: Switch App to Live Mode

1. Go to **App Review** (in the left sidebar)
2. At the top, toggle from **"Development"** to **"Live"**
3. **Note**: For `public_profile` permission, you can switch to Live mode immediately - no App Review needed!

### Step 7: Verify Permissions Are Enabled

1. Go to **Facebook Login** → **Settings**
2. Check that **"public_profile"** is listed under permissions
3. Make sure the app is using **"Facebook Login API"** version that supports `public_profile`

## 🔍 Troubleshooting

### If Still Getting the Error:

1. **Wait 2-5 minutes** after making changes - Facebook needs time to update
2. **Clear browser cache** or try incognito mode
3. **Double-check App ID**: Make sure you're using the correct App ID (`1113892244237925`)
4. **Verify App Status**: Go to **App Review** and ensure the app is in **Live** mode

### Check App Permissions:

1. Go to **Facebook Login** → **Settings**
2. Look for **"Permissions and Features"** section
3. Ensure `public_profile` is listed and enabled

### Verify OAuth Redirect URI:

1. Make sure the redirect URI is **exactly**:
   ```
   https://amberhomes-liart.vercel.app/api/auth/callback/facebook
   ```
   - No trailing slashes
   - Must use `https://` for production
   - Must match your actual deployment URL

## ✅ Quick Checklist

- [ ] Valid OAuth Redirect URIs configured
- [ ] App Domains configured
- [ ] Privacy Policy URL set
- [ ] App switched to Live Mode
- [ ] `public_profile` permission enabled
- [ ] Wait 2-5 minutes after making changes
- [ ] Cleared browser cache and tried again

## 📝 Current Configuration

Your app is configured to use:
- **Permission**: `public_profile` (basic, no App Review needed)
- **App ID**: `1113892244237925`
- **Scope**: Only requesting public profile information

This is the simplest setup and should work immediately once the above steps are completed.

## 🔄 After Making Changes

1. **Wait 2-5 minutes** for Facebook to process changes
2. **Clear browser cache** or use incognito mode
3. **Try Facebook login again**

If the error persists after following these steps, the issue might be that the app was just created and needs a few more minutes to fully activate. Wait 10-15 minutes and try again.

