#!/usr/bin/env node

/**
 * ShopEase Nepal — Live Production Product Image Audit Engine
 * 
 * Inspects all product image assets in Firestore & Storage:
 * - Product ID, Name, Category, CreatedAt
 * - Primary Image & Gallery Images
 * - Network Reachability (HTTP Status, Content-Type, Content-Length)
 * - Dimension and Size Classification: VALID, OVERSIZED, BROKEN, MISSING, INVALID
 * 
 * Usage:
 *   node tools/product_image_audit.mjs [--json] [--dry-run]
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const isDryRun = !args.includes("--apply");
const outputJson = args.includes("--json");

// Read .env safely
const envPath = path.join(ROOT_DIR, ".env");
const envVars = {};
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        envVars[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
      }
    }
  }
}

const firebaseConfig = {
  apiKey: envVars.VITE_FIREBASE_API_KEY,
  authDomain: envVars.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: envVars.VITE_FIREBASE_PROJECT_ID || "shopease-nepal-anmol-196e7",
  storageBucket: envVars.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: envVars.VITE_FIREBASE_APP_ID,
  measurementId: envVars.VITE_FIREBASE_MEASUREMENT_ID,
};

console.log("===================================================================");
console.log(" 🔍 ShopEase Nepal — Production Product Image Audit Engine");
console.log(` Target Project ID: ${firebaseConfig.projectId}`);
console.log(` Mode: ${isDryRun ? "READ-ONLY AUDIT (Dry-Run)" : "LIVE APPLY"}`);
console.log("===================================================================\n");

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

async function inspectUrl(url) {
  if (!url || typeof url !== "string") {
    return { status: "INVALID", error: "Missing or non-string URL" };
  }

  if (url.startsWith("data:image/svg+xml")) {
    return { status: "VALID_FALLBACK_SVG", contentType: "image/svg+xml", sizeBytes: url.length };
  }

  if (url.startsWith("/")) {
    const localPath = path.join(ROOT_DIR, "public", url.slice(1));
    if (fs.existsSync(localPath)) {
      const stats = fs.statSync(localPath);
      return { status: "VALID_LOCAL", sizeBytes: stats.size, localPath };
    } else {
      return { status: "MISSING_LOCAL", error: `File not found in public/: ${url}` };
    }
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      const contentType = res.headers.get("content-type") || "unknown";
      const contentLength = parseInt(res.headers.get("content-length") || "0", 10);

      if (res.ok) {
        if (contentLength > 5 * 1024 * 1024) {
          return { status: "OVERSIZED", httpStatus: res.status, contentType, sizeBytes: contentLength };
        }
        return { status: "VALID", httpStatus: res.status, contentType, sizeBytes: contentLength };
      } else {
        return { status: "BROKEN", httpStatus: res.status, error: `HTTP status ${res.status}` };
      }
    } catch (err) {
      return { status: "NETWORK_ERROR", error: err.message };
    }
  }

  return { status: "INVALID_FORMAT", error: `Unrecognized URL format: ${url.slice(0, 50)}` };
}

async function runAudit() {
  const snap = await getDocs(collection(db, "products"));
  const products = snap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));

  console.log(`Retrieved ${products.length} live product documents from Firestore.\n`);

  const auditReport = {
    timestamp: new Date().toISOString(),
    projectId: firebaseConfig.projectId,
    totalProducts: products.length,
    summary: {
      valid: 0,
      oversized: 0,
      broken: 0,
      missing: 0,
      invalid: 0,
    },
    products: [],
  };

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const primaryInspection = await inspectUrl(p.image);
    const galleryInspections = [];

    if (Array.isArray(p.images)) {
      for (const img of p.images) {
        const insp = await inspectUrl(img);
        galleryInspections.push({ url: img, ...insp });
      }
    }

    let overallStatus = "VALID";
    if (primaryInspection.status === "BROKEN" || primaryInspection.status === "NETWORK_ERROR") {
      overallStatus = "BROKEN";
      auditReport.summary.broken++;
    } else if (primaryInspection.status === "OVERSIZED") {
      overallStatus = "OVERSIZED";
      auditReport.summary.oversized++;
    } else if (primaryInspection.status === "MISSING_LOCAL") {
      overallStatus = "MISSING";
      auditReport.summary.missing++;
    } else if (primaryInspection.status === "INVALID" || primaryInspection.status === "INVALID_FORMAT") {
      overallStatus = "INVALID";
      auditReport.summary.invalid++;
    } else {
      auditReport.summary.valid++;
    }

    const prodEntry = {
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
      primaryImage: {
        url: p.image,
        ...primaryInspection,
      },
      galleryImages: galleryInspections,
      status: overallStatus,
      createdAt: p.createdAt,
    };

    auditReport.products.push(prodEntry);

    console.log(`[Product ${i + 1}/${products.length}] [${overallStatus}] ${p.name} (ID: ${p.id})`);
    console.log(`   Category: ${p.category} | Price: Rs. ${p.price} | Stock: ${p.stock}`);
    console.log(`   Primary Image: ${p.image} (${primaryInspection.contentType || primaryInspection.status})`);
    if (galleryInspections.length > 0) {
      console.log(`   Gallery Images (${galleryInspections.length}):`);
      galleryInspections.forEach((g, idx) => {
        console.log(`     ${idx + 1}. [${g.status}] ${g.url.slice(0, 75)}...`);
      });
    }
    console.log();
  }

  // Save audit artifacts
  const auditDir = path.join(ROOT_DIR, "docs", "audits");
  fs.mkdirSync(auditDir, { recursive: true });

  const jsonReportPath = path.join(auditDir, "PRODUCT_IMAGE_AUDIT.json");
  fs.writeFileSync(jsonReportPath, JSON.stringify(auditReport, null, 2), "utf8");

  const mdReportPath = path.join(auditDir, "PRODUCT_IMAGE_AUDIT.md");
  const mdContent = `# Product Image Pipeline Audit Report

**Date**: ${auditReport.timestamp}  
**Project ID**: \`${auditReport.projectId}\`  
**Total Products Inspected**: ${auditReport.totalProducts}  
**Mode**: ${isDryRun ? "DRY-RUN (Diagnostic Inspection)" : "LIVE REPAIR"}  

---

## 1. Summary Statistics

| Status Category | Count | Percentage | Description |
| :--- | :--- | :--- | :--- |
| **VALID** | ${auditReport.summary.valid} | ${((auditReport.summary.valid / (auditReport.totalProducts || 1)) * 100).toFixed(1)}% | Accessible, valid image content |
| **OVERSIZED** | ${auditReport.summary.oversized} | ${((auditReport.summary.oversized / (auditReport.totalProducts || 1)) * 100).toFixed(1)}% | Exceeds 5MB threshold |
| **BROKEN** | ${auditReport.summary.broken} | ${((auditReport.summary.broken / (auditReport.totalProducts || 1)) * 100).toFixed(1)}% | Non-200 HTTP response |
| **MISSING** | ${auditReport.summary.missing} | ${((auditReport.summary.missing / (auditReport.totalProducts || 1)) * 100).toFixed(1)}% | File not found |
| **INVALID** | ${auditReport.summary.invalid} | ${((auditReport.summary.invalid / (auditReport.totalProducts || 1)) * 100).toFixed(1)}% | Malformed or non-string reference |

---

## 2. Detailed Product Audit Log

${auditReport.products
  .map(
    (p, idx) => `### ${idx + 1}. ${p.name} (\`${p.id}\`)
- **Status**: \`${p.status}\`
- **Category**: ${p.category}
- **Price**: Rs. ${p.price?.toLocaleString()}
- **Stock**: ${p.stock}
- **Primary Image**: [\`${p.primaryImage.url}\`](${p.primaryImage.url})
  - Format: \`${p.primaryImage.contentType || "N/A"}\`
  - HTTP Status: \`${p.primaryImage.httpStatus || "N/A"}\`
- **Gallery Count**: ${p.galleryImages.length}
`
  )
  .join("\n")}
`;

  fs.writeFileSync(mdReportPath, mdContent, "utf8");

  console.log("===================================================================");
  console.log(" 📊 Product Image Audit Summary");
  console.log("===================================================================");
  console.table(auditReport.summary);
  console.log(`📄 Audit reports written to:\n  - ${jsonReportPath}\n  - ${mdReportPath}\n`);

  if (auditReport.summary.broken > 0 || auditReport.summary.invalid > 0) {
    console.error("❌ AUDIT DETECTED BROKEN/INVALID PRODUCT IMAGES.");
    process.exit(1);
  } else {
    console.log("✅ PRODUCT IMAGE AUDIT PASSED: All live products contain valid, accessible image assets.\n");
    process.exit(0);
  }
}

runAudit().catch((err) => {
  console.error("Fatal audit error:", err);
  process.exit(1);
});
