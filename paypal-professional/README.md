# LCC Admin & Company Dashboards v2.0 - PayPal Professional

## Quick Start Guide

### Files Created

1. **admin-dashboard.html** (32KB) - Admin Portal interface
2. **admin-dashboard.css** (18KB) - Admin styling with PayPal branding
3. **admin-dashboard.js** (42KB) - Admin functionality
4. **company-dashboard.html** (16KB) - Company/manufacturer portal
5. **company-dashboard.css** (8.9KB) - Company styling
6. **company-dashboard.js** (25KB) - Company reporting functionality
7. **ADMIN_DASHBOARD_GUIDE.md** (22KB) - Complete documentation

### How to Run

1. Open `admin-dashboard.html` in your browser for the admin portal
2. Open `company-dashboard.html` in your browser for the company portal

### Demo Credentials

**Admin Portal:**
- Username: `admin@lcc.state.gov`
- Password: `admin123`

**Company Portal:**
- Tax ID: `12-3456789`
- Password: `demo123`

### Key Features

**Admin Portal (6 Sections):**
1. Dashboard Overview - Statistics and recent reports
2. View Reports - Advanced filtering and search
3. Report Review - Detailed examination with approve/reject
4. Setup Sizes - Manage barrels, bottles, cases
5. Winery Settings - Configure reporting frequency
6. Notifications - Email tracking and history

**Company Portal (2 Sections):**
1. Submit Report - 13 dynamic report types
2. My Reports - Track submitted reports and status

### PayPal Branding

- Clean, professional design
- PayPal Blue (#003087) primary color
- Inter font family
- White backgrounds with subtle borders
- Flat design (no gradients)
- 8px border radius
- Mobile-responsive (320px+)

### Report Types

**Beer (4 types):**
- Production (35-7136)
- Inventory (35-7137)
- Sales (35-7138)
- Annual Summary (35-7127)

**Wine (4 types):**
- Production (35-7131)
- Inventory (35-7135)
- Sales (35-7142)
- Annual Summary (35-7130)

**Spirits (5 types):**
- Production (35-7150)
- Inventory (35-7155)
- Sales (35-7147)
- Bottling (35-7153)
- Annual Summary (35-7145)

### Status Workflow

```
Submitted → Waiting → Approved (final)
                 ↓
          Needs Correction → Resubmit → Waiting
```

### Browser Storage

All data is stored in localStorage for demo purposes. In production, this would be replaced with:
- PostgreSQL database
- Express.js REST API
- State.gov CDB authentication
- AWS SES for email notifications

### Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px (max-width: 1400px)

### Accessibility

- WCAG AA compliant
- Keyboard navigation support
- Screen reader friendly
- 4.5:1 contrast ratio minimum

### Testing

See **ADMIN_DASHBOARD_GUIDE.md** for comprehensive testing instructions.

### Support

For detailed documentation, see **ADMIN_DASHBOARD_GUIDE.md** (22KB)

---

**Version:** 2.0
**Date:** December 17, 2025
**Status:** ✓ Complete and Ready for Testing
