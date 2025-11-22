# Facebook Login Setup Guide for Vercel Deployment

## Problem
When deploying to Vercel, you get this error:
```
Feature Unavailable
Facebook Login is currently unavailable for this app, since we are updating additional details for this app. Please try again later.
```

## Root Cause
This error occurs when:
1. Your Facebook App is in **Development Mode** (not Live)
2. OAuth Redirect URIs are not properly configured in Facebook App settings
3. The app needs to be switched from Development to Live mode for production use

## Solution

### Step 1: Configure Facebook App Settings

1. **Go to Facebook Developers Console**
   - Visit: https://developers.facebook.com/
   - Select your app (or create a new one if needed)

2. **Add Facebook Login Product**
   - In your app dashboard, click **"Add Product"** or find **"Facebook Login"**
   - Click **"Set Up"** on Facebook Login

3. **Configure OAuth Redirect URIs** (CRITICAL)
   
   Go to **Settings** → **Basic** → Scroll down to find **"Valid OAuth Redirect URIs"**
   
   Add these URIs (replace `your-domain.vercel.app` with your actual Vercel domain):
   ```
   https://your-domain.vercel.app/api/auth/callback/facebook
   https://www.your-domain.vercel.app/api/auth/callback/facebook
   ```
   
   **If you have a custom domain**, also add:
   ```
   https://your-custom-domain.com/api/auth/callback/facebook
   https://www.your-custom-domain.com/api/auth/callback/facebook
   ```
   
   **For local development**, also add:
   ```
   http://localhost:3000/api/auth/callback/facebook
   ```

4. **Configure App Domains**
   
   In **Settings** → **Basic** → **App Domains**, add:
   ```
   your-domain.vercel.app
   www.your-domain.vercel.app
   ```
   (And your custom domain if you have one)

5. **Set Privacy Policy URL** (Required for Live Mode)
   
   In **Settings** → **Basic** → **Privacy Policy URL**, add your privacy policy URL:
   ```
   https://your-domain.vercel.app/privacy-policy
   ```

6. **Set Terms of Service URL** (Optional but recommended)
   
   In **Settings** → **Basic** → **Terms of Service URL**, add:
   ```
   https://your-domain.vercel.app/terms-condition
   ```

### Step 2: Switch App to Live Mode

1. **Go to App Review** (in the left sidebar)
2. **Check App Status** - You should see "Development" mode
3. **Switch to Live Mode**:
   - Click the toggle switch at the top to switch from "Development" to "Live"
   - **Note**: You may need to complete App Review if your app requires advanced permissions

4. **For Basic Permissions** (public_profile):
   - If you're only using `public_profile` (which is what this app uses), you can switch to Live mode immediately
   - No App Review is needed for `public_profile` permission

### Step 3: Verify Environment Variables in Vercel

Make sure these are set in your Vercel project:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. Verify these variables are set:
   ```
   FACEBOOK_CLIENT_ID=your-facebook-app-id
   FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-secret-key
   ```

3. **Important**: 
   - `NEXTAUTH_URL` should be your **exact Vercel deployment URL** (no trailing slash)
   - Use `https://` (not `http://`)
   - If you have a custom domain, use that instead

### Step 4: Get Your Facebook App Credentials

1. **App ID (FACEBOOK_CLIENT_ID)**:
   - Go to **Settings** → **Basic**
   - Copy the **App ID**

2. **App Secret (FACEBOOK_CLIENT_SECRET)**:
   - Go to **Settings** → **Basic**
   - Click **"Show"** next to App Secret
   - Copy the **App Secret**
   - **Note**: You may need to enter your Facebook password to reveal it

### Step 5: Update Vercel Environment Variables

1. In Vercel Dashboard → **Settings** → **Environment Variables**
2. Add/Update:
   - `FACEBOOK_CLIENT_ID` = Your Facebook App ID
   - `FACEBOOK_CLIENT_SECRET` = Your Facebook App Secret
3. Make sure to select **Production**, **Preview**, and **Development** environments (or at least Production)

### Step 6: Redeploy Your Application

After updating environment variables:

1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Select **"Redeploy"**
4. **IMPORTANT**: Uncheck **"Use existing Build Cache"**
5. Click **"Redeploy"**

### Step 7: Test Facebook Login

1. Visit your deployed site: `https://your-domain.vercel.app`
2. Go to Sign In or Sign Up page
3. Click **"Continue with Facebook"**
4. You should be redirected to Facebook for authentication
5. After authorizing, you should be redirected back to your app

## Troubleshooting

### Issue: Still getting "Feature Unavailable" error

**Solutions:**
1. **Verify App is in Live Mode**:
   - Go to Facebook Developers → Your App → App Review
   - Make sure the toggle shows "Live" (not "Development")

2. **Check Redirect URIs**:
   - Go to Settings → Basic → Valid OAuth Redirect URIs
   - Make sure your Vercel URL is exactly: `https://your-domain.vercel.app/api/auth/callback/facebook`
   - Check for typos, trailing slashes, or missing `https://`

3. **Verify Environment Variables**:
   - Check Vercel Function Logs for any errors
   - Make sure `FACEBOOK_CLIENT_ID` and `FACEBOOK_CLIENT_SECRET` are set correctly
   - Make sure `NEXTAUTH_URL` matches your deployment URL exactly

4. **Clear Browser Cache**:
   - Clear cookies and cache for your site
   - Try in incognito/private mode

### Issue: "App Not Setup: This app is still in development mode"

**Solution:**
- Your app is still in Development mode
- Follow **Step 2** above to switch to Live mode
- For `public_profile` permission, you can switch to Live immediately without App Review

### Issue: Redirect URI Mismatch

**Error**: "Redirect URI Mismatch" or "Invalid OAuth Redirect URI"

**Solution:**
1. Go to Facebook Developers → Your App → Settings → Basic
2. Find "Valid OAuth Redirect URIs"
3. Add the exact URL: `https://your-domain.vercel.app/api/auth/callback/facebook`
4. Make sure there are no trailing slashes or typos
5. Save changes
6. Wait a few minutes for changes to propagate
7. Try again

### Issue: Works on localhost but not on Vercel

**Solution:**
1. Make sure you added the Vercel URL to "Valid OAuth Redirect URIs" (not just localhost)
2. Verify `NEXTAUTH_URL` in Vercel is set to your Vercel domain (not localhost)
3. Make sure the app is in Live mode (not Development mode)

### Issue: "App Not Available: This app is not available"

**Solution:**
- Your app might be restricted or disabled
- Check Facebook Developers → Your App → Settings → Basic
- Make sure the app status is "Live" and not restricted
- Check if there are any warnings or issues in the dashboard

## Current Configuration

Your app is currently configured to use:
- **Scope**: `public_profile` (no email permission required)
- **Email Handling**: If email is not provided, it generates: `facebook_{id}@facebook.local`

This means:
- ✅ No App Review needed for `public_profile` permission
- ✅ Can switch to Live mode immediately
- ✅ Works without requesting email permission from users

## Additional Notes

1. **App Review**: If you want to request `email` permission in the future, you'll need to submit your app for App Review. The current setup works without it.

2. **Test Users**: In Development mode, you can add test users. In Live mode, any Facebook user can log in.

3. **Rate Limits**: Facebook has rate limits for API calls. Make sure you're not exceeding them.

4. **Security**: Never commit `FACEBOOK_CLIENT_SECRET` to your repository. Always use environment variables.

## Quick Checklist

- [ ] Facebook App created and configured
- [ ] Facebook Login product added
- [ ] Valid OAuth Redirect URIs configured (including Vercel URL)
- [ ] App Domains configured
- [ ] Privacy Policy URL set
- [ ] App switched to Live mode
- [ ] `FACEBOOK_CLIENT_ID` set in Vercel
- [ ] `FACEBOOK_CLIENT_SECRET` set in Vercel
- [ ] `NEXTAUTH_URL` set correctly in Vercel
- [ ] Application redeployed after setting environment variables
- [ ] Facebook login tested on production

## Need Help?

If you're still experiencing issues:
1. Check Vercel Function Logs for detailed error messages
2. Check Facebook Developers Console for any warnings or errors
3. Verify all environment variables are set correctly
4. Make sure the app is in Live mode (not Development mode)
5. Double-check the redirect URI matches exactly (no trailing slashes, correct protocol)

