# ShopEase Nepal — User Division (5 Groups)

This document defines five user divisions/groups and what each group is allowed to do in the ShopEase Nepal frontend.

> Note: This project currently uses **mock/static data** (no real backend/API yet). “Permissions” are enforced only in the UI/routes as implemented in the code.

---

## 1) Guest (Not Logged In)

**Identity:** No valid session/token.

**Can do:**

- Browse pages: `/` (Home), `/about`, `/policy`, `/contact`
- View product catalog and product details
- Add items to cart (guest cart behavior as implemented)
- Use the delivery map (province selection)
- Read FAQ

**Cannot do:**

- Place orders (checkout)
- Access admin dashboard
- Access user dashboard
- Edit profile

---

## 2) Logged-in User (Customer)

**Identity:** Authenticated normal customer.

**Can do:**

- All Guest abilities **plus**
- Place orders (checkout flow)
- View `/user/dashboard`
- Edit profile at `/user/profile`
- View order history
- Manage wishlist (if enabled by current UI)

---

## 3) Delivery Planner / Logistics Staff

**Identity:** Staff account for delivery operations.

**Can do (intended behavior):**

- View delivery coverage map
- View delivery-related settings/info
- Simulate/update delivery status (future backend)

**Cannot do:**

- Place admin-wide changes to products
- Access Admin CRUD dashboard (unless explicitly enabled)
- Edit customer orders unless supported by future backend

> This group is a placeholder for future roles; current codebase may not include dedicated routes yet.

---

## 4) Content Editor

**Identity:** Staff role for updating store content.

**Can do (intended behavior):**

- Limited product updates (e.g., name/description/images) for specific catalogs
- Update homepage highlights (future)

**Cannot do:**

- Full admin settings changes
- Manage users/roles (future)
- Delete products globally

> This group is a placeholder for future roles; current codebase may not include dedicated routes yet.

---

## 5) Admin

**Identity:** Authenticated administrator.

**Can do:**

- All Guest abilities **plus**
- Access `/admin/dashboard`
- Access full CRUD via `/dashboard/crud` (add/edit/delete products + image upload)
- Manage settings (as implemented)
- Manage admin/user credentials (as implemented)

**Cannot do:**

- Place orders as a customer (unless explicitly enabled)
- Access user profile editing (unless explicitly enabled)

---

## Credentials (as currently documented)

- **User Login:**
  - Email: `user@test.com`
  - Password: `user123`
  - Login URL: `/user-login`

- **Admin Login:**
  - Username: `admin`
  - Password: `admin123`
  - Login URL: `/admin-login`

---

## Where to verify in code (current repo)

- Delivery map UI: `src/components/NepalDeliveryMap.jsx` and `src/components/NepalInteractiveMap.jsx`
- Checkout + province selection: `src/pages/HomePage.jsx`
- Routes/layout: `src/Router.jsx`, `src/layouts/MainLayout.jsx`

---

## If you want this to become real permissions

To enforce these roles properly you would typically:

1. Add backend authentication + JWT/session
2. Implement role checks in `ProtectedRoute`
3. Create separate admin/staff routes for delivery/content roles
4. Store order/product modifications behind backend authorization
