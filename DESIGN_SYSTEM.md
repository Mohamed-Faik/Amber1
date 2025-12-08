# Design System Documentation
## AmberHomes - Design Guidelines

This document outlines the design system, components, and guidelines used in the AmberHomes platform.

---

## Design Files

### Figma / Adobe XD
- **Design Files Location**: [Add Figma/XD file links here]
- **Design System File**: [Link to design system file]
- **Component Library**: [Link to component library]
- **User Flows**: [Link to user flow diagrams]

> **Note**: If you have design files in Figma or Adobe XD, please add the links above. This helps developers and stakeholders reference the original designs.

---

## Design Tokens

### Colors

#### Primary Colors
- **Primary Red**: `#FF385C`
  - Used for: CTAs, links, active states, brand elements
  - Hover: `#E61E4D`
  - Active: `#D70466`

#### Neutral Colors
- **Black**: `#222222` / `#000000`
- **Dark Gray**: `#717171`
- **Medium Gray**: `#848484`
- **Light Gray**: `#E0E0E0` / `#DDDDDD`
- **Background Gray**: `#F7F7F7` / `#F9FAFB`
- **White**: `#FFFFFF`

#### Status Colors
- **Success/Active**: `#10B981`
- **Error/Warning**: `#EF4444`
- **Info**: `#3B82F6`
- **Purple (Moderator)**: `#8B5CF6`

### Typography

#### Font Family
- **Primary Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Fallback**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`

#### Font Sizes
- **H1**: 36px (2.25rem) - Page titles
- **H2**: 32px (2rem) - Section titles
- **H3**: 24px (1.5rem) - Subsection titles
- **H4**: 20px (1.25rem) - Card titles
- **Body**: 16px (1rem) - Default text
- **Small**: 14px (0.875rem) - Labels, captions
- **Tiny**: 12px (0.75rem) - Badges, metadata

#### Font Weights
- **Light**: 300
- **Regular**: 400 (default)
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Spacing

#### Base Unit: 4px

- **XS**: 4px (0.25rem)
- **SM**: 8px (0.5rem)
- **MD**: 12px (0.75rem)
- **LG**: 16px (1rem)
- **XL**: 20px (1.25rem)
- **2XL**: 24px (1.5rem)
- **3XL**: 32px (2rem)
- **4XL**: 48px (3rem)
- **5XL**: 64px (4rem)

### Border Radius

- **Small**: 8px - Inputs, small buttons
- **Medium**: 12px - Cards, dropdowns
- **Large**: 16px - Modals, large cards
- **Pill**: 20-24px - Badges, user avatars
- **Full**: 50% - Circular elements

### Shadows

- **Small**: `0 2px 4px rgba(0, 0, 0, 0.08)`
- **Medium**: `0 4px 12px rgba(0, 0, 0, 0.1)`
- **Large**: `0 8px 24px rgba(0, 0, 0, 0.15)`
- **Focus**: `0 0 0 3px rgba(255, 56, 92, 0.1)`

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 991px
- **Desktop**: 992px - 1199px
- **Large Desktop**: ≥ 1200px

---

## Components

### Buttons

#### Primary Button
- Background: `#FF385C`
- Text: `#FFFFFF`
- Padding: `12px 24px`
- Border Radius: `12px`
- Font Weight: `600`
- Hover: Background `#E61E4D`, slight lift

#### Secondary Button
- Background: `#FFFFFF`
- Text: `#FF385C`
- Border: `1px solid #FF385C`
- Padding: `12px 24px`
- Border Radius: `12px`

### Input Fields

- Border: `1px solid #E0E0E0`
- Border Radius: `12px`
- Padding: `14px 16px`
- Focus: Border `#FF385C`, shadow `0 0 0 4px rgba(255, 56, 92, 0.1)`
- Error: Border `#FF385C`, red text

### Cards

- Background: `#FFFFFF`
- Border: `1px solid #E0E0E0`
- Border Radius: `12px` or `16px`
- Padding: `24px` or `32px`
- Shadow: `0 2px 8px rgba(0, 0, 0, 0.08)`
- Hover: Shadow `0 4px 12px rgba(0, 0, 0, 0.1)`

### Navigation

- Background: `#FFFFFF`
- Height: `70px`
- Border Bottom: `1px solid #E0E0E0`
- Sticky: Yes
- Shadow on scroll: `0 2px 12px rgba(0, 0, 0, 0.08)`

---

## Design Principles

### 1. Consistency
- Use consistent spacing, colors, and typography throughout
- Follow established patterns for similar components

### 2. Accessibility
- Maintain WCAG 2.1 AA compliance
- Ensure sufficient color contrast (4.5:1 for text)
- Provide focus indicators for keyboard navigation

### 3. Responsiveness
- Mobile-first approach
- Breakpoints at 768px, 992px, 1200px
- Touch-friendly targets (min 44x44px)

### 4. User Experience
- Clear visual hierarchy
- Intuitive navigation
- Fast loading and smooth transitions
- Error prevention and clear feedback

---

## Component Library Reference

### Layout Components
- **Navbar**: Main navigation with logo, links, user menu
- **Footer**: Site footer with links and information
- **PageBanner**: Page title banner component
- **Container**: Content wrapper with max-width

### Form Components
- **Input**: Text input with label and error handling
- **Button**: Primary and secondary button styles
- **Select**: Dropdown select component
- **ImageUpload**: Image upload with preview
- **MultiImageUpload**: Multiple image upload

### Listing Components
- **ListingCard**: Property card for grid/list views
- **ListingDetails**: Full listing detail page
- **SearchForm**: Advanced search with filters
- **CategoryFilter**: Category selection dropdown

### Admin Components
- **AdminPanel**: Main admin dashboard
- **UserManagement**: User list and management
- **ListingManagement**: Listing approval interface
- **ContentEditor**: CMS for editing content

---

## Design File Integration

If you have design files in Figma or Adobe XD:

1. **Export Assets**: Export icons, images, and graphics
2. **Share Links**: Add view/edit links to this document
3. **Design Tokens**: Sync colors, typography, spacing
4. **Component Specs**: Document component dimensions and spacing
5. **User Flows**: Include user flow diagrams

### Recommended Figma/XD Structure

```
AmberHomes Design System
├── 01. Design Tokens
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Shadows
├── 02. Components
│   ├── Buttons
│   ├── Forms
│   ├── Cards
│   └── Navigation
├── 03. Pages
│   ├── Homepage
│   ├── Listings
│   ├── Listing Detail
│   └── Admin Dashboard
└── 04. User Flows
    ├── Search Flow
    ├── Create Listing Flow
    └── Admin Approval Flow
```

---

## Implementation Notes

- All components follow the design system tokens
- CSS variables used for theming (future dark mode support)
- Responsive breakpoints match design specifications
- Accessibility features built into all components

---

## Design Updates

When design files are updated:
1. Review changes in Figma/XD
2. Update this documentation
3. Sync design tokens if changed
4. Update component implementations
5. Test across all breakpoints

---

**Last Updated**: [Current Date]
**Design Tool**: [Figma / Adobe XD / Other]
**Designer**: [Designer Name]
**Design File Links**: [Add links here]

