# 🔧 Fix: Mailtrap Gmail Sender Error

## ❌ The Error

```
Error: 550 5.7.1 Sending from domain gmail.com is not allowed
```

**Problem:** Mailtrap does NOT allow sending emails from Gmail addresses (`@gmail.com` or `@googlemail.com`).

## ✅ Solution: Use a Non-Gmail Sender

You need to change `SMTP_FROM` to an email that's NOT from Gmail.

### Option 1: Use a Custom Domain Email (Recommended)

If you have a custom domain, use it:
```env
SMTP_FROM=noreply@yourdomain.com
SMTP_FROM=noreply@amberhomes.com
SMTP_FROM=contact@yourdomain.com
```

### Option 2: Use Another Email Provider

Use an email from any non-Gmail provider:
```env
SMTP_FROM=yourname@outlook.com
SMTP_FROM=yourname@yahoo.com
SMTP_FROM=yourname@hotmail.com
```

### Option 3: Use a Generic Format (For Testing)

For testing, you can use:
```env
SMTP_FROM=noreply@mailtrap.io
```

## 🔧 Quick Fix Steps

1. **Open your `.env` file**

2. **Find this line:**
   ```env
   SMTP_FROM=aniffour.dev@gmail.com
   ```

3. **Change it to something like:**
   ```env
   SMTP_FROM=noreply@yourdomain.com
   ```
   Or:
   ```env
   SMTP_FROM=noreply@mailtrap.io
   ```

4. **Save the file**

5. **Restart your server:**
   - Stop: `Ctrl+C`
   - Start: `npm run dev`

6. **Test again** - should work now!

## 📝 Updated .env Example

```env
SMTP_HOST=live.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=api
SMTP_PASSWORD=d448bbe7b015a1c90b986eb2f46affec
SMTP_FROM=noreply@yourdomain.com
```

**Remember:** `SMTP_FROM` must NOT be from Gmail!

## ✅ After Fixing

You should see:
```
✅ SMTP server connection verified successfully
✅ Email sent successfully!
```

No more Gmail domain errors!

