# 🔧 Fix: "This app needs at least one supported permission" Error

## The Error
Facebook shows:
```
"It looks like this app isn't available"
"This app needs at least one supported permission."
```

## ✅ Solution: Configure Facebook App Properly

### Step 1: Add Facebook Login Product to Your App

1. Go to https://developers.facebook.com/
2. Select your app (App ID: `1113892244237925`)
3. In your app dashboard, look for **"Add Product"** or find **"Facebook Login"** in the left sidebar
4. If Facebook Login is not added:
   - Click **"Add Product"** button
   - Find **"Facebook Login"**
   - Click **"Set Up"** button
   - This will add the Facebook Login product to your app

### Step 2: Configure Facebook Login Settings

1. After adding Facebook Login, go to **"Facebook Login"** → **"Settings"** (in left sidebar)
2. Scroll down to **"Valid OAuth Redirect URIs"**
3. Add these URIs:

   **For Production:**
   ```
   https://amberhomes-liart.vercel.app/api/auth/callback/facebook
   ```

   **For Local Development:**
   ```
   http://localhost:3000/api/auth/callback/facebook
   ```

4. Click **"Save Changes"**

### Step 3: Configure Basic App Settings

1. Go to **Settings** → **Basic** in your Facebook app
2. Set **"App Domains"**:
   ```
   amberhomes-liart.vercel.app
   localhost
   ```
3. Set **"Privacy Policy URL"**:
   ```
   https://amberhomes-liart.vercel.app/privacy-policy
   ```
4. Click **"Save Changes"**

### Step 4: Switch App to Live Mode

1. Go to **App Review** (left sidebar)
2. At the top, you'll see a toggle switch
3. Click to switch from **"Development"** to **"Live"**
4. ✅ **Good news**: Since we're only using `public_profile` permission, you can switch to Live mode immediately - no App Review needed!

### Step 5: Verify Permissions

1. Go to **Facebook Login** → **Settings**
2. Under **"Permissions and Features"**, you should see:
   - ✅ `public_profile` - This is automatically available
3. This permission doesn't require App Review and should work immediately

### Step 6: Redeploy Your App (If Using Vercel)

After updating environment variables:
1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click **"..."** → **"Redeploy"**
3. Uncheck **"Use existing Build Cache"**
4. Click **"Redeploy"**

## 🔍 Common Issues

### Issue: "Facebook Login" product not added
**Solution**: Follow Step 1 above to add the Facebook Login product

### Issue: App still showing as unavailable
**Solution**: 
- Make sure you've completed all steps above
- Wait 5-10 minutes for Facebook to process changes
- Clear browser cache and try again
- Make sure the app is in **Live Mode** (not Development)

### Issue: Redirect URI not working
**Solution**:
- Verify the redirect URI is exactly: `https://amberhomes-liart.vercel.app/api/auth/callback/facebook`
- No trailing slashes
- Must match your actual deployment URL

## ✅ Quick Checklist

- [ ] Facebook Login product is added to your app
- [ ] Valid OAuth Redirect URIs configured
- [ ] App Domains configured
- [ ] Privacy Policy URL set
- [ ] App switched to Live Mode
- [ ] Environment variables updated in Vercel (if using)
- [ ] App redeployed
- [ ] Waited 5-10 minutes after making changes
- [ ] Cleared browser cache

## 📝 Important Notes

1. **New Facebook App**: If this is a brand new app, it might take 10-15 minutes for all settings to fully activate
2. **public_profile Permission**: This is automatically available - you don't need to request it explicitly, just make sure Facebook Login product is set up
3. **Live Mode**: The app must be in Live mode for it to work in production

## 🚨 Still Not Working?

If you've completed all steps and it's still not working:

1. **Wait 15-20 minutes** - New Facebook apps sometimes take time to fully activate
2. **Double-check App ID**: Make sure you're using App ID `1113892244237925`
3. **Check App Status**: Go to Facebook Developers → Your App → Check for any warnings or errors
4. **Try a Different Browser**: Sometimes browser cache causes issues

The error typically occurs when:
- Facebook Login product is not added to the app
- App is in Development mode and trying to use in production
- Permissions are not properly configured

Once you complete the steps above, the error should be resolved!

