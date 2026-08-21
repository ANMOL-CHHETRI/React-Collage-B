# Production Readiness Checklist

**Project**: React-Collage-B / ShopEase Nepal  
**Date**: August 2026  
**Status**: RELEASE CANDIDATE (AUTOMATED & LIVE FRONTEND VERIFIED)  

---

## Production Verification & Sign-Off Matrix

### 1. Codebase Quality & Static Integrity
- [x] `[AUTOMATED VERIFIED]` **Frontend Linter**: `npm run lint` passing (0 errors, 0 warnings).
- [x] `[AUTOMATED VERIFIED]` **Frontend Production Build**: `npm run build` bundling cleanly via Vite 8.
- [x] `[AUTOMATED VERIFIED]` **Backend TypeScript Build**: `tsc` compiling without errors to `functions/lib`.
- [x] `[AUTOMATED VERIFIED]` **Backend Vitest Suite**: 49/49 unit & integration tests passing.
- [x] `[AUTOMATED VERIFIED]` **Static Asset Audit**: `tools/audit_and_repair.mjs` (37/37 checks pass).
- [x] `[AUTOMATED VERIFIED]` **Firebase Image Audit**: `tools/firebase-image-audit.mjs` (16/16 references pass).
- [x] `[AUTOMATED VERIFIED]` **Counter Audit**: `tools/repair-counters.mjs` (Reconciliation dry-run clean).

### 2. Live Cloud Deployment Status
- [x] `[LIVE VERIFIED]` **Firebase Hosting**: Deployed live at `https://shopease-nepal-anmol-196e7.web.app` (Single Page Application routing verified).
- [x] `[LIVE VERIFIED]` **Firestore Security Rules**: Deployed live to project `shopease-nepal-anmol-196e7`.
- [x] `[LIVE VERIFIED]` **Admin Dashboard UI**: Live login (`admin` / `admin123`) and tab navigation (Overview, Products, Orders, Users, Audit Logs) verified in headless browser session.
- [x] `[LIVE VERIFIED]` **Interactive Nepal Delivery Map**: Province selection (Karnali, Bagmati, etc.) and logistics rate cards verified live on production.
- [ ] `[MANUALLY REQUIRED]` **Cloud Functions v2 Backend Live Release**: Requires project upgrade to Blaze (Pay-as-you-go) plan in Firebase Console to enable Cloud Build API (`https://console.firebase.google.com/project/shopease-nepal-anmol-196e7/usage/details`).
- [ ] `[MANUALLY REQUIRED]` **Cloud Storage Bucket Initialization**: Requires 1-click 'Get Started' bucket provisioning in Firebase Console (`https://console.firebase.google.com/project/shopease-nepal-anmol-196e7/storage`).

### 3. Security, Authority & Abuse Protection
- [x] `[AUTOMATED VERIFIED]` **Zero-Trust Token Auth**: Firebase ID token verification middleware active.
- [x] `[AUTOMATED VERIFIED]` **Server-Side RBAC**: Explicit Viewer / Editor / Admin permission hierarchy.
- [x] `[AUTOMATED VERIFIED]` **IDOR Protection**: Cross-user mutation and deletion blocked with HTTP 403.
- [x] `[AUTOMATED VERIFIED]` **Input Attack Validation**: Zod schemas rejecting malformed types, negative quantities, and injection vectors with HTTP 400.
- [x] `[AUTOMATED VERIFIED]` **Rate Limiting**: Sliding window limiters (120 req/min standard, 30 req/min strict mutations) returning HTTP 429 upon threshold breach.
- [x] `[AUTOMATED VERIFIED]` **CORS Whitelist**: Explicit origins (`web.app`, `firebaseapp.com`, `anmol-chhetri.github.io`, localhost) enforced.
- [x] `[AUTOMATED VERIFIED]` **Observability**: `X-Request-ID` header tracing and structured logging active.
- [x] `[AUTOMATED VERIFIED]` **Admin Audit Trail**: Privileged actions logged to `auditLogs` with actor, timestamp, and action metadata.
- [x] `[AUTOMATED VERIFIED]` **Secret Sanitation**: `.env` ignored; zero private keys or server credentials shipped in frontend bundle.

