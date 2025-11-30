# ✅ Gmail SMTP Restored

## 🔧 Configuration

Your `.env` file has been updated to use Gmail SMTP:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=locamarrakech.com@gmail.com
SMTP_PASSWORD=your-gmail-app-password
SMTP_FROM=locamarrakech.com@gmail.com
```

## ⚠️ IMPORTANT: Update Your Gmail App Password

You need to set up a Gmail App Password:

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with: `locamarrakech.com@gmail.com`
3. Select **"Mail"** and **"Other (Custom name)"**
4. Enter name: "AmberHomes"
5. Click **"Generate"**
6. Copy the 16-character password
7. Update `SMTP_PASSWORD` in your `.env` file

## 📝 Final .env Configuration

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=locamarrakech.com@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
SMTP_FROM=locamarrakech.com@gmail.com
```

Replace `xxxx xxxx xxxx xxxx` with your actual Gmail App Password.

## ✅ Restart Server

1. Stop: `Ctrl+C`
2. Start: `npm run dev`
3. Test sending OTP

That's it! Back to Gmail SMTP.

