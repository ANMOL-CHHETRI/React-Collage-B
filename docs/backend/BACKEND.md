# Backend Architecture & Operations Guide — React-Collage-B

## Overview

The **React-Collage-B** backend is built as a serverless **Express 5 API on Firebase Cloud Functions v2 (Node 22 + TypeScript)**, integrated with **Firebase Firestore**, **Firebase Authentication**, and **Firebase Cloud Storage**.

---

## 1. Architecture

```
┌───────────────────────────────────────────────────────────┐
│                     Client (Browser)                      │
│        React 19 + Vite SPA (Firebase Auth Client SDK)     │
└────────────────────────────┬──────────────────────────────┘
                             │ 1. Sign in → ID Token
                             │ 2. HTTPS Request + Authorization: Bearer <ID_TOKEN>
                             ▼
┌───────────────────────────────────────────────────────────┐
│               Firebase Cloud Functions (Node 22)           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Express 5 REST API (/api/v1)                        │  │
│  │   ├── CORS, Helmet                                  │  │
│  │   ├── authenticate (verifyIdToken via Admin SDK)    │  │
│  │   ├── authorizeRole (viewer, editor, admin)         │  │
│  │   ├── validateBody / validateQuery (Zod)            │  │
│  │   └── controllers & services                        │  │
│  └──────────────────────────┬──────────────────────────┘  │
│                             │ Firebase Admin SDK          │
│                             ▼                             │
│       ┌─────────────────────┴─────────────────────┐       │
│       ▼                                           ▼       │
│  ┌──────────┐                               ┌──────────┐  │
│  │Firestore │                               │ Storage  │  │
│  └──────────┘                               └──────────┘  │
└───────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

```
functions/
├── package.json
├── tsconfig.json
├── .env.example
├── src/
│   ├── index.ts                     # Cloud Functions export entrypoint
│   ├── app.ts                       # Express 5 application setup
│   │
│   ├── config/
│   │   └── firebaseAdmin.ts         # Firebase Admin SDK singleton
│   │
│   ├── middleware/
│   │   ├── authenticate.ts          # Verify ID token & inject req.user
│   │   ├── authorize.ts             # Role-based authorization
│   │   ├── validate.ts              # Zod validation middleware
│   │   └── errorHandler.ts          # Central JSON error envelope
│   │
│   ├── modules/
│   │   ├── users/                   # Profile & role management
│   │   ├── projects/                # Project management
│   │   ├── collages/                # Collage CRUD & search
│   │   ├── images/                  # Image metadata registration
│   │   ├── comments/                # Comments with soft-delete
│   │   └── reactions/               # Reactions with unique IDs
│   │
│   ├── triggers/
│   │   └── orderTriggers.ts         # Firestore background triggers
│   │
│   └── utils/
│       ├── errors.ts                # AppError class hierarchy
│       └── pagination.ts            # Cursor pagination helpers
│
└── tests/
    └── api.test.ts                  # Unit & integration test suite
```

---

## 3. Roles & Permissions Matrix

| Capability | Viewer | Editor | Admin |
|---|---|---|---|
| Read Public Collages & Images | ✅ | ✅ | ✅ |
| Read Private Collages (Own) | ❌ | ✅ | ✅ |
| Create Collages | ❌ | ✅ | ✅ |
| Modify Own Collage | ❌ | ✅ | ✅ |
| Modify Any Collage | ❌ | ❌ | ✅ |
| Upload Images to Own Collage | ❌ | ✅ | ✅ |
| Add Comments | ✅ | ✅ | ✅ |
| Edit/Delete Own Comment | ✅ | ✅ | ✅ |
| Moderate Any Comment | ❌ | ❌ | ✅ |
| Toggle Reactions | ✅ | ✅ | ✅ |

---

## 4. Local Development & Firebase Emulator Suite

### 1. Install dependencies
```bash
cd functions
npm install
npm run build
```

### 2. Start Firebase Emulators
From the repository root:
```bash
firebase emulators:start
```

### Configured Ports
* **Emulator Suite UI**: `http://localhost:4000`
* **Cloud Functions API**: `http://127.0.0.1:5001/shop-ease-database/us-central1/api/api/v1`
* **Firestore Emulator**: `localhost:8080`
* **Authentication Emulator**: `localhost:9099`
* **Storage Emulator**: `localhost:9199`

---

## 5. Deployment

### Deploy Backend Functions Only
```bash
firebase deploy --only functions
```

### Deploy Rules & Indexes
```bash
firebase deploy --only firestore
firebase deploy --only storage
```

### Full Deployment
```bash
npm run build
firebase deploy
```
