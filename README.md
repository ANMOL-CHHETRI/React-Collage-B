# ShopEase Nepal — Ecommerce Platform

## Team

- **Anmol Chhetri** — Project Lead
- **Sahil** — Backend
- **Sarang** — Frontend
- **Sanskarti** — UI Components
- **Smriti** — QA & Testing

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

| Team Member        | Role                   | Task                                     |
| ------------------ | ---------------------- | ---------------------------------------- |
| Anmol Chhetri      | Project Lead           | Project coordination and team management |
| Sahil Tuladhar     | Backend Developer      | Backend development                      |
| Sarang Limbu       | Frontend Developer     | Frontend development                     |
| Sanskriti Maharjan | UI Component Developer | UI component design and implementation   |
| Smriti Tamang      | QA & Testing           | Testing and quality assurance            |
