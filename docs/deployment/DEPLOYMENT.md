# Production Deployment Guide

**Project**: React-Collage-B  
**Target Environment**: Firebase Hosting & Cloud Functions v2 (Node 22)  
**Date**: August 2026  

---

## 1. Prerequisites & Environment Setup

Before initiating a production release:
1. Ensure Firebase CLI is installed:
   ```bash
   npx firebase-tools --version
   ```
2. Authenticate with production Firebase account:
   ```bash
   npx firebase login
   ```
3. Set the active Firebase project:
   ```bash
   npx firebase use shopease-nepal-anmol-196e7
   ```

---

## 2. Pre-Deployment Validation Commands

Always run the full verification pipeline locally before deploying:

```bash
# 1. Frontend Lint & Production Bundle Build
npm run lint
npm run build

# 2. Backend TypeScript Compilation & Test Suite
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

### Step A: Deploy Security Rules & Indexes
Deploy Firestore and Storage security rules first to guarantee security constraints are active:
```bash
npx firebase deploy --only firestore:rules,firestore:indexes
npx firebase deploy --only storage
```

### Step B: Deploy Cloud Functions v2 Backend
Deploy the TypeScript Express API:
```bash
npx firebase deploy --only functions
```

### Step C: Deploy Frontend Web Application
Deploy the optimized Vite distribution build:
```bash
npx firebase deploy --only hosting
```

### Or Full Safe Deployment:
```bash
npx firebase deploy
```

---

## 4. Post-Deployment Verification Checklist

1. Verify backend health endpoint:
   ```bash
   curl -I https://<region>-<project-id>.cloudfunctions.net/api/health
   ```
2. Verify Admin Panel login and routing:
   Open `/admin-login` and ensure session initialization completes.
3. Verify Image CDN delivery and lazy-loading across catalog pages.
