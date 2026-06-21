# SOP-002: Routing Convention

## Route Layout
- Public pages (Home, About) → wrapped in `<MainLayout>` (Navbar + Outlet)
- Auth pages (AdminLogin, UserLogin) → standalone, no Navbar
- Dashboard pages (AdminDashboard, UserDashboard) → standalone with sidebar

## Adding a New Route
1. Create page component in `src/pages/`
2. Import in `src/Router.jsx`
3. Add `<Route>` in the appropriate location
4. If it needs Navbar, nest under `element={<MainLayout />}`

## Navigation
- Use `<Link>` for static navigation
- Use `<NavLink>` for nav items that need active state styling
- Active link style: `text-amber-600 font-semibold`
