# ShopEase Nepal — Login Credentials

> **Demo only.** These are local demo accounts stored in the browser. Do not use in production.

---

## Admin Account

| Field    | Value        |
|----------|--------------|
| Username | `admin`      |
| Password | `admin123`   |
| Login URL | `/admin-login` |
| Dashboard URL | `/admin/dashboard` |

**Access:** Admin dashboard, product CRUD, store management.

---

## User Account

| Field    | Value        |
|----------|--------------|
| Username | `user`       |
| Password | `user123`    |
| Login URL | `/user-login` |
| Dashboard URL | `/user/dashboard` |

**Access:** User dashboard, orders, profile, delivery map.

---

## Important Notes

- Admin and user accounts use **different usernames and passwords**.
- You can sign in from `/user-login` with either account — admin goes to admin dashboard, user goes to user dashboard.
- Admin-only login page is also available at `/admin-login`.
- Both accounts can change their password from their dashboard (Settings / Profile).
- New passwords must be different from the current password and cannot match the other account's password.
- Changed passwords are saved in browser localStorage and persist across sessions.
