# Project Constitution — ShopEase Ecommerce

## Identity
React + Vite ecommerce frontend. Pure UI — no backend yet. Designed after voldogfood.com.

## Tech Stack
- React 19, Vite 8
- Tailwind CSS v4 (via @tailwindcss/vite)
- react-router v8 (removed react-router-dom — deprecated in v8)
- ESLint (flat config)

## Data Schemas

### Product
```json
{
  "id": "number",
  "name": "string",
  "price": "number",
  "image": "string (url — Pinterest CDN i.pinimg.com)",
  "badge": "string | null",
  "category": "string",
  "description": "string",
  "addedBy": "string ('admin' | userId)"
}
```

### Category
```json
{
  "name": "string",
  "image": "string (url)"
}
```

### User
```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "avatar": "string",
  "orders": "number",
  "wishlistCount": "number"
}
```

### Order
```json
{
  "id": "string",
  "customer": "string",
  "product": "string",
  "amount": "string",
  "status": "enum (Delivered | Processing | Shipped | Pending)",
  "date": "string",
  "items": "number"
}
```

### Testimonial
```json
{
  "name": "string",
  "text": "string",
  "avatar": "string (initials)",
  "rating": "number (1-5)"
}
```

### FAQ
```json
{
  "q": "string",
  "a": "string"
}
```

## Discovery Answers (Phase 1)
- North Star: Mix — full ecommerce MVP + admin dashboard + portfolio
- Integrations: REST API backend (future)
- Source of Truth: Static mock data (current)
- Delivery: GitHub Pages
- Rule: Keep it simple

## Behavioral Rules
1. No backend calls — all data is static/mocked until API integration
2. Login pages are presentational only — no auth validation
3. UI must be responsive (mobile-first with md: breakpoints)
4. Color palette: amber primary, slate/gray neutrals, white backgrounds
5. All cards use rounded-2xl, shadows on hover
6. Icons use Heroicons (stroke style) via inline SVGs
7. **Images use Pinterest CDN (i.pinimg.com) with `referrerPolicy="no-referrer"`** — Unsplash removed
8. Never commit .env, node_modules, or dist
9. All product images wrapped in `<ImageWithSkeleton>` for graceful loading with animated skeletons
10. Global theme (dark/light) is managed in `AuthContext` — never use local state for theme
11. Admin can ban users; banned users see a violation banner and are blocked from login
12. `DATA_VERSION` constant in `productsData.js` auto-clears localStorage cache on version bump

## Architecture Invariants
- Navbar sits in MainLayout wrapping public pages
- Dashboard pages are standalone (no MainLayout)
- All page components live in `src/pages/`
- All shared components live in `src/components/`
- Tailwind styles only (no custom CSS files beyond imports)
- Theme state lives in `AuthContext` (shared across Navbar, dashboards, all pages)
- `ImageWithSkeleton` component must be defined locally in each page file that needs it (HomePage, CategoryPage, ProductDetailPage, UserDashboard) — requires `useRef` import
- Product data versioning via `DATA_VERSION` in `productsData.js` forces cache refresh on update

## Route Map
| Path | Type | Auth Required |
|------|------|---------------|
| `/` | Public | No |
| `/about` | Public | No |
| `/contact` | Public | No |
| `/faq` | Public | No |
| `/policy` | Public | No |
| `/cart` | Public | No |
| `/product/:id` | Public | No |
| `/category/:categoryName` | Public | No |
| `/delivery-coverage` | Public | No |
| `/admin-login` | Public | No |
| `/user-login` | Public | No |
| `/admin/dashboard` | Protected | Yes (admin) |
| `/user/dashboard` | Protected | Yes (user) |
| `/user/profile` | Protected | Yes (user) |

## File Structure
```
├── gemini.md              # Project constitution
├── task_plan.md           # Phases & checklists
├── findings.md            # Research & constraints
├── progress.md            # Activity log
├── CREDENTIALS.md         # Demo login credentials
├── architecture/          # Layer 1: SOPs
├── tools/                 # Layer 3: Scripts (build.py, check_build.py, etc.)
├── .tmp/                  # Intermediates
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── AdminLoginPage.jsx
│   │   ├── UserLoginPage.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── UserProfilePage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── CategoryPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── FAQPage.jsx
│   │   ├── PolicyPage.jsx
│   │   └── DeliveryCoveragePage.jsx  ← NEW
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Skeleton.jsx
│   │   ├── NepalDeliveryMap.jsx
│   │   ├── NepalMap.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   ├── AuthContext.jsx   # Global theme + auth + ban state
│   │   ├── CartContext.jsx
│   │   └── ProductContext.jsx
│   ├── data/
│   │   ├── productsData.js   # Default products + localStorage migration
│   │   ├── provincesData.js
│   │   └── nepal-with-provinces.json
│   ├── layouts/
│   │   └── MainLayout.jsx
│   ├── App.jsx
│   ├── Router.jsx
│   └── main.jsx
```

## Maintenance Log
| Date | Change | Author |
|------|--------|---------|
| 2026-06-21 | Initialized B.L.A.S.T. protocol | System |
| 2026-06-26 | Added global dark mode via AuthContext; synced Navbar, UserDashboard, AdminDashboard | Agent |
| 2026-06-26 | Added violation/ban system in AdminDashboard; violation counter + user ban from admin | Agent |
| 2026-06-26 | Added in-app violation notification banner for banned/warned users | Agent |
| 2026-06-26 | Fixed white-screen-of-death on admin product update; resolved ProductContext crash | Agent |
| 2026-06-26 | Added `<ImageWithSkeleton>` component with animated skeleton loading placeholder | Agent |
| 2026-06-26 | Migrated all product + category images from Unsplash to Pinterest CDN (i.pinimg.com) | Agent |
| 2026-06-26 | Added `referrerPolicy="no-referrer"` to all product/category images to bypass Pinterest hotlink protection | Agent |
| 2026-06-26 | Added `useRef` + `imgRef.current.complete` check to fix cached image opacity bug | Agent |
| 2026-06-26 | Added Most Sold crown badge (👑 MOST SOLD) on product id=1 across HomePage, CategoryPage, ProductDetailPage | Agent |
| 2026-06-26 | Added dark mode support to ProductDetailPage, UserProfilePage | Agent |
| 2026-06-27 | Updated product images (ids 2–8) to verified Pinterest pin CDN URLs supplied by user | Agent |
| 2026-06-27 | Added `DATA_VERSION` cache buster in `productsData.js` to auto-clear stale localStorage on deploy | Agent |
| 2026-06-27 | Fixed `useRef` missing import crash in CategoryPage, ProductDetailPage, UserDashboard | Agent |
| 2026-06-27 | Created `DeliveryCoveragePage.jsx` — dedicated `/delivery-coverage` route with full Nepal map | Agent |
| 2026-06-27 | Fixed Delivery Coverage navbar links (desktop + mobile) from broken `#delivery` anchor to `NavLink to="/delivery-coverage"` | Agent |
| 2026-07-13 | Added user & admin avatar uploads, preset avatar generator (A-Z, 0-9), relocated logout button to dashboards | Agent |
| 2026-07-13 | Fixed UserProfilePage dark mode styling and AdminDashboard parse error | Agent |
| 2026-07-13 | Added global Reviews tab in AdminDashboard and product-specific Reviews tab in Seller Dashboard | Agent |
| 2026-07-13 | Added user profile pictures rendering inside review cards across dashboards | Agent |
| 2026-08-07 | Created .env with Google OAuth Client ID & Secret; added Google Identity Services script & GoogleSignInButton component to UserLoginPage | Agent |
| 2026-08-08 | Transitioned from localStorage mock data to Firebase Firestore | Agent |
| 2026-08-08 | Integrated Cloudinary for live image uploads across Admin and Seller dashboards | Agent |
