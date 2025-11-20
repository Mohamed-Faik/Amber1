# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2024-XX-XX

### Added
- **User Management**: Activate/deactivate users without deletion
- **Role-Based Access**: Added SUPPORT and MODERATOR roles
- **Content Management System**: Admin interface for editing Terms & Privacy Policy
- **SEO Enhancements**:
  - Open Graph meta tags for social sharing
  - Twitter Card meta tags
  - Structured data (JSON-LD) for listings
  - Dynamic sitemap.xml generation
  - Enhanced metadata with canonical URLs
- **Accessibility (WCAG 2.1 AA)**:
  - Skip-to-content link
  - Enhanced focus indicators
  - ARIA labels and landmarks
  - Keyboard navigation improvements
  - Form accessibility enhancements
  - Reduced motion support
- **Price Filter**: Min/max price filters in search
- **Design System Documentation**: Comprehensive design tokens and guidelines
- **Feedback & Revision Tracking**: Documentation system

### Changed
- **Currency**: Changed from USD to Moroccan Dirham (MAD)
- **Typography**: Replaced Readex Pro and Dancing Script with Inter
- **User Status**: Added Active/Inactive status field
- **Authentication**: Added status check to prevent inactive users from logging in

### Fixed
- Navbar not updating after login (session management)
- Listings showing before admin approval
- Number input spinner styling

---

## [1.0.0] - 2024-XX-XX

### Added
- Initial release
- User registration and authentication (Email, Google, GitHub, Facebook)
- Property listing creation and management
- Admin dashboard
- Listing approval workflow
- Review and rating system
- Favorites system
- Search functionality (category, location)
- User profiles
- Blog system
- Responsive design
- Docker containerization
- CI/CD pipeline
- Automated testing

---

## Feedback & Revision Process

This project includes a structured feedback and revision process:

1. **Feedback Collection**: All feedback is documented in `FEEDBACK_REVISIONS.md`
2. **Revision Tracking**: Changes are tracked in this changelog
3. **Version Control**: All changes are committed to Git with descriptive messages
4. **Testing**: All revisions are tested before deployment
5. **Documentation**: Changes are documented in relevant files

### How to Track Revisions

- Check `FEEDBACK_REVISIONS.md` for detailed feedback rounds
- Review this `CHANGELOG.md` for version history
- Check Git commits for code-level changes
- Review pull requests for collaborative changes

---

## Version History

- **1.1.0**: Current version with admin features, SEO, and accessibility
- **1.0.0**: Initial release with core functionality

---

**Maintained by**: Development Team
**Last Updated**: [Current Date]

