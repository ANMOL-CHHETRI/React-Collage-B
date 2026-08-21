# Production Deployment Guide

**Project**: React-Collage-B / ShopEase Nepal  
**Target Environment**: Firebase Hosting & Cloud Functions v2 (Node 22)  
**Date**: August 2026  
**Status**: RELEASE CANDIDATE (HOSTING & RULES LIVE DEPLOYED)  

---

## 1. Prerequisites & Environment Setup

Before initiating a production release:
1. Ensure Firebase CLI is accessible:
   ```bash
   npx --yes firebase-tools --version
   ```
2. Verify authenticated Firebase account and project target:
   ```bash
   npx --yes firebase-tools projects:list
   npx --yes firebase-tools use shopease-nepal-anmol-196e7
   ```

---

## 2. Pre-Deployment Validation Commands

Always run the full verification pipeline locally before deploying:

```bash
# 1. Frontend Lint & Production Bundle Build
npm run lint
npm run build

# 2. Backend TypeScript Compilation & Test Suite (49 Tests)
cd functions
npm run build
npm run test
cd ..

# 3. Static Assets & Data Reference Validation
node tools/audit_and_repair.mjs --dry-run
node tools/firebase-image-audit.mjs --dry-run
node tools/repair-counters.mjs --dry-run
```

---

## 3. Step-by-Step Production Deployment

### Step A: Deploy Firestore Security Rules & Indexes `[LIVE DEPLOYED]`
Deploy Firestore security rules and compound query index definitions:
```bash
npx --yes firebase-tools deploy --only firestore:rules,firestore:indexes --non-interactive
```
* **Status**: `[LIVE VERIFIED]` Released to `cloud.firestore` on project `shopease-nepal-anmol-196e7`.

### Step B: Deploy Frontend Web Application `[LIVE DEPLOYED]`
Build and deploy the optimized Vite distribution to Firebase Hosting:
```bash
npm run build
npx --yes firebase-tools deploy --only hosting --non-interactive
```
* **Status**: `[LIVE VERIFIED]` Deployed to `https://shopease-nepal-anmol-196e7.web.app` and `https://shopease-nepal-anmol-196e7.firebaseapp.com`.

### Step C: Deploy Storage Rules `[MANUAL PREREQUISITE]`
```bash
npx --yes firebase-tools deploy --only storage --non-interactive
```
* **Prerequisite**: Storage bucket requires 1-click initialization in Firebase Console (`https://console.firebase.google.com/project/shopease-nepal-anmol-196e7/storage`).

### Step D: Deploy Cloud Functions v2 Backend `[MANUAL PREREQUISITE]`
Deploy the TypeScript Express API to Cloud Functions v2 (region `us-central1`):
```bash
npx --yes firebase-tools deploy --only functions --non-interactive
```
* **Prerequisite**: Requires Blaze (Pay-as-you-go) plan upgrade in Firebase Console to enable GCP Cloud Build API (`https://console.firebase.google.com/project/shopease-nepal-anmol-196e7/usage/details`).

---

## 4. Post-Deployment Verification

1. **Frontend Live Verification**:
   - Access `https://shopease-nepal-anmol-196e7.web.app`.
   - Verify Homepage, Product Details, Delivery Map, Cart, and Admin Dashboard.
2. **Backend API Verification**:
   - Verify local emulator & test suite coverage: `49/49 passing`.
   - Health endpoint: `GET /health` returns `{ "status": "healthy", "service": "React-Collage-B Express API" }` with `X-Request-ID` and `X-RateLimit-*` headers.

