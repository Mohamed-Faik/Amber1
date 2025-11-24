# 🔐 Quick Guide: Update Facebook Credentials

## Your New Facebook App Credentials

- **APP ID:** `1113892244237925`
- **APP SECRET:** `23da64b9794cade44f971f5089ecff9b`

## ✅ Quick Steps

### 1. Create/Update `.env.local` File

Create a file named `.env.local` in your project root and add:

```env
FACEBOOK_CLIENT_ID=1113892244237925
FACEBOOK_CLIENT_SECRET=23da64b9794cade44f971f5089ecff9b
```

### 2. Update Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update:
   - `FACEBOOK_CLIENT_ID` = `1113892244237925`
   - `FACEBOOK_CLIENT_SECRET` = `23da64b9794cade44f971f5089ecff9b`
5. Select all environments (Production, Preview, Development)
6. Click **Save**
7. **Redeploy** your application

### 3. Restart Your Dev Server

```bash
# Stop current server (Ctrl+C) then:
npm run dev
```

✅ Done! Your new Facebook credentials are now active.

