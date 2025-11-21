# Vercel Deployment Guide

## Issues Fixed

### 1. Authentication Redirect Issue
After deploying to Vercel, authenticated users are redirected to the homepage when accessing protected routes like `/profile/edit-my-info` or `/listings/my-listings`.

### 2. File Upload Issue
When uploading profile pictures or listing images on Vercel, you get the error: `ENOENT: no such file or directory, mkdir '/var/task/public'`

## Root Cause
This is typically caused by:
1. Missing or incorrect `NEXTAUTH_URL` environment variable
2. Cookie configuration not optimized for Vercel's HTTPS environment
3. Session token not being properly read by middleware

## Solution

### 1. Environment Variables on Vercel

Make sure you have these environment variables set in your Vercel project settings:

1. Go to your Vercel project → Settings → Environment Variables
2. Add/verify these variables:

```env
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
```

**IMPORTANT:**
- `NEXTAUTH_URL` must be your **exact Vercel deployment URL** (e.g., `https://amberhomes-liart.vercel.app`)
- Do NOT include a trailing slash
- Use `https://` (not `http://`)
- If you have a custom domain, use that instead

### 2. Generate a Strong Secret

If you haven't already, generate a strong secret:

```bash
openssl rand -base64 32
```

Set this as `NEXTAUTH_SECRET` in Vercel.

### 3. Verify Cookie Configuration

The code has been updated to automatically configure cookies for Vercel:
- Cookies use `Secure` flag in production
- Cookies use `SameSite=lax` for better compatibility
- Cookie names are prefixed with `__Secure-` in production

### 4. Redeploy After Setting Environment Variables

After setting/updating environment variables:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click the three dots (⋯) on the latest deployment
3. Select "Redeploy"
4. Make sure "Use existing Build Cache" is **unchecked** (to ensure new env vars are picked up)

### 5. Test the Fix

1. Log in to your application
2. Try accessing `/profile/edit-my-info` or `/listings/my-listings`
3. You should NOT be redirected to the homepage

## Debugging

If the issue persists, you can enable debug logging:

1. Add this environment variable in Vercel:
   ```
   DEBUG_MIDDLEWARE=true
   ```

2. Check Vercel Function Logs:
   - Go to Vercel Dashboard → Your Project → Functions
   - Check the logs for middleware execution

3. Check Browser Console:
   - Open browser DevTools → Network tab
   - Look for requests to protected routes
   - Check if cookies are being sent (Application → Cookies)

## Common Issues

### Issue: Still redirecting after setting NEXTAUTH_URL
**Solution:** 
- Make sure `NEXTAUTH_URL` matches your deployment URL exactly
- Redeploy after setting the variable
- Clear browser cookies and try again

### Issue: Works on localhost but not Vercel
**Solution:**
- This is usually because `NEXTAUTH_URL` is set to `http://localhost:3000` in Vercel
- Update it to your Vercel URL

### Issue: Cookies not being set
**Solution:**
- Check that your domain is using HTTPS (Vercel provides this automatically)
- Verify `NEXTAUTH_SECRET` is set
- Check browser console for cookie-related errors

## File Upload Setup (Vercel Blob Storage)


### Enable Vercel Blob Storage

1. Go to your Vercel project dashboard
2. Navigate to **Storage** tab
3. Click **Create Database** → Select **Blob**
4. Choose a name for your blob store (e.g., "uploads")
5. Select a region closest to your users
6. Click **Create**

### Environment Variable

After creating the Blob store, Vercel will automatically add the `BLOB_READ_WRITE_TOKEN` environment variable to your project. This is all you need - the code will automatically detect it.

### How It Works

- **On Vercel (Production)**: Files are uploaded to Vercel Blob Storage
- **On Localhost (Development)**: Files are saved to `public/uploads/` directory (normal file system)

The code automatically detects the environment and uses the appropriate storage method.

### Testing

1. Upload a profile picture in Settings
2. Upload listing images when creating a listing
3. Files should upload successfully without errors

## Additional Notes

- The middleware uses `withAuth` from NextAuth which automatically handles authentication
- Protected routes are defined in `src/middleware.js` under the `matcher` config
- Session cookies are set with a 30-day expiration
- All cookies are HTTP-only for security
- File uploads use Vercel Blob Storage on production, local filesystem on development

