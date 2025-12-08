# Email Deliverability Guide - Fixing Outlook Junk/Spam Issues

## Problem Summary
Emails sent to Outlook addresses (@outlook.com, @outlook.fr) were being delivered to Junk/Spam folders, while emails to Gmail, Hotmail, and other providers were being delivered to Inbox.

## ✅ Code Fixes Applied

### 1. Added Plain Text Version
- **Why**: Outlook and many email providers prefer emails with both HTML and plain text versions
- **What**: Added `text` property alongside `html` in all email functions
- **Impact**: Significantly improves deliverability scores

### 2. Added Proper Email Headers
- **Message-ID**: Unique identifier for each email
- **Date**: Properly formatted UTC date
- **Reply-To**: Clear reply address
- **X-Priority & Importance**: Marked as high priority for OTP emails
- **List-Unsubscribe**: Helps with spam filtering (Outlook checks this)
- **X-Entity-Ref-ID**: Unique tracking identifier

### 3. Improved TLS Configuration
- **Before**: `rejectUnauthorized: false` (insecure)
- **After**: Proper TLS validation with minimum TLS 1.2
- **Impact**: Better security and trust with email providers

### 4. Added Email Envelope
- Explicitly sets `from` and `to` in the envelope
- Helps with SPF authentication

## ⚠️ Critical: Domain-Level Authentication Required

**The code fixes above help, but you MUST configure SPF, DKIM, and DMARC records at your domain level for best deliverability, especially with Outlook.**

### Why Outlook is Stricter
Outlook/Microsoft has some of the most aggressive spam filtering:
- Checks SPF, DKIM, and DMARC records more strictly
- Monitors sender reputation closely
- Filters based on domain/IP reputation
- Requires proper email authentication

### Required DNS Records Setup

#### 1. SPF Record (Sender Policy Framework)
**Purpose**: Authorizes which servers can send email for your domain

**How to add**:
1. Go to your domain's DNS management panel (where you manage DNS records)
2. Add a new TXT record:
   ```
   Type: TXT
   Name: @ (or your domain name)
   Value: v=spf1 include:_spf.google.com ~all
   ```
   
   If you're using Gmail SMTP, the value should be:
   ```
   v=spf1 include:_spf.google.com ~all
   ```
   
   For other SMTP providers, adjust accordingly:
   - **SendGrid**: `v=spf1 include:sendgrid.net ~all`
   - **Mailgun**: `v=spf1 include:mailgun.org ~all`
   - **AWS SES**: `v=spf1 include:amazonses.com ~all`
   - **Custom SMTP**: `v=spf1 ip4:YOUR_SERVER_IP ~all`

**Verify**: Use a tool like https://mxtoolbox.com/spf.aspx

#### 2. DKIM Record (DomainKeys Identified Mail)
**Purpose**: Cryptographically signs your emails to prove authenticity

**How to add**:
1. If using Gmail, you need to:
   - Go to Google Admin Console (for G Suite) or use Gmail's built-in DKIM
   - Generate DKIM keys
   - Add the public key to your DNS as a TXT record

2. For other providers:
   - Check your SMTP provider's documentation for DKIM setup
   - They will provide you with a DNS record to add

**Verify**: Use https://mxtoolbox.com/dkim.aspx

#### 3. DMARC Record (Domain-based Message Authentication)
**Purpose**: Tells receiving servers what to do with emails that fail SPF/DKIM

**How to add**:
1. Add a new TXT record:
   ```
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:YOUR_EMAIL@yourdomain.com
   ```
   
2. Start with `p=none` (monitoring mode) to see reports
3. After a few weeks, change to `p=quarantine` or `p=reject`

**Example values**:
- **Monitoring only**: `v=DMARC1; p=none; rua=mailto:admin@yourdomain.com`
- **Quarantine failures**: `v=DMARC1; p=quarantine; rua=mailto:admin@yourdomain.com`
- **Reject failures**: `v=DMARC1; p=reject; rua=mailto:admin@yourdomain.com`

**Verify**: Use https://mxtoolbox.com/dmarc.aspx

### 4. Reverse DNS (rDNS) Record
**Purpose**: Maps your sending IP address back to your domain

**How to add**:
1. Contact your hosting provider or SMTP provider
2. Request rDNS/PTR record setup
3. Should point from your IP to your domain

## 📋 Quick Checklist

- [x] Added plain text version to emails
- [x] Added proper email headers
- [x] Improved TLS configuration
- [ ] **Configure SPF record in DNS**
- [ ] **Configure DKIM record in DNS**
- [ ] **Configure DMARC record in DNS**
- [ ] Set up reverse DNS (if using dedicated IP)
- [ ] Verify all records using MXToolbox or similar

## 🧪 Testing Your Configuration

### 1. Use Email Testing Tools
- **MXToolbox**: https://mxtoolbox.com
  - SPF Checker: https://mxtoolbox.com/spf.aspx
  - DKIM Checker: https://mxtoolbox.com/dkim.aspx
  - DMARC Checker: https://mxtoolbox.com/dmarc.aspx
  - Blacklist Check: https://mxtoolbox.com/blacklists.aspx

- **Mail-Tester**: https://www.mail-tester.com
  - Send a test email to the provided address
  - Get a detailed deliverability score
  - See what's missing or causing issues

- **Microsoft SNDS**: https://sendersupport.olc.protection.outlook.com/snds/
  - Monitor your sender reputation with Microsoft/Outlook
  - Sign up with your sending IP

### 2. Test Email Delivery
1. Send test emails to:
   - Your own Outlook account
   - Test Outlook accounts (create free ones)
   - Check both inbox and spam folders
   - Mark as "Not Junk" if in spam to improve reputation

### 3. Monitor DMARC Reports
- Once DMARC is set up, you'll receive reports
- Review them to understand authentication results
- Adjust your policy as needed

## 🚨 Important Notes

### If You're Using Gmail SMTP
Gmail's SMTP servers already have good reputation, but:
1. You still need SPF record pointing to `_spf.google.com`
2. Gmail handles DKIM automatically if using G Suite
3. You may need to use a custom domain email (not @gmail.com) for best results
4. Consider using Gmail's API instead of SMTP for better deliverability

### If You're Using a Custom Domain
1. Ensure your sending domain matches your "from" address
2. All authentication records should point to your domain
3. Use a dedicated IP if sending high volumes
4. Warm up your IP gradually if it's new

### Sender Reputation
- Send consistent volumes (avoid sudden spikes)
- Keep bounce rates low (< 2%)
- Monitor spam complaints
- Use double opt-in for subscriptions
- Provide clear unsubscribe options

## 🔧 Additional Recommendations

### 1. Use a Professional Email Service
For production, consider using:
- **SendGrid** (good for transactional emails)
- **Mailgun** (developer-friendly)
- **AWS SES** (cost-effective at scale)
- **Postmark** (excellent deliverability)
- **Resend** (modern, developer-friendly)

These services handle SPF/DKIM/DMARC automatically.

### 2. Email Content Best Practices
- Avoid spam trigger words in subject lines
- Keep subject lines clear and concise
- Maintain good text-to-image ratio
- Don't use URL shorteners
- Include physical address if required (CAN-SPAM, GDPR)

### 3. Rate Limiting
- Implement rate limiting for OTP requests
- Prevent abuse that could harm your reputation

## 📞 Getting Help

If emails are still going to spam after implementing these fixes:

1. **Check spam score**: Use mail-tester.com
2. **Review DMARC reports**: See what's failing
3. **Contact your SMTP provider**: They can help with configuration
4. **Check blacklists**: Ensure your IP/domain isn't blacklisted
5. **Warm up gradually**: If using a new IP, start with low volumes

## 📝 Summary

**The problem is likely a combination of:**
1. ✅ Missing email headers (FIXED in code)
2. ✅ Missing plain text version (FIXED in code)
3. ⚠️ Missing SPF/DKIM/DMARC records (NEEDS DNS CONFIGURATION)
4. ⚠️ Potentially poor sender reputation (NEEDS MONITORING)

The code fixes will help, but **you must configure SPF, DKIM, and DMARC** at the domain level for Outlook to trust your emails consistently.

