# GDPR / Data Privacy Compliance

This document outlines the GDPR (General Data Protection Regulation) compliance features implemented in the AmberHomes platform.

---

## Overview

AmberHomes is committed to protecting user privacy and complying with GDPR regulations. This document describes the privacy features and user rights available on the platform.

---

## Implemented Features

### 1. Cookie Consent Management ✅

**Location**: Cookie banner appears on first visit
**Component**: `src/components/GDPR/CookieConsent.js`

**Features**:
- Cookie consent banner on first visit
- Granular cookie preferences (Necessary, Analytics, Marketing)
- Persistent cookie preferences stored in localStorage
- Cookie settings accessible via floating button
- Link to Privacy Policy

**Cookie Categories**:
- **Necessary Cookies**: Essential for website functionality (cannot be disabled)
- **Analytics Cookies**: Help understand visitor behavior (optional)
- **Marketing Cookies**: Used for advertising and campaigns (optional)

---

### 2. Data Export (Right to Data Portability) ✅

**Location**: `/profile/privacy`
**API Endpoint**: `/api/user/data-export`

**Features**:
- Users can download all their personal data in JSON format
- Includes: personal information, profile, listings, reviews, connected accounts
- Machine-readable format (GDPR Article 20)
- Export date and data subject rights information included

**How to Use**:
1. Navigate to Profile → Privacy & Data
2. Click "Export My Data"
3. JSON file will be downloaded automatically

---

### 3. Account Deletion (Right to Erasure) ✅

**Location**: `/profile/privacy`
**API Endpoint**: `/api/user/delete-account`

**Features**:
- Permanent account deletion
- Email confirmation required
- Optional deletion reason collection
- Complete data removal:
  - User account
  - Profile information
  - All listings
  - All reviews
  - All favorites
  - All blog posts
  - OAuth accounts
  - OTP records
  - Password reset tokens

**GDPR Compliance**:
- Complete data erasure (Article 17)
- No data retention after deletion
- Deletion logged for compliance purposes

**How to Use**:
1. Navigate to Profile → Privacy & Data
2. Scroll to "Delete Your Account"
3. Click "Delete My Account"
4. Confirm by entering your email address
5. Optionally provide a reason
6. Click "Permanently Delete Account"

---

### 4. Privacy Settings Page ✅

**Location**: `/profile/privacy`
**Component**: `src/components/Profile/PrivacySettings.js`

**Features**:
- Data export functionality
- Account deletion functionality
- GDPR rights information
- Link to Privacy Policy
- User-friendly interface

**Access**:
- Via user menu: "Privacy & Data"
- Direct URL: `/profile/privacy`

---

### 5. Privacy Policy ✅

**Location**: `/privacy-policy`
**Page**: `src/app/privacy-policy/page.js`

**Features**:
- Editable via CMS (Content Management System)
- GDPR-compliant content structure
- Accessible from footer and cookie banner
- Dynamic content from database

**Content Should Include**:
- Data collection practices
- Data processing purposes
- Legal basis for processing
- Data retention periods
- User rights under GDPR
- Contact information for data protection inquiries

---

## User Rights Under GDPR

### ✅ Right to Access (Article 15)
- **Implementation**: Data export feature
- **Location**: `/profile/privacy` → "Export My Data"
- **Format**: JSON file with all user data

### ✅ Right to Rectification (Article 16)
- **Implementation**: Profile settings page
- **Location**: `/profile/settings`
- **Features**: Users can update their personal information

### ✅ Right to Erasure (Article 17)
- **Implementation**: Account deletion feature
- **Location**: `/profile/privacy` → "Delete Your Account"
- **Features**: Complete data removal

### ✅ Right to Data Portability (Article 20)
- **Implementation**: Data export feature
- **Location**: `/profile/privacy` → "Export My Data"
- **Format**: Machine-readable JSON format

### ✅ Right to Object (Article 21)
- **Implementation**: Cookie consent management
- **Location**: Cookie settings (floating button or banner)
- **Features**: Users can opt-out of non-essential cookies

### ⚠️ Right to Restriction of Processing (Article 18)
- **Status**: Not yet implemented
- **Recommendation**: Add feature to temporarily restrict data processing

### ⚠️ Right to Object to Automated Decision-Making (Article 22)
- **Status**: Not applicable (no automated decision-making currently)

---

## Data Processing Activities

### Personal Data Collected

1. **Account Information**:
   - Name, email, profile image
   - Authentication credentials (hashed)
   - OAuth provider information

2. **Profile Data**:
   - Phone number
   - Social media links
   - Bio/description

3. **User-Generated Content**:
   - Property listings
   - Reviews and ratings
   - Blog posts
   - Favorites

4. **Technical Data**:
   - IP address (via NextAuth.js)
   - Browser information
   - Cookie preferences

### Legal Basis for Processing

- **Consent**: Cookie preferences, marketing communications
- **Contract**: User account creation, listing management
- **Legitimate Interest**: Analytics, security, fraud prevention

### Data Retention

- **Active Accounts**: Data retained while account is active
- **Deleted Accounts**: All data permanently deleted immediately
- **Inactive Accounts**: Review retention policy (recommend: 2-3 years)

---

## Security Measures

### Data Protection

- **Password Hashing**: bcrypt with salt rounds
- **HTTPS**: Required for all data transmission
- **Session Management**: Secure JWT tokens via NextAuth.js
- **Database Security**: Prisma ORM with parameterized queries

### Access Controls

- **Role-Based Access**: USER, MODERATOR, SUPPORT, ADMIN
- **Authentication**: Required for sensitive operations
- **Authorization**: Checks on all API endpoints

---

## Compliance Checklist

- ✅ Cookie consent banner
- ✅ Cookie preferences management
- ✅ Data export functionality
- ✅ Account deletion functionality
- ✅ Privacy settings page
- ✅ Privacy Policy page (editable)
- ✅ User rights information displayed
- ✅ Secure data transmission (HTTPS)
- ✅ Password hashing
- ✅ Access controls
- ⚠️ Data retention policy (needs documentation)
- ⚠️ Data breach notification procedure (needs implementation)
- ⚠️ Data Protection Impact Assessment (DPIA) (needs documentation)

---

## Contact Information

For GDPR-related inquiries, users can:
- Contact via email: [Add contact email]
- Use the contact form: `/contact-us`
- Review Privacy Policy: `/privacy-policy`

---

## Recommendations for Full Compliance

### 1. Data Retention Policy
- Document retention periods for different data types
- Implement automatic data purging for inactive accounts
- Add retention information to Privacy Policy

### 2. Data Breach Notification
- Implement breach detection system
- Create notification procedure for users
- Document breach response plan

### 3. Data Processing Records
- Maintain records of processing activities
- Document data sharing with third parties
- Keep audit logs of data access

### 4. Privacy by Design
- Review all features for privacy impact
- Minimize data collection
- Implement data minimization principles

### 5. Regular Audits
- Conduct privacy audits annually
- Review and update Privacy Policy
- Test data export and deletion features

---

## Testing GDPR Features

### Test Cookie Consent
1. Clear browser localStorage
2. Visit homepage
3. Verify cookie banner appears
4. Test "Accept All", "Reject All", and "Customize" options
5. Verify preferences are saved

### Test Data Export
1. Log in as a user
2. Navigate to `/profile/privacy`
3. Click "Export My Data"
4. Verify JSON file downloads
5. Verify all user data is included

### Test Account Deletion
1. Log in as a test user
2. Navigate to `/profile/privacy`
3. Click "Delete My Account"
4. Enter email confirmation
5. Verify account is deleted
6. Verify all associated data is removed

---

## Legal Disclaimer

This document describes the technical implementation of GDPR features. It is not legal advice. Consult with a legal professional to ensure full GDPR compliance for your specific use case and jurisdiction.

---

**Last Updated**: [Current Date]
**Version**: 1.0.0

