# Live Authentication & Authorization Audit Report

**Project**: React-Collage-B  
**Date**: August 2026  
**Auditor**: Antigravity Full-Stack Maintainer  
**Status**: AUDITED & VERIFIED  

---

## 1. Firebase Environment Verification

| Parameter | Configuration Location | Configured Value | Verification Status |
| :--- | :--- | :--- | :--- |
| **Default Project ID** | `.firebaserc` | `shopease-nepal-anmol-196e7` | **MATCHED** |
| **Frontend Project ID** | `.env` (`VITE_FIREBASE_PROJECT_ID`) | `shopease-nepal-anmol-196e7` | **MATCHED** |
| **Frontend Storage Bucket** | `.env` (`VITE_FIREBASE_STORAGE_BUCKET`) | `shopease-nepal-anmol-196e7.firebasestorage.app` | **MATCHED** |
| **Backend Admin App** | `functions/src/config/firebaseAdmin.ts` | Default Project / ADC Context | **MATCHED** |
| **Emulator Configuration** | `firebase.json` | Auth: 9099, Functions: 5001, Firestore: 8080, Storage: 9199, UI: 4000 | **MATCHED** |

---

## 2. Authentication & Token Verification Pipeline

The authentication chain follows a zero-trust model:

```text
[ React Client / User ]
        │
        ▼ (Google OAuth / Email Auth)
[ Firebase Auth Service ]
        │  Generates RS256 signed JWT
        ▼
[ Authorization: Bearer <idToken> ]
        │
        ▼
[ Express API: authenticate middleware ]
        │  adminAuth.verifyIdToken(idToken)
        │  Validates signature, expiration, issuer, audience
        ▼
[ Firestore: users/{uid} Lookup ]
        │  Retrieves { role, isActive, displayName, photoURL }
        ▼
[ Express API: authorizeRole middleware ]
        │  Enforces Role ('viewer' | 'editor' | 'admin')
        ▼
[ Controller / Domain Service Execution ]
```

---

## 3. Role & Permission Matrix (Live / Emulator Verification)

| Endpoint | Method | Unauthenticated | Viewer Role | Editor Role | Admin Role | Disabled User |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/health` | GET | `200 OK` | `200 OK` | `200 OK` | `200 OK` | `200 OK` |
| `/api/v1/users/me` | GET | `401 Unauthorized` | `200 OK` | `200 OK` | `200 OK` | `403 Forbidden` |
| `/api/v1/users/me` | PATCH | `401 Unauthorized` | `200 OK` | `200 OK` | `200 OK` | `403 Forbidden` |
| `/api/v1/users/admin/list` | GET | `401 Unauthorized` | `403 Forbidden` | `403 Forbidden` | `200 OK` | `403 Forbidden` |
| `/api/v1/users/admin/:id/role` | PATCH | `401 Unauthorized` | `403 Forbidden` | `403 Forbidden` | `200 OK` | `403 Forbidden` |
| `/api/v1/collages` | GET | `200 OK` (public) | `200 OK` (public) | `200 OK` (public) | `200 OK` (public) | `200 OK` (public) |
| `/api/v1/collages` | POST | `401 Unauthorized` | `403 Forbidden` | `201 Created` | `201 Created` | `403 Forbidden` |
| `/api/v1/collages/:id` | PATCH | `401 Unauthorized` | `403 Forbidden` | `200 OK` (if owner) | `200 OK` (any) | `403 Forbidden` |
| `/api/v1/collages/:id` | DELETE | `401 Unauthorized` | `403 Forbidden` | `200 OK` (if owner) | `200 OK` (any) | `403 Forbidden` |
| `/api/v1/collages/:id/comments` | POST | `401 Unauthorized` | `201 Created` | `201 Created` | `201 Created` | `403 Forbidden` |
| `/api/v1/collages/:id/reactions`| POST | `401 Unauthorized` | `200 OK` | `200 OK` | `200 OK` | `403 Forbidden` |

---

## 4. Key Hardening Enhancements
1. **Deactivated User Guard**:
   `authenticate.ts` verifies `userData.isActive !== false`. Inactive/banned users immediately receive `403 Forbidden`.
2. **Auto-Hydration on First Login**:
   When a user authenticates via Firebase Auth for the first time, `authenticate.ts` creates their default `users/{uid}` profile with role `viewer` and `isActive: true`.
3. **Bearer Token Validation**:
   Empty or malformed `Authorization` headers are rejected with structured `401 Unauthorized` responses before touching the database.
