# API Contract Audit & Direct Client Write Analysis

**Project**: React-Collage-B  
**Date**: August 2026  
**Auditor**: Antigravity Full-Stack Maintainer  
**Status**: AUDITED & CLASSIFIED  

---

## 1. Executive Summary

This audit compares client-side API calls in `src/utils/api.js` against Cloud Functions v2 backend endpoints and direct Firestore queries. All client operations are cataloged and classified to ensure zero security bypasses.

---

## 2. API Endpoints & Route Mapping

| Client Method (`api.js`) | HTTP / SDK Mechanism | Backend / Firestore Target | Auth Level | Role Required | Contract Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `getCollages()` | `GET /api/v1/collages` | Express `collageRouter` | Optional | Public / Any | **VERIFIED** |
| `getCollage(id)` | `GET /api/v1/collages/:id` | Express `collageRouter` | Optional | Public / Any | **VERIFIED** |
| `createCollage(data)` | `POST /api/v1/collages` | Express `collageRouter` | Bearer Token | `editor`, `admin` | **VERIFIED** |
| `updateCollage(id, data)` | `PATCH /api/v1/collages/:id`| Express `collageRouter` | Bearer Token | Owner / `admin` | **VERIFIED** |
| `deleteCollage(id)` | `DELETE /api/v1/collages/:id`| Express `collageRouter` | Bearer Token | Owner / `admin` | **VERIFIED** |
| `getCollageImages(id)` | `GET /api/v1/collages/:id/images`| Express `imageRouter` | Optional | Public / Any | **VERIFIED** |
| `addCollageImage(id, data)` | `POST /api/v1/collages/:id/images`| Express `imageRouter` | Bearer Token | Owner / `admin` | **VERIFIED** |
| `getComments(id)` | `GET /api/v1/collages/:id/comments`| Express `commentRouter`| Optional | Public / Any | **VERIFIED** |
| `addComment(id, data)` | `POST /api/v1/collages/:id/comments`| Express `commentRouter`| Bearer Token | `viewer`, `editor`, `admin` | **VERIFIED** |
| `deleteComment(id, cId)` | `DELETE /api/v1/collages/:id/comments/:cId`| Express `commentRouter`| Bearer Token | Author / `admin` | **VERIFIED** |
| `getReactions(id)` | `GET /api/v1/collages/:id/reactions`| Express `reactionRouter`| Optional | Public / Any | **VERIFIED** |
| `toggleReaction(id, data)` | `POST /api/v1/collages/:id/reactions`| Express `reactionRouter`| Bearer Token | `viewer`, `editor`, `admin` | **VERIFIED** |
| `getProjects()` | `GET /api/v1/projects` | Express `projectRouter` | Optional | Public / Any | **VERIFIED** |
| `getProject(id)` | `GET /api/v1/projects/:id` | Express `projectRouter` | Optional | Public / Any | **VERIFIED** |
| `createProject(data)` | `POST /api/v1/projects` | Express `projectRouter` | Bearer Token | `editor`, `admin` | **VERIFIED** |

---

## 3. Direct Firestore Operations Classification

| Operation | Target Collection | Mutation Type | Security Classification | Rule Protection (`firestore.rules`) |
| :--- | :--- | :--- | :--- | :--- |
| `getProducts()` | `products` | `getDocs` | **READ** | `allow read: if true;` |
| `createProduct()` | `products` | `addDoc` | **ADMIN WRITE** | `allow create: if isAdmin();` |
| `updateProduct()` | `products` | `updateDoc` | **ADMIN WRITE** | `allow update: if isAdmin();` |
| `deleteProduct()` | `products` | `deleteDoc` | **ADMIN WRITE** | `allow delete: if isAdmin();` |
| `getOrders()` | `orders` | `getDocs` | **READ** | `allow read: if isAuthenticated() ...` |
| `createOrder()` | `orders` | `addDoc` | **USER-OWNED WRITE** | `allow create: if isAuthenticated();` |
| `updateOrderStatus()` | `orders` | `updateDoc` | **ADMIN WRITE** | `allow update: if isAdmin();` |
| `getUsers()` | `users` | `getDocs` | **READ** | `allow read: if true;` |
| `register()` | `users` | `setDoc` | **PUBLIC WRITE** | `allow create: if true;` |
| `updateProfile()` | `users` | `updateDoc` | **USER-OWNED WRITE** | `allow update: if isOwner() && noEscalation` |
| `updateUserViolations()` | `users` | `updateDoc` | **ADMIN WRITE** | `allow update: if isAdmin();` |
| `toggleUserBan()` | `users` | `updateDoc` | **ADMIN WRITE** | `allow update: if isAdmin();` |
| `promoteToSubAdmin()` | `users` | `updateDoc` | **ADMIN WRITE** | `allow update: if isAdmin();` |
| `getCoupons()` | `coupons` | `getDocs` | **READ** | `allow read: if isAuthenticated();` |
| `createCoupon()` | `coupons` | `addDoc` | **ADMIN WRITE** | `allow write: if isAdmin();` |
| `deleteCoupon()` | `coupons` | `deleteDoc` | **ADMIN WRITE** | `allow write: if isAdmin();` |
| `getMessages()` | `messages` | `getDocs` | **READ** | `allow read: if isAdmin();` |
| `sendMessage()` | `messages` | `addDoc` | **PUBLIC WRITE** | `allow create: if true;` |
| `deleteMessage()` | `messages` | `deleteDoc` | **ADMIN WRITE** | `allow delete: if isAdmin();` |

---

## 4. Contract Conformance Findings
- **No Orphaned Client Endpoints**: Every endpoint invoked by `api.js` matches a live Cloud Functions route or direct Firestore collection rule.
- **Strict Role Separation**: Privilege escalation is prevented both at the backend Express middleware layer and at the Firestore security rules layer.
