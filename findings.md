p# Findings

## Project

- Name: react-collage-b (rebranded to ShopEase)
- Stack: React 19, Vite 8, Tailwind CSS v4, react-router-dom v7
- Build tool: Vite
- Package manager: npm

## Design Inspiration

- UI modeled after voldogfood.com layout
- Amber (#f59e0b) primary color, slate/gray neutrals
- Clean white backgrounds, rounded-2xl cards, shadow layering
- Sections: Hero → Categories → Products → Benefits → Treats → Testimonials → FAQ → Footer

## Constraints

- No backend API exists yet — all data is static/mocked
- No authentication logic — login pages are presentational
- No .env configuration needed currently
- Images use Unsplash CDN URLs

## Current Routes

| Path               | Component      | Layout     |
| ------------------ | -------------- | ---------- |
| `/`                | HomePage       | MainLayout |
| `/about`           | AboutPage      | MainLayout |
| `/admin-login`     | AdminLoginPage | None       |
| `/user-login`      | UserLoginPage  | None       |
| `/admin/dashboard` | AdminDashboard | None       |
| `/user/dashboard`  | UserDashboard  | None       |

## Discovery Answers (2026-06-21)

- **North Star**: Mix — full ecommerce MVP + admin dashboard + portfolio
- **Integrations**: REST API backend (future)
- **Source of Truth**: Static mock data (current), API later
- **Delivery**: GitHub Pages
- **Behavioral Rules**: Keep it simple

## Research Results (Phase 1.3 — 2026-06-21)

### GitHub Pages Deployment

- Standard Vite + GitHub Pages workflow uses 3 actions: `actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`
- Need to set `base` in `vite.config.js` to `/<repo-name>/` for project-page deployments
- SPA routing needs special handling (404.html or `build` script tweak)
- Workflow file goes in `.github/workflows/deploy.yml`
- See: [vitejs.dev static-deploy guide](https://github.com/vitejs/vite/blob/main/docs/guide/static-deploy.md)

### React Ecommerce Patterns (Tailwind v4)

- **tailstore4** — Free Tailwind 4 CSS eCommerce template (HTML/CSS only)
- **learnershakil/blackbox-frontend** — React 19, Tailwind v4, Zustand, React Query, full ecommerce + admin
- **Epic-Design-Labs/nextjs-ecommerce-starter** — Next.js 16, Tailwind v4, shadcn/ui, Zustand (cart/wishlist/auth), product JSON data
- Confirms our approach (mock data, component-per-file, Tailwind v4) is standard

### react-router v8 Breaking Change

- **v8 DROPS `react-router-dom`** — DOM APIs collapsed into `react-router/dom`
- All imports should now use `react-router` (we were already doing this)
- Our project had BOTH `react-router@8.0.0` and `react-router-dom@7.18.0` installed — version conflict
- **Fix applied**: Removed `react-router-dom` from package.json. Build passes.

## Discoveries

- Tailwind v4 uses `@import "tailwindcss"` in CSS (no config file needed)
- Tailwind v4 Vite plugin must be added to vite.config.js
- Unsplash CDN URLs work well for placeholder product images
- `@tailwindcss/vite` v4.3.1 is compatible with Tailwind v4.3.1
- Python subprocess on Windows needs `shell=True` to find npm in PATH

## Deployment Setup

- `.github/workflows/deploy.yml` — GitHub Actions workflow for GitHub Pages
- `vite.config.js` — uses `VITE_BASE_PATH` env var for dynamic `base` path
- `.env.example` — template for local env vars
- `tools/build.py` — atomic build + verify script
- `tools/check_build.py` — post-build validation
