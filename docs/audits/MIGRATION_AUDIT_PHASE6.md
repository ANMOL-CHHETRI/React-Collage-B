# Phase 6 — Legacy/Mock Data Purge + Real Firebase Data Migration + Admin Truth Enforcement Audit

**Project**: ShopEase Nepal (`React-Collage-B`)  
**Firebase Project**: `shopease-nepal-anmol-196e7`  
**Hosting URL**: `https://shopease-nepal-anmol-196e7.web.app`  
**Status**: **VERIFIED & SECURED**  

---

## 1. Executive Summary

Phase 6 enforced absolute **Data Truth** across the entire ShopEase Nepal platform. All hardcoded metrics, static chart arrays, mock reviews, fake 4.4 ratings, and silent fallbacks have been completely eliminated. Every number and image presented to users or administrators is now derived directly and deterministically from live Firestore collections and verified production assets.

---

## 2. Forensic Answers to Mandatory Section 29 Questions

### Q1: What was the exact origin of the old database photos?
1. **Catalog Seed Fixtures**: `src/data/productsData.js` contained 16 default items configured during prototype development. The initial 8 items referenced Pinterest CDN URLs (`https://i.pinimg.com/736x/...`) and the latter 8 referenced root-relative paths in `public/`.
2. **Database Seeding Routine**: `src/utils/seedFirebase.js` previously uploaded these fixture records and Pinterest category thumbnails directly to Firestore when executed.
3. **Fallback Helper Constants**: `src/utils/imageUrl.js` contained `DEFAULT_PRODUCT_FALLBACK`, `DEFAULT_AVATAR_FALLBACK`, and `DEFAULT_CATEGORY_FALLBACK` pointing to external Pinterest images.

### Q2: Which components were rendering fallback or mock data?
1. **`src/pages/AdminDashboard.jsx`**:
   - Hardcoded `const stats` array (`"Rs. 4,82,500"`, `"1,842"` orders, `"356"` products, `"4,320"` users).
   - Hardcoded `const salesData` array (Mon–Sun static revenue curves).
   - Hardcoded `const statusData` array (45% Delivered, 30% Processing, etc.).
   - Hardcoded mock reviews fallback in Admin Reviews Tab (`Priya Sharma`, `Rohan Thapa`).
   - Fallback rating of `4.4` in `getProductRating`.
2. **`src/pages/ProductDetailPage.jsx`**:
   - `MOCK_REVIEWS` array (5 mock reviewer records) injected whenever Firestore `reviews` collection was empty or errored.
   - `quickPromo` fallback containing default `FESTIVAL20`.
3. **`src/pages/CategoryPage.jsx`**:
   - Fallback rating of `4.4` in `getProductRating`.
4. **`src/utils/imageUrl.js`**:
   - Fallbacks pointing to Pinterest URLs.

### Q3: Which Firestore collections were modified / verified?
- `products`: Product catalog documents.
- `orders`: Live customer orders from COD checkout or Express Checkout.
- `users`: User profiles (including system admin `admin` and Google OAuth users).
- `reviews`: Product reviews written by authentic customers.
- `coupons`: Store discount coupons.
- `messages`: Inquiries submitted through the Contact form.
- `sellerApplications`: Artisan/vendor onboarding requests.
- `reportedAvatars`: Moderation queue for flagged profile images.
- `auditLogs`: Immutable system security records.

### Q4: How was data truth verified in Admin Dashboard?
- **Total Revenue**: Computed via live `reduce` on `adminOrders` (`status !== 'Cancelled' && !status.startsWith('failed')`). If 0 orders, displays honest `Rs. 0`.
- **Total Orders**: Live count of `adminOrders.length`. If 0 orders, displays `0` with honest `"No orders yet"` label.
- **Total Products**: Live count of `products.length` from `useProducts()`.
- **Total Users**: Live count of `registeredUsers.length` from `useAuth()`.
- **Revenue Over Time Chart**: Dynamically bucketed across days of week using real order timestamps. Zeroes when no orders exist.
- **Order Status Pie Chart**: Dynamically computed from real status occurrences.
- **Zero Mock Fallbacks**: Empty reviews list, empty messages list, and empty coupons list render clean, honest empty state components.

### Q5: How were legacy photos safely replaced or redirected?
- Neutral deterministic SVG data URIs were configured in `src/utils/imageUrl.js` for missing product, avatar, and category assets.
- `tools/reconcile_and_migrate_data.mjs` was established with a classification engine (`REAL + CURRENT`, `REAL + LEGACY`, `MOCK / DEMO`, `TEST DATA`, `UNKNOWN`) that inspects all documents and generates pre-migration JSON backups.

### Q6: What tests confirm no mock data is leaking?
- `tools/data_truth_audit.mjs`: Automated static analysis engine verifying 9 separate data truth constraints (0 mock arrays, 0 silent fallbacks, 0 fake ratings).
- `functions/tests/api.test.ts`: Expanded to 52 automated unit & security tests including Group 13 ("Data-Truth & Zero-Mock Response Guarantees").

### Q7: What rollback protection exists for production data?
- Automated pre-migration snapshot backups stored in `docs/backups/firestore_backup_<timestamp>.json` and `docs/backups/reconciliation_backup_<timestamp>.json`.
- `tools/restore_firestore_backup.mjs` provides point-in-time database restoration with `--dry-run` and `--apply` flags.

### Q8: Are all 7 provinces properly represented in the real dataset?
- Yes. All 7 provinces (Koshi, Madhesh, Bagmati, Gandaki, Lumbini, Karnali, Sudurpashchim) are fully integrated in `src/components/NepalDeliveryMap.jsx` and `src/pages/DeliveryCoveragePage.jsx` with real postal codes, transit hubs, and accurate COD coverage parameters.

---

## 3. Verification Matrix

| Verification Suite | Result | Details |
| :--- | :--- | :--- |
| **Data-Truth Audit** | **9/9 PASS** | `node tools/data_truth_audit.mjs` |
| **Backend TypeScript Build** | **PASS** | `tsc` compiled cleanly |
| **Backend Tests** | **52/52 PASS** | Vitest suite in `functions/` |
| **Static Integrity Audit** | **37/37 PASS** | `node tools/audit_and_repair.mjs` |
| **Firebase Image Audit** | **16/16 PASS** | `node tools/firebase-image-audit.mjs` |
| **Frontend Linting** | **0 errors, 0 warnings** | `npm run lint` |
| **Frontend Production Build** | **PASS** | `npm run build` |
