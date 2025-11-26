# AmberHomes - Selling Renting Properties

A modern, full-featured property listing platform built with Next.js 14, featuring property listings, user management, reviews, and an admin dashboard. Perfect for real estate, property sales, and property rentals.

**Latest Update:** Fixed notification icon alignment on mobile navbar.

![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.0.0-2D3748)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![CI/CD](https://github.com/medfaik33/AmberHomes/actions/workflows/ci.yml/badge.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)
![Tests](https://img.shields.io/badge/Tests-35%20passing-brightgreen)

## 🌟 Features

### For Users
- **Property Listings**: Create and manage property listings with multiple images
- **Multi-Image Upload**: Upload multiple images per listing with drag-and-drop support
- **Advanced Search**: Search by category, location (Marrakech neighborhoods), and keywords
- **Favorites System**: Save favorite listings for quick access
- **Reviews & Ratings**: Leave reviews and ratings on listings
- **Interactive Maps**: View listing locations on interactive maps
- **User Profiles**: Customizable user profiles with social links
- **Responsive Design**: Fully responsive design for all devices

### For Administrators
- **Modern Admin Dashboard**: Professional admin panel with statistics and quick actions
- **Listing Management**: Approve, reject, or cancel listings
- **User Management**: View and manage all registered users
- **Review Moderation**: Monitor and manage user reviews
- **Blog Management**: Create and manage blog posts
- **Status Filtering**: Filter listings by status (Pending, Approved, Canceled)

### Technical Features
- **Authentication**: NextAuth.js with multiple providers (Google, GitHub, Credentials)
- **Image Storage**: Local file storage for uploaded images
- **Admin Approval System**: All listings require admin approval before going live
- **Location-Based**: Focused on Marrakech neighborhoods
- **SEO Friendly**: Optimized URLs and meta tags, structured data, sitemap
- **Accessibility**: WCAG 2.1 AA compliant features
- **GDPR Compliance**: Cookie consent, data export, account deletion, privacy settings
- **Real-time Updates**: Dynamic content updates without page refresh
- **Testing**: Jest with 35+ unit tests
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Docker**: Containerized application with docker-compose

## 🎨 Design

- **Design System**: Comprehensive design system documented in [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)
- **Design Files**: 
  - Figma: [Add your Figma file link here]
  - Adobe XD: [Add your Adobe XD file link here]
- **Design Tokens**: Colors, typography, spacing, and shadows defined
- **Component Library**: Consistent UI components with specifications
- **Accessibility**: WCAG 2.1 AA compliant with focus indicators and ARIA labels

> **Note**: If you have design files in Figma or Adobe XD, add the links in `DESIGN_SYSTEM.md` and update the README. The design system documentation includes all design tokens, components, and guidelines used in the implementation.

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2.3 (App Router)
- **UI Library**: React 18.2.0
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Custom CSS with modern design
- **Image Handling**: Next.js Image component with local storage
- **Maps**: Leaflet & React Leaflet
- **Forms**: React Hook Form
- **Rich Text Editor**: Mantine RTE
- **Notifications**: React Hot Toast

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **MySQL** 8.0 or higher
- **Git**

## 🚀 Installation

**⚠️ IMPORTANT:** After cloning, you **MUST** create a `.env` file before running the app. See step 3 below.

1. **Clone the repository**
   ```bash
   git clone https://github.com/medfaik33/AmberHomes.git
   cd teor-react-nextjs-classified-ads-directory-listing-script/teor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file and configure it:
   ```bash
   cp .env.example .env
   ```
   
   **IMPORTANT**: Edit the `.env` file and update the following required variables:
   ```env
   # REQUIRED: Database connection string
   # For local MySQL: mysql://username:password@localhost:3306/database_name
   # For remote MySQL: mysql://username:password@host:port/database_name
   DATABASE_URL="mysql://username:password@localhost:3306/database_name"
   
   # REQUIRED: Generate a secret key for NextAuth (use: openssl rand -base64 32)
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="https://amberhomes-liart.vercel.app/"
   
   # Optional: OAuth Providers
   GITHUB_ID="your-github-client-id"
   GITHUB_SECRET="your-github-client-secret"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   FACEBOOK_CLIENT_ID="your-facebook-app-id"
   FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"
   ```
   
   **⚠️ Without a valid DATABASE_URL, the application will not work!**

4. **Set up the database**
   
   Generate Prisma Client:
   ```bash
   npx prisma generate
   ```
   
   **For existing database** (if you have a remote database or existing schema):
   ```bash
   npx prisma db pull
   ```
   
   **For new database** (creates tables from schema):
   ```bash
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [https://amberhomes-liart.vercel.app/](https://amberhomes-liart.vercel.app/)

## 📁 Project Structure

```
teor/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/
│   ├── images/                 # Static images
│   └── uploads/                # User uploaded images
├── src/
│   ├── actions/               # Server actions
│   ├── app/                  # Next.js app router pages
│   │   ├── api/              # API routes
│   │   ├── dashboard/        # Admin dashboard pages
│   │   ├── listings/         # Listing pages
│   │   └── page.js           # Homepage
│   ├── components/           # React components
│   │   ├── Dashboard/        # Admin dashboard components
│   │   ├── FormHelpers/     # Form components
│   │   ├── Index/           # Homepage components
│   │   ├── Listing/         # Listing detail components
│   │   └── Listings/        # Listing list components
│   ├── hooks/               # Custom React hooks
│   ├── libs/                # Libraries and utilities
│   └── utils/               # Utility functions
└── package.json
```

## 🎯 Key Features Explained

### Multi-Image Upload
- Upload multiple images per listing
- Drag-and-drop support
- Image preview and removal
- Automatic image optimization
- Stored in `public/uploads/listings/`

### Location System
- Focused on Marrakech neighborhoods
- 26+ predefined neighborhoods
- Interactive map integration
- Location-based search

### Admin Approval System
- All new listings start as "Pending"
- Admin can approve, reject, or cancel listings
- Only approved listings are visible to public
- Status filtering in admin dashboard

### Image Gallery
- Image carousel on listing detail pages
- Thumbnail navigation
- Responsive image display
- Support for both single and multiple images

## 🔐 Default Admin Access

To create an admin user, you'll need to:

1. Register a regular user account
2. Update the user's role in the database:
   ```sql
   UPDATE User SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

Or use Prisma Studio:
```bash
npx prisma studio
```

## 📝 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Testing
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

### Backup & Recovery
- `npm run backup:full` - Full backup (database + files) - Local MySQL
- `npm run backup:full:docker` - Full backup (database + files) - Docker MySQL
- `npm run backup:full:remote` - Full backup (database + files) - Remote MySQL
- `npm run backup:db` - Database backup only - Local MySQL
- `npm run backup:db:docker` - Database backup only - Docker MySQL
- `npm run backup:db:remote` - Database backup only - Remote MySQL
- `npm run backup:files` - File uploads backup only
- `npm run restore:db <backup-file>` - Restore database from backup

See [BACKUP_QUICK_START.md](./BACKUP_QUICK_START.md) for backup instructions.

## 🌍 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MySQL connection string | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `GITHUB_ID` | GitHub OAuth client ID | No |
| `GITHUB_SECRET` | GitHub OAuth secret | No |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | No |
| `FACEBOOK_CLIENT_ID` | Facebook OAuth App ID | No |
| `FACEBOOK_CLIENT_SECRET` | Facebook OAuth App Secret | No |

## 🗄️ Database Schema

### Main Models
- **User**: User accounts with authentication
- **Listing**: Property listings with images, location, and status
- **Review**: User reviews and ratings
- **Favourite**: Saved listings
- **Blog**: Blog posts
- **Profile**: User profile information

### Listing Status
- `Pending`: Awaiting admin approval
- `Approved`: Live and visible to public
- `Canceled`: Cancelled by admin or user

## 🎨 Customization

### Adding New Neighborhoods
Edit `src/hooks/useCountries.js` to add more Marrakech neighborhoods.

### Changing Categories
Edit `src/libs/Categories.js` to modify listing categories.

### Styling
Main styles are in `src/app/styles/`. The dashboard uses inline styles for modern design.

## 🧪 Testing

This project includes comprehensive unit tests using Jest.

### Run Tests
```bash
npm test
```

### Watch Mode.
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

See [TESTING.md](./TESTING.md) for more details.

## 🚀 CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment.

### Workflows.
- **CI Pipeline**: Runs tests and builds on every push/PR
- **Deploy Pipeline**: Deploys to production on main branch
- **Docker Build**: Builds and publishes Docker images

### Status
Check the [Actions tab](https://github.com/medfaik33/AmberHomes/actions) to see workflow runs.

See [CI_CD_SETUP.md](./CI_CD_SETUP.md) for detailed setup instructions.

## 🐳 Docker Support

This project includes Docker configuration for easy deployment.

### Quick Start
```bash
docker-compose up -d
```

### Access
- Application: https://amberhomes-liart.vercel.app/
- MySQL: localhost:3306

See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for detailed instructions.

## 🐛 Troubleshooting

### Images not displaying?
- Check that `public/uploads/listings/` directory exists
- Verify image paths in database start with `/uploads/listings/`
- Ensure Next.js Image component has `unoptimized` prop for local images

### Database connection issues?

**Error: "DATABASE_URL environment variable is not set"**

This error occurs when the `.env` file is missing or `DATABASE_URL` is not configured.

**Solution:**
1. Make sure you copied `.env.example` to `.env`:
   ```bash
   # On Windows (PowerShell):
   Copy-Item .env.example .env
   
   # On Linux/Mac:
   cp .env.example .env
   ```

2. Edit `.env` and set your `DATABASE_URL`:
   ```env
   DATABASE_URL="mysql://username:password@host:port/database_name"
   ```

3. For **local MySQL**:
   ```env
   DATABASE_URL="mysql://root:your_password@localhost:3306/your_database"
   ```

4. For **remote MySQL** (Hostinger):
   ```env
   DATABASE_URL="mysql://username:password@193.203.168.240:3306/database_name"
   ```
   **Note:** Make sure your IP is whitelisted in Hostinger's Remote MySQL settings.

5. After setting `DATABASE_URL`, regenerate Prisma Client:
   ```bash
   npx prisma generate
   ```

6. Restart your development server.

**Other database issues:**
- Ensure MySQL server is running (for local databases)
- Verify database credentials are correct
- Check that the database exists
- For remote databases, ensure your IP is whitelisted
- Run `npx prisma db pull` if using an existing database
- Run `npx prisma db push` if creating a new database

### Authentication not working?
- Check `NEXTAUTH_SECRET` is set
- Verify OAuth provider credentials if using social login
- Ensure database tables are created

## 📄 License

This project is private and proprietary.

## 👥 Contributing

This is a private project. For issues or suggestions, please contact the repository owner.

## 💾 Backup & Disaster Recovery

AmberHomes includes comprehensive backup and disaster recovery tools.

### Quick Backup Commands

- **Full Backup**: `npm run backup:full` (local) or `npm run backup:full:docker` (Docker)
- **Database Only**: `npm run backup:db` or `npm run backup:db:docker`
- **Files Only**: `npm run backup:files`
- **Restore**: `npm run restore:db <backup-file> --docker`

### Automated Backups

- **Daily automated backups** via GitHub Actions (`.github/workflows/backup.yml`)
- **Backup retention**: 30 days (automatic cleanup)
- **Backup location**: `./backups/` directory

### Documentation

- **[BACKUP_QUICK_START.md](./BACKUP_QUICK_START.md)** - Quick reference guide
- **[BACKUP_DISASTER_RECOVERY.md](./BACKUP_DISASTER_RECOVERY.md)** - Comprehensive backup and recovery procedures

---

## 🔒 GDPR / Data Privacy Compliance

AmberHomes is fully compliant with GDPR (General Data Protection Regulation) requirements.

### Implemented Features

- ✅ **Cookie Consent Management**: Granular cookie preferences (Necessary, Analytics, Marketing)
- ✅ **Data Export**: Users can download all their personal data in JSON format (Right to Data Portability)
- ✅ **Account Deletion**: Complete data erasure with email confirmation (Right to Erasure)
- ✅ **Privacy Settings**: Dedicated page for managing privacy preferences
- ✅ **Privacy Policy**: Editable via CMS, accessible from footer and cookie banner

### User Rights

- **Right to Access**: Export all personal data via `/profile/privacy`
- **Right to Rectification**: Update information in profile settings
- **Right to Erasure**: Delete account and all data via `/profile/privacy`
- **Right to Data Portability**: Export data in machine-readable format
- **Right to Object**: Manage cookie preferences via cookie settings

### Documentation

- **GDPR Compliance Guide**: See [`GDPR_COMPLIANCE.md`](./GDPR_COMPLIANCE.md) for detailed information
- **Privacy Policy**: Available at `/privacy-policy`
- **Cookie Settings**: Accessible via floating button or cookie banner

## 📝 Feedback & Revisions

This project includes a structured feedback and revision process:

- **Feedback Documentation**: See [`FEEDBACK_REVISIONS.md`](./FEEDBACK_REVISIONS.md) for all feedback rounds and revisions
- **Changelog**: See [`CHANGELOG.md`](./CHANGELOG.md) for version history and changes
- **Issue Templates**: Use GitHub issue templates for submitting feedback
- **Revision Tracking**: All changes are documented and tracked

### Feedback Process

1. Submit feedback via GitHub Issues or email
2. Feedback is reviewed and prioritized
3. Revisions are implemented and tested
4. Changes are documented in `FEEDBACK_REVISIONS.md` and `CHANGELOG.md`
5. Updates are deployed

### Current Status

- **Total Feedback Rounds**: 3
- **Completed Revisions**: All implemented
- **Documentation**: Complete

## 📞 Support

For support, please open an issue in the GitHub repository.

---

**Built with ❤️ using Next.js and React**
