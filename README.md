# ShopEase Nepal — Ecommerce Platform

## Team

- **Pritee Shah** — Project Lead (Project Oversight)
- **Shishir Dangi** — Cart Backend
- **Sahil Thapa** — Checkout UI
- **Sichan Shrestha** — Payment Prep
- **Menuka R. Chhetri** — QA & Testing

## User Groups & Permissions

### 👤 Guest (Not Logged In)

- Browse the store (HomePage, About, Policy, Contact)
- Search and filter products
- View product details
- Add items to cart (guest cart)
- Access delivery map
- **Cannot** place orders or access dashboards

### 👥 Logged-In User

| Credential | Value           |
| ---------- | --------------- |
| Email      | `user|
| Password   | `user123`       |
| Login URL  | `/user-login`   |

All guest abilities **plus**:

- Place orders (checkout flow)
- View **UserDashboard** at `/user/dashboard`
- Edit profile (name, email, phone, address) at `/user/profile`
- View order history, status, and re-order ("Buy Again")
- Wishlist management
- Check delivery map
- Access CRUD Dashboard at `/dashboard/crud` (limited — can only edit/delete products they added)

### 🔐 Admin

| Credential | Value          |
| ---------- | -------------- |
| Username   | `admin`        |
| Password   | `admin123`     |
| Login URL  | `/admin-login` |

All guest abilities **plus**:

- Full **AdminDashboard** at `/admin/dashboard` (stats, recent orders, settings)
- Full **CRUD Dashboard** at `/dashboard/crud` — add, edit, delete any product with image upload
- Change admin/user passwords in Settings
- **Cannot** place orders or access user profile

## Quick Start

```bash
npm install
npm run dev     # → http://localhost:5173
npm run build   # production build
```

## Tech Stack

React 19 + Vite + Tailwind CSS v4 + react-router v8


## Development Team

| Team Member       | Role / Focus Area | Task / Key Deliverables                                                                       |
| ----------------- | ----------------- | --------------------------------------------------------------------------------------------- |
| Pritee Shah       | Project Lead      | Reviewed the end-to-end checkout workflow logic; managed the transition to 87% completion.    |
| Shishir Dangi     | Cart Backend      | Developed core session management logic for adding and calculating cart items.                |
| Sahil Thapa       | Checkout UI       | Designed and implemented the UI for the Shipping Address and Order Summary pages.             |
| Sichan Shrestha   | Payment Prep      | Mapped out data requirements for e-Sewa and Khalti API integration.                           |
| Menuka R. Chhetri | QA & Testing      | Verified that cart totals and product details are accurately passed from frontend to checkout. |
