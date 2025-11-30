# Brevo SMTP Setup Guide

## ✅ Your Brevo SMTP Credentials

**SMTP Server:** `smtp-relay.brevo.com`  
**Port:** `587`  
**Login:** `7bd403001@smtp-brevo.com`  
**SMTP Key:** `YOUR_SMTP_PASSWORD_KEY`

## 🔧 Step 1: Update Environment Variables

### Local Development (.env file)

Update your `.env` or `.env.local` file with these values:

```env
# Brevo SMTP Configuration
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=7bd403001@smtp-brevo.com
SMTP_PASSWORD=YOUR_SMTP_PASSWORD_KEY
SMTP_FROM=noreply@yourdomain.com
```

**Important:** Replace `yourdomain.com` in `SMTP_FROM` with your actual domain name (e.g., `noreply@amberhomes.com`).

### Vercel Production Environment

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add or update these variables:

   - **Variable Name:** `SMTP_HOST`
     - **Value:** `smtp-relay.brevo.com`
     - **Environment:** Production, Preview, Development (select all)
   
   - **Variable Name:** `SMTP_PORT`
     - **Value:** `587`
     - **Environment:** Production, Preview, Development (select all)
   
   - **Variable Name:** `SMTP_USER`
     - **Value:** `7bd403001@smtp-brevo.com`
     - **Environment:** Production, Preview, Development (select all)
   
   - **Variable Name:** `SMTP_PASSWORD`
     - **Value:** `YOUR_SMTP_PASSWORD_KEY`
     - **Environment:** Production, Preview, Development (select all)
   
   - **Variable Name:** `SMTP_FROM`
     - **Value:** `noreply@yourdomain.com` (replace with your domain)
     - **Environment:** Production, Preview, Development (select all)

3. Click **"Save"** for each variable

4. **Redeploy your application:**
   - Go to **Deployments** tab
   - Click **"..."** on the latest deployment
   - Select **"Redeploy"**
   - ✅ **IMPORTANT**: Uncheck **"Use existing Build Cache"**
   - Click **"Redeploy"**

### Restart Local Development Server

If you're running locally:

1. Stop your dev server (Ctrl+C)
2. Restart it: `npm run dev`

## 🔐 Step 2: Configure Domain Authentication (IMPORTANT for Outlook)

To ensure emails reach Outlook inboxes and avoid spam, you need to configure DNS records. Brevo provides automatic SPF, DKIM, and DMARC setup.

### Option A: Using Brevo's Domain Authentication (Recommended)

1. **Go to Brevo Dashboard:**
   - Log in at https://app.brevo.com
   - Navigate to **Settings** → **Sender & IP** → **Domains**

2. **Add Your Domain:**
   - Click **"Add a domain"** or **"Authenticate a domain"**
   - Enter your domain name (e.g., `yourdomain.com`)
   - Brevo will provide you with DNS records to add

3. **Add DNS Records to Your Domain:**
   
   Brevo will generate records like these:
   
   **SPF Record:**
   ```
   Type: TXT
   Name: @
   Value: v=spf1 include:spf.brevo.com ~all
   ```
   
   **DKIM Record:**
   ```
   Type: TXT
   Name: brevo._domainkey
   Value: (Brevo will provide this - it's unique)
   ```
   
   **DMARC Record (Optional but recommended):**
   ```
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:admin@yourdomain.com
   ```

4. **Add Records to Your DNS:**
   - Go to your domain registrar or DNS provider (GoDaddy, Namecheap, Cloudflare, etc.)
   - Add the TXT records provided by Brevo
   - Wait 24-48 hours for DNS propagation

5. **Verify in Brevo:**
   - Go back to Brevo Dashboard → **Settings** → **Sender & IP** → **Domains**
   - Click **"Verify"** to check if your domain is authenticated
   - Status should show as "Verified" when complete

### Option B: Manual DNS Configuration

If you want to configure DNS manually:

#### 1. SPF Record

Add a TXT record:
```
Type: TXT
Name: @ (or your domain name)
Value: v=spf1 include:spf.brevo.com ~all
```

#### 2. DKIM Record

You'll need to get your DKIM keys from Brevo:
1. Go to Brevo Dashboard → **Settings** → **Sender & IP** → **Domains**
2. Add your domain and Brevo will provide DKIM records
3. Add them to your DNS as TXT records

#### 3. DMARC Record

Add a TXT record:
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:admin@yourdomain.com
```

**Note:** Replace `admin@yourdomain.com` with your email address for receiving DMARC reports.

## ✅ Step 3: Verify Configuration

### Test Email Sending

1. **Send a Test OTP:**
   - Try registering a new user or logging in
   - Check if the OTP email is sent successfully

2. **Check Server Logs:**
   - Look for: `✅ SMTP server connection verified`
   - Look for: `✅ Email sent successfully!`

3. **Test with Outlook:**
   - Send a test email to an Outlook address
   - Check if it lands in inbox (not spam)

### Verify DNS Records

Use these tools to verify your DNS configuration:

1. **MXToolbox:**
   - SPF: https://mxtoolbox.com/spf.aspx
   - DKIM: https://mxtoolbox.com/dkim.aspx
   - DMARC: https://mxtoolbox.com/dmarc.aspx

2. **Mail-Tester:**
   - https://www.mail-tester.com
   - Send a test email and get a detailed deliverability score

3. **Brevo Domain Status:**
   - Check in Brevo Dashboard → Settings → Sender & IP → Domains
   - Should show "Verified" status

## 🎯 Benefits of Using Brevo

✅ **Better Deliverability:** Professional email service with high inbox rates  
✅ **Automatic Authentication:** Brevo handles SPF/DKIM setup  
✅ **Monitoring:** Track email opens, clicks, bounces  
✅ **Reputation Management:** Better sender reputation than personal Gmail  
✅ **Scalability:** Can handle high email volumes  
✅ **Support:** Professional support for email issues  

## 🚨 Important Notes

1. **SMTP_FROM Address:**
   - Use an email address from your authenticated domain
   - Example: `noreply@yourdomain.com` or `support@yourdomain.com`
   - Make sure this domain is verified in Brevo

2. **Rate Limits:**
   - Brevo has sending limits based on your plan
   - Free plan: 300 emails/day
   - Monitor your usage in Brevo Dashboard

3. **DNS Propagation:**
   - DNS changes can take 24-48 hours to propagate
   - Be patient after adding DNS records

4. **Keep Credentials Secure:**
   - Never commit `.env` files to git
   - Rotate SMTP keys if compromised
   - Use environment variables in production

## 📞 Troubleshooting

### Emails Not Sending

1. **Check Environment Variables:**
   - Verify all SMTP variables are set correctly
   - Check server logs for connection errors

2. **Check Brevo Account:**
   - Log in to Brevo Dashboard
   - Verify your account is active
   - Check sending limits/quota

3. **Test SMTP Connection:**
   - Check server logs for: `✅ SMTP server connection verified`
   - If you see errors, verify credentials

### Emails Going to Spam (Outlook)

1. **Domain Authentication:**
   - Ensure domain is verified in Brevo
   - Check DNS records are correct
   - Wait for DNS propagation (24-48 hours)

2. **SPF/DKIM/DMARC:**
   - Verify all three are configured
   - Use MXToolbox to check records

3. **Sender Reputation:**
   - Avoid sending too many emails at once
   - Warm up your domain gradually
   - Monitor bounce rates

4. **Email Content:**
   - Avoid spam trigger words
   - Keep text-to-image ratio balanced
   - Include plain text version (already added in code)

## 🎉 You're All Set!

Once configured:
- ✅ Emails will be sent via Brevo's reliable infrastructure
- ✅ Better deliverability to Outlook and other providers
- ✅ Professional email service with monitoring
- ✅ Automatic authentication handling

If you encounter any issues, check the Brevo Dashboard for detailed logs and statistics.

