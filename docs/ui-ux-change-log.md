# UI/UX Change Log

**Project:** React-Collage-B (ShopEase Nepal Ecommerce Platform)  

This log tracks every design decision, accessibility improvement, responsive adjustment, and code update implemented during the UI/UX transformation.

---

## Change #001 — Accessibility & Focus Ring Foundation

### Date
2026-08-07

### Area
Global CSS & Utility Foundation

### Problem
Interactive elements (buttons, inputs, cards) lacked consistent, high-contrast keyboard focus indicators across light and dark modes.

### Change
- Added `.focus-ring` utility class in `src/index.css` supporting `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2`.
- Standardized interactive focus styles across buttons, inputs, and links.

### Expected Impact
Full keyboard navigation compliance for visual focus state without disrupting default mouse click aesthetics.

### Files Changed
- `src/index.css`

### Validation
- [x] Desktop tested
- [x] Keyboard tested (`Tab`, `Shift+Tab`)
- [x] Dark mode tested

---

## Change #002 — Product Card Component Overhaul

### Date
2026-08-07

### Area
`src/components/ProductCard.jsx`

### Problem
Product cards lacked explicit ARIA labels for wishlist action, and the "Add to Cart" button required mouse hover to be reachable by keyboard.

### Change
- Added explicit `aria-label="Add to wishlist"` and `aria-label="Add [name] to cart"` attributes.
- Ensured card image container maintains fixed aspect ratio (`aspect-[4/5]`) to prevent layout shifts.
- Retained crown badge (`👑 MOST SOLD`) on product `id=1` and `referrerPolicy="no-referrer"` for Pinterest CDN compatibility.

### Expected Impact
Improved accessibility for screen reader and keyboard users; zero CLS.

### Files Changed
- `src/components/ProductCard.jsx`

### Validation
- [x] Desktop tested
- [x] Mobile tested
- [x] Keyboard tested
- [x] Build passed

---

## Change #003 — Global Header Accessibility & Navigation

### Date
2026-08-07

### Area
`src/components/Navbar.jsx`

### Problem
Header action icons (Wishlist, Cart, Theme Toggle, Notifications) had no text labels or `aria-label` attributes.

### Change
- Added `aria-label` attributes to all icon-only buttons (`aria-label="Wishlist"`, `aria-label="Cart"`, `aria-label="Toggle theme"`, `aria-label="Notifications"`).
- Enhanced mobile drawer menu spacing and touch targets.

### Expected Impact
Accessible navigation header compliant with WCAG screen reader standards.

### Files Changed
- `src/components/Navbar.jsx`

### Validation
- [x] Desktop tested
- [x] Mobile tested
- [x] Keyboard tested
- [x] Build passed

---

## Change #004 — Navbar Authentication Simplification

### Date
2026-08-07

### Area
Navigation / Authentication UX (`src/components/Navbar.jsx`)

### Problem
Unauthenticated users were shown a User Dashboard/person icon even though they were not authenticated. The navbar also exposed separate Login and Signup actions, creating redundant authentication controls.

### Change
- Replaced separate Login/Signup navbar actions with a single `Sign In` CTA (`to="/user-login"`).
- Displayed User Dashboard icon (`👤`) exclusively for authenticated users (`user !== null`).
- Added explicit ARIA labels (`aria-label="Sign in"`, `aria-label="Open user dashboard"`).
- Updated both desktop and mobile navigation menus to enforce the simplified authentication state.

### UX Rationale
Authentication actions should reflect the user's current state. Unauthenticated users need a single clear entry point into authentication (`Sign In`), while authenticated users need direct access to their account dashboard.

### Expected Impact
- Reduced navbar clutter and cognitive load.
- Clear separation between visitor and authenticated experiences.
- Accessible keyboard navigation and mobile menu state.

### Files Changed
- `src/components/Navbar.jsx`

### Validation
- [x] Logged-out state tested
- [x] Logged-in state tested
- [x] Logout state tested
- [x] Desktop tested
- [x] Mobile tested
- [x] Keyboard tested
- [x] Build passed
- [x] Lint passed

---

## Change #005 — Navbar Information Architecture & Visual Hierarchy

### Date
2026-08-07

### Area
Navigation / Header Layout (`src/components/Navbar.jsx`)

### Problem
The navbar contained too many equally weighted links (About, Categories, Contact, Delivery Coverage, Coworking Space, FAQ) and an internal development badge (`Live DB`), creating visual clutter and weak ecommerce hierarchy.

### Change
- Removed the public `Live DB` badge from the header brand area.
- Streamlined desktop primary navigation to 3 core items: `Categories` (dropdown), `About`, and `Contact`.
- Moved secondary informational links (`Delivery Coverage`, `Coworking Space`, `FAQ`) out of the desktop header while preserving their routes, footer presence, and categorized mobile drawer placement.
- Integrated search bar (width 224px–288px) into the right action group with `aria-label="Search products"` and focus states.
- Grouped shopping actions (`Wishlist` `♡`, `Cart` `🛒`, `Sign In` / `User Dashboard` `👤`, `Theme Toggle` `☾`/`☀️`) with equal sizing, ARIA labels, and focus rings.
- Categorized mobile navigation drawer into scanable sections: **SHOP**, **COMPANY**, **HELP**, **ACCOUNT**, and **PREFERENCES**.

### UX Rationale
Ecommerce navigation must prioritize product discovery (`Categories`, `Search`, `Wishlist`, `Cart`). Removing secondary page clutter and grouping action controls establishes a clear, professional visual hierarchy.

### Expected Impact
- Reduced cognitive load.
- Enhanced product discovery & search prominence.
- Clearer ecommerce visual hierarchy.
- Improved mobile drawer navigation.

### Files Changed
- `src/components/Navbar.jsx`

### Validation
- [x] Desktop tested
- [x] Mobile tested
- [x] Keyboard tested
- [x] Build passed
- [x] Lint passed
