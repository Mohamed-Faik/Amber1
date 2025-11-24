# 🔐 Facebook Data Deletion Callback Setup

## Endpoint Created

Your Facebook data deletion callback endpoint is now available at:
```
https://amberhomes-liart.vercel.app/api/auth/deletion
```

## ✅ How to Configure in Facebook Developer Console

### Step 1: Go to Facebook App Settings

1. Go to https://developers.facebook.com/
2. Select your app (App ID: `1113892244237925`)
3. Go to **Settings** → **Basic**

### Step 2: Set Data Deletion Callback URL

1. Scroll down to find **"Data Deletion Instructions URL"** or **"Data Deletion Callback"**
2. If you see **"Data Deletion Instructions URL"**:
   - Enter: `https://amberhomes-liart.vercel.app/api/auth/deletion`
   
3. If you see **"Data Deletion Callback URL"** (newer apps):
   - Enter: `https://amberhomes-liart.vercel.app/api/auth/deletion`

4. Click **"Save Changes"**

### Step 3: Verify the Endpoint

1. After saving, Facebook will verify the endpoint
2. You can test it by visiting:
   ```
   https://amberhomes-liart.vercel.app/api/auth/deletion
   ```
3. You should see a JSON response with `url` and `confirmation_code`

## 📋 What the Endpoint Does

### GET Request
- Used by Facebook to verify the endpoint exists
- Returns confirmation that the endpoint is working

### POST Request
- Facebook sends a POST request when a user requests data deletion
- The endpoint:
  1. Verifies the signed_request from Facebook
  2. Extracts the Facebook user ID
  3. Finds the user in your database
  4. Deletes all user data (listings, reviews, favorites, blog posts, etc.)
  5. Returns a confirmation to Facebook

## 🔍 Status Endpoint

Users can check their deletion status at:
```
https://amberhomes-liart.vercel.app/api/auth/deletion/status?facebook_user_id=USER_ID
```

## ✅ Requirements Met

✅ Endpoint handles GET requests (verification)  
✅ Endpoint handles POST requests (deletion)  
✅ Verifies signed_request from Facebook  
✅ Deletes all user data when requested  
✅ Returns proper confirmation to Facebook  
✅ GDPR compliant  

## 🚨 Important Notes

1. **Endpoint Must Be Public**: Facebook needs to access this endpoint, so it cannot require authentication
2. **HTTPS Required**: The endpoint must use HTTPS (which it does on Vercel)
3. **Signed Request Verification**: The endpoint properly verifies Facebook's signed_request for security
4. **Complete Deletion**: All user data is permanently deleted when requested

## 📝 After Configuration

Once you've added the callback URL to your Facebook app:

1. **Wait 2-3 minutes** for Facebook to verify the endpoint
2. **Test the endpoint** by visiting it in your browser
3. **Facebook will show** a confirmation that the callback is configured

Your Facebook app is now compliant with Facebook's data deletion requirements!

