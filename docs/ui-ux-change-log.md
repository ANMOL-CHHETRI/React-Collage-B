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
