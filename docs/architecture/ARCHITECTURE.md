# System Architecture & Authority Model — ShopEase Nepal

**Project**: ShopEase Nepal (`React-Collage-B`)  
**Stack**: React 19 / Vite 8 + Firebase Authentication + Express 5 / Cloud Functions v2 + Cloud Firestore & Storage  
**Date**: August 2026  

---

## 1. System Overview & Architectural Topology

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 1. PRESENTATION TIER                                  │
│                       React 19 + Vite 8 Single Page Application                       │
│      ├── Tailwind CSS 4 Design System & Semantic UI Components                         │
│      ├── Context Layer: AuthContext, ProductContext, CartContext, ToastContext         │
│      ├── Routing & Protection: React Router 7 + ProtectedRoute (Race-free loading)     │
│      └── Media Layer: ImageWithSkeleton (Lazy, Cache Detection, No-Referrer Policy)    │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               2. AUTHENTICATION TIER                                   │
│                        Firebase Authentication (Google & Email)                        │
│      ├── Issues Cryptographically Signed RSA-256 JWT ID Tokens                         │
│      ├── Token Refresh Managed Automatically by Firebase Client SDK                    │
│      └── Authoritative Source of Identity (UID, email, verified claims)                │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                            3. APPLICATION & API SERVICES TIER                          │
│               Firebase Cloud Functions v2 (Express 5 + TypeScript + Node 22)           │
│      ├── Security Perimeter: Helmet, Hardened Origin CORS Whitelist                   │
│      ├── Abuse Protection: Sliding-Window Rate Limiters (120 req/min, 30 req/min)      │
│      ├── Correlation & Tracing: X-Request-ID Middleware + Structured Logger            │
│      ├── Authentication Middleware: verifyIdToken via Firebase Admin SDK               │
│      ├── Authorization Middleware: Server-side RBAC (Viewer, Editor, Admin)            │
│      ├── Input Validation: Zod Schema Validators (Rejects Malformed Payloads)          │
│      └── Standardized Error Envelope: 400, 401, 403, 404, 409, 422, 429, 500           │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               4. DATA & STORAGE PERSISTENCE                            │
│                        Google Cloud Firestore & Cloud Storage                          │
│      ├── firestore.rules: Diff-checked field restrictions (prevents role tampering)    │
│      ├── storage.rules: Strict 10MB limits & MIME type enforcement (image/*)           │
│      └── Data Schemas: Users, Products, Orders, Collages, Comments, Reactions, Coupons │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                            5. AUDIT & OBSERVABILITY TIER                               │
│                         Immutable Audit Logging & Telemetry                            │
│      ├── Collection: auditLogs (actorId, action, targetType, targetId, createdAt)      │
│      ├── Administrative Inspection: /admin/audit-logs UI with cursor-based pagination   │
│      └── Structured Server Logs: [timestamp] [level] route status durationMs requestId  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Route Matrix & Security Enforcement

| Route / Module | Method | Auth Required | Min Role | Input Validation | Rate Limit | Audit Logging | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/health` | `GET` | No | Public | N/A | Standard (120/m) | No | **Active** |
| `/api/v1/users/me` | `GET` | Yes | Authenticated | N/A | Standard (120/m) | No | **Active** |
| `/api/v1/users/me` | `PATCH` | Yes | Authenticated | Zod Schema | Strict (30/m) | No | **Active** |
| `/api/v1/users/admin/list` | `GET` | Yes | Admin | Query limit | Strict (30/m) | No | **Active** |
| `/api/v1/users/admin/:id/role` | `PATCH` | Yes | Admin | Zod Schema | Strict (30/m) | Yes | **Active** |
| `/api/v1/projects` | `GET` | Optional | Public/User | Query params | Standard (120/m) | No | **Active** |
| `/api/v1/projects` | `POST` | Yes | Editor / Admin | Zod Schema | Strict (30/m) | No | **Active** |
| `/api/v1/projects/:id` | `GET` | Optional | Public/Owner | String ID | Standard (120/m) | No | **Active** |
| `/api/v1/projects/:id` | `PATCH`/`DELETE` | Yes | Owner / Admin | String ID | Strict (30/m) | Yes (on del) | **Active** |
| `/api/v1/collages` | `GET` | Optional | Public/User | Cursor params | Standard (120/m) | No | **Active** |
| `/api/v1/collages` | `POST` | Yes | Editor / Admin | Zod Schema | Strict (30/m) | No | **Active** |
| `/api/v1/collages/:id` | `GET` | Optional | Public/Owner | String ID | Standard (120/m) | No | **Active** |
| `/api/v1/collages/:id` | `PATCH`/`DELETE` | Yes | Owner / Admin | Zod Schema | Strict (30/m) | Yes (on del) | **Active** |
| `/api/v1/collages/:id/images` | `GET` | Optional | Public | String ID | Standard (120/m) | No | **Active** |
| `/api/v1/collages/:id/images` | `POST` | Yes | Owner / Admin | Zod Schema | Strict (30/m) | No | **Active** |
| `/api/v1/collages/:id/images/:imgId` | `DELETE` | Yes | Owner / Admin | String ID | Strict (30/m) | No | **Active** |
| `/api/v1/collages/:id/comments` | `GET` | Optional | Public | String ID | Standard (120/m) | No | **Active** |
| `/api/v1/collages/:id/comments` | `POST` | Yes | Authenticated | Zod Schema | Strict (30/m) | No | **Active** |
| `/api/v1/collages/:id/comments/:cId` | `DELETE` | Yes | Author / Admin | String ID | Strict (30/m) | Yes (if admin) | **Active** |
| `/api/v1/collages/:id/reactions` | `POST`/`DEL` | Yes | Authenticated | Zod Schema | Strict (30/m) | No | **Active** |
| `/api/v1/audit-logs` | `GET` | Yes | Admin | Cursor params | Strict (30/m) | No | **Active** |

---

## 3. Data Integrity & Single Source of Truth

1. **User Identity**: Firebase Auth `uid` is the canonical immutable identifier.
2. **User Role**: `users/{uid}.role` verified server-side with Firebase Admin SDK in `functions/src/middleware/authorize.ts`.
3. **Image Delivery**: Handled uniformly through `ImageWithSkeleton` and canonical resolver `src/utils/imageUrl.js` (supporting relative paths, Firebase Storage URLs, Google CDN avatars with `no-referrer`, and Cloudinary).
4. **Counters**: Subcollections (`images`, `comments`, `reactions`) maintain atomic count fields synchronized via batch writes/transactions.
