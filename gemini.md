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
  "image": "string (url)",
  "badge": "string | null",
  "category": "string"
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
7. Images use Unsplash CDN
8. Never commit .env, node_modules, or dist

## Architecture Invariants
- Navbar sits in MainLayout wrapping public pages
- Dashboard pages are standalone (no MainLayout)
- All page components live in src/pages/
- All shared components live in src/components/
- Tailwind styles only (no custom CSS files beyond imports)

## Route Map
| Path | Type | Auth Required |
|------|------|---------------|
| `/` | Public | No |
| `/about` | Public | No |
| `/admin-login` | Public | No |
| `/user-login` | Public | No |
| `/admin/dashboard` | Protected | Yes |
| `/user/dashboard` | Protected | Yes |

## File Structure
```
├── gemini.md              # This file — constitution
├── task_plan.md           # Phases & checklists
├── findings.md            # Research & constraints
├── progress.md            # Activity log
├── architecture/          # Layer 1: SOPs
├── tools/                 # Layer 3: Scripts
├── .tmp/                  # Intermediates
├── src/
│   ├── pages/             # Route components
│   ├── components/        # Shared components
│   ├── layouts/           # Layout wrappers
│   ├── App.jsx            # Root
│   ├── Router.jsx         # Route definitions
│   └── main.jsx           # Entry point
```

## Maintenance Log
| Date | Change | Author |
|------|--------|--------|
| 2026-06-21 | Initialized B.L.A.S.T. protocol | System |
