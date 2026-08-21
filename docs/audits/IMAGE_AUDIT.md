# Photo & Image Consistency Audit Report

**Project**: React-Collage-B  
**Date**: August 2026  
**Auditor**: Antigravity Full-Stack Maintainer  
**Status**: AUDITED & REPAIRED  

---

## 1. Executive Summary

An in-depth image pipeline audit was performed to resolve discrepancies where historical or local photos were visible in some sections of the website but broken or missing in others.

The investigation uncovered three primary root causes:
1. **Filename Typo in Static Assets**: `public/pashima_closeup.png` (missing 'n') vs `/pashmina_closeup.png` in catalog seed data.
2. **Scattered, Incompatible Image Renderers**: 6 different components declared local, isolated `ImageWithSkeleton` functions with differing fallback URLs and varying attribute handling.
3. **Field Inconsistencies Across Data Providers**: Disparate property naming across Firestore documents, Google OAuth tokens, and local seed items (`image`, `images[]`, `imageUrl`, `photoURL`, `avatar`, `coverImageUrl`, `downloadUrl`, `storagePath`).

All issues have been resolved by introducing a single canonical resolution helper (`src/utils/imageUrl.js`) and a shared `ImageWithSkeleton` component.

---

## 2. Issues & Root Causes Matrix

| Issue ID | Severity | Component / Area | Root Cause | Fix Applied | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **IMG-001** | **P1 High** | Static Assets (`public/`) | `productsData.js` referenced `/pashmina_closeup.png`, but static file was named `pashima_closeup.png`. | Mirrored asset in `public/` and implemented alias typo map in `imageUrl.js`. | **RESOLVED** |
| **IMG-002** | **P1 High** | Product Detail & Catalog | Inconsistent field lookup (`product.image` vs `product.images[0]` vs `product.imageUrl`). | Created canonical `resolveImageUrl()` supporting all property shapes. | **RESOLVED** |
| **IMG-003** | **P2 Medium** | User & Admin Avatars | Google Sign-in returns `photoURL`, while Firestore uses `avatar`. Components only read one field. | `resolveImageUrl()` and `AuthContext` now reconcile both `photoURL` and `avatar`. | **RESOLVED** |
| **IMG-004** | **P2 Medium** | Local `ImageWithSkeleton` Duplication | 6 components had duplicated implementations with differing Pinterest fallbacks. | Replaced all local copies with centralized `<ImageWithSkeleton />`. | **RESOLVED** |
| **IMG-005** | **P3 Low** | Image Cache Flash | Re-renders caused brief pulse animation even when images were cached. | Added `imgRef.current.complete` cache detection in `ImageWithSkeleton.jsx`. | **RESOLVED** |

---

## 3. Architecture & Resolution Strategy

### 3.1 Canonical URL Resolution (`src/utils/imageUrl.js`)
`resolveImageUrl(source, fallbackType)` processes incoming media references deterministically:
1. **Arrays**: Resolves the first item (`source[0]`).
2. **Entity Objects**: Inspects in precedence order:
   `downloadUrl` → `downloadURL` → `imageUrl` → `imageURL` → `image` → `photoURL` → `coverImageUrl` → `avatar` → `images[0]` → `url` → `src`.
3. **Strings**:
   - Corrects known asset typos via `ASSET_TYPO_MAP`.
   - Preserves `data:image/` base64 data URIs and `blob:` URLs.
   - Preserves `http://` and `https://` URLs.
   - Normalizes local relative paths to start with `/`.
4. **Fallbacks**: Returns type-specific high-resolution fallbacks for `"product"`, `"avatar"`, and `"category"`.

### 3.2 Unified Image Component (`src/components/ImageWithSkeleton.jsx`)
- Built-in skeleton pulse while loading.
- Instant cache detection using `HTMLImageElement.complete` to avoid flickering.
- Standardized `referrerPolicy="no-referrer"` preventing hotlink blocking.
- Clean opacity cross-fade upon load.

---

## 4. Verification Evidence

1. **Automated Diagnostic Tool**:
   Ran `node tools/audit_and_repair.mjs --dry-run` — all 23 asset, catalog, security, and manifest checks passed with 0 errors.
2. **Component Integration**:
   - `ProductCard.jsx`
   - `ProductDetailPage.jsx`
   - `HomePage.jsx`
   - `CartPage.jsx`
   - `CartDrawer.jsx`
   - `AdminDashboard.jsx`
   - `UserDashboard.jsx`
   - `ContactSuccessModal.jsx`
   - `Navbar.jsx`
   All components successfully standardized on the unified image pipeline.
