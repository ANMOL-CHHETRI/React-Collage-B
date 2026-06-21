# SOP-000: Frontend Architecture

## Goal
Maintain a consistent, scalable React + Vite frontend with Tailwind CSS v4.

## Inputs
- JSX components in `src/pages/` and `src/components/`
- Tailwind utility classes in JSX
- Route config in `src/Router.jsx`

## Process
1. Pages live in `src/pages/` — one file per route
2. Shared UI lives in `src/components/` — Navbar, cards, etc.
3. Layouts in `src/layouts/` wrap groups of routes via `<Outlet />`
4. Routes are defined centrally in `src/Router.jsx`
5. Tailwind v4: import via `@import "tailwindcss"` in `App.css`
6. Build: `npm run build` — outputs to `dist/`
7. Automated build: `python tools/build.py` — runs build + validates dist
8. Post-build check: `python tools/check_build.py` — verifies dist integrity

## Deployment
- GitHub Actions workflow at `.github/workflows/deploy.yml`
- Set `VITE_BASE_PATH=/<repo>/` for GitHub Pages project sites
- Workflow triggers on push to `main` branch

## Edge Cases
- Unmatched routes → 404 page (not yet implemented)
- Missing images → unsplash URL fallback
- Empty product list → show "No products" message

## Golden Rule
Update this SOP before changing the architecture. If routing strategy changes, update here first.
