# ShopEase Nepal — Data Provenance & Truth Audit Report

**Audit Timestamp**: 2026-08-21T15:55:37.176Z  
**Execution Mode**: DRY_RUN  
**Firebase Project**: `shopease-nepal-anmol-196e7`  

---

## 1. Provenance Architecture Map

| UI Metric / Data Surface | Production Source | Query / Pipeline | Empty / Fallback Policy |
| :--- | :--- | :--- | :--- |
| **Admin Total Revenue** | Firestore `orders` collection | Sum of valid orders (`status !== 'Cancelled'`) | Displays **Rs. 0** (No fake numbers) |
| **Admin Total Orders** | Firestore `orders` collection | Count of `orders` documents | Displays **0** (Honest empty state) |
| **Admin Total Products** | Firestore `products` collection | Count of `products` documents | Displays **0** (Honest empty state) |
| **Admin Total Users** | Firestore `users` collection | Count of `users` documents | Displays real count (`registeredUsers.length`) |
| **Revenue Over Time Chart** | Firestore `orders` collection | Grouped by day of week from `order.date` | All zeros if no orders |
| **Order Status Pie Chart** | Firestore `orders` collection | Grouped by status string | Real breakdown / empty dataset |
| **Customer Reviews** | Firestore `reviews` collection | `where('productId', '==', id)` | Honest empty state ("No reviews yet") |
| **Product Ratings** | Firestore `reviews` collection | Average of real submitted ratings | Displays **0.0** / "Handcrafted Local Item" |
| **Store Coupons** | Firestore `coupons` collection | `api.getCoupons()` | Displays empty active coupon list |
| **Contact Messages** | Firestore `messages` collection | `api.getMessages()` | Displays empty messages list |
| **Audit Logs** | Firestore `auditLogs` collection | `api.getAuditLogs(50)` | Displays immutable security logs |

---

## 2. Classification Summary

| Classification | Count | Description |
| :--- | :--- | :--- |
| **REAL + CURRENT** | 2 | Live production users, verified static assets, and authenticated uploads |
| **REAL + LEGACY** | 0 | Historical verified assets requiring canonical resolver |
| **MOCK / DEMO** | 0 | Non-production mock objects (Purged / Guarded) |
| **TEST DATA** | 0 | Pre-deployment seed fixtures (Separated from live metrics) |
| **UNKNOWN** | 0 | Unclassified objects |

---

## 3. Rollback & Backup

- **Pre-Migration Backup File**: `C:\Users\Anupam Baral\Desktop\React-Collage-B\docs\backups\reconciliation_backup_1787327738622.json`
- **Rollback Tooling**: `node tools/restore_firestore_backup.mjs --file <path> --apply`
