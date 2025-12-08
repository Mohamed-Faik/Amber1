# 🏠 Brevo SMTP Setup for Localhost Development

## ✅ Good News: You DON'T Need a Domain for Localhost!

You can use Brevo SMTP on `localhost:3000` without any domain setup! Here's what you need to know:

## 📧 Understanding SMTP_FROM

The `SMTP_FROM` is just the email address that shows up as the "sender" in the email. It's NOT related to your localhost URL.

### For Localhost Development, You Have 3 Options:

### Option 1: Use Brevo's Default Sender (Simplest for Testing)
You can use a simple email address. Brevo will send it, but it might show as coming from Brevo's infrastructure:

```env
SMTP_FROM=noreply@brevo.com
```

**OR** use your Brevo login email format:
```env
SMTP_FROM=7bd403001@brevo.com
```

### Option 2: Use Your Own Email Address (Recommended for Testing)
You can use your own personal email (doesn't need to be verified initially):

```env
SMTP_FROM=your-email@gmail.com
```

### Option 3: Create a Verified Sender in Brevo (Best Practice)
1. Go to Brevo Dashboard: https://app.brevo.com
2. Navigate to: **Settings** → **Sender & IP** → **Senders**
3. Click **"Add a sender"**
4. Add your email address (e.g., `noreply@yourdomain.com` or even `your-email@gmail.com`)
5. Verify it via the confirmation email
6. Then use it in your `.env`:

```env
SMTP_FROM=noreply@yourdomain.com
```

## 🔧 Quick Localhost Setup

### Step 1: Update Your `.env` File

Create or update `.env` or `.env.local` in your project root:

```env
# Brevo SMTP Configuration
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=aniffour.dev@gmail.com
SMTP_PASSWORD=YOUR_SMTP_PASSWORD_KEY

# For localhost, you can use any email address here:
SMTP_FROM=noreply@brevo.com
# OR use your own email:
# SMTP_FROM=your-email@gmail.com
```

### Step 2: Restart Your Dev Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 3: Test It!

Send a test OTP email and check if it arrives. The email will work fine on localhost!

## 🌐 Domain Authentication (For Later - Production Only)

Domain authentication in Brevo is:
- ✅ **Recommended** for production (better deliverability)
- ❌ **NOT required** for localhost development
- 🕐 **Can be set up later** when you deploy to production

### When You Deploy to Production:

1. You'll have a real domain (e.g., `amberhomes.com`)
2. Then you can verify it in Brevo Dashboard
3. This improves email deliverability (especially for Outlook)

**But this is completely separate from using Brevo on localhost!**

## 📝 Complete .env Example for Localhost

```env
# Database (your existing setup)
DATABASE_URL=mysql://username:password@host:port/database_name

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Brevo SMTP - Works perfectly on localhost!
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=aniffour.dev@gmail.com
SMTP_PASSWORD=YOUR_SMTP_PASSWORD_KEY

# For localhost, use a simple email - no domain needed!
SMTP_FROM=noreply@brevo.com
# OR your personal email for testing:
# SMTP_FROM=yourname@gmail.com
```

## ✅ Summary

| Question | Answer |
|----------|--------|
| Can I use Brevo on localhost? | ✅ **YES!** No domain needed |
| Do I need domain verification for localhost? | ❌ **NO** - Only needed for production |
| What should SMTP_FROM be for localhost? | Any email address (simple is fine) |
| Will emails work on localhost? | ✅ **YES!** Brevo SMTP works anywhere |
| When do I need domain verification? | Only when you deploy to production |

## 🎯 What You Need to Do Right Now

1. ✅ Update your `.env` file with Brevo credentials
2. ✅ Set `SMTP_FROM` to any email (e.g., `noreply@brevo.com`)
3. ✅ Restart your dev server
4. ✅ Test sending an OTP email
5. 🕐 Set up domain verification later when you deploy to production

## 🚨 Important Note

The `SMTP_FROM` email address is **just what shows up in the "From" field** of the email. It's not tied to your localhost URL at all. You can use:
- A simple email address
- Your personal email
- A Brevo-verified sender
- Any email format

The important part is that Brevo SMTP will actually send the email, regardless of what's in `SMTP_FROM`.

## 💡 Pro Tip

For the best testing experience on localhost:
1. Use a simple sender like `noreply@brevo.com`
2. Test that emails send successfully
3. Later, when you deploy to production, set up proper domain authentication

**You're all set for localhost! No domain needed! 🚀**

