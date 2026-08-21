#!/usr/bin/env node

/**
 * ShopEase Nepal — Production Operational Verification Runner
 * 
 * Executes a comprehensive, safe, read-only verification suite
 * to certify the system for live production readiness.
 * 
 * Usage:
 *   node tools/verify_production.mjs
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

console.log("===================================================================");
console.log(" 🚀 ShopEase Nepal — Production Operational Verification Suite");
console.log(" Mode: READ-ONLY AUDIT & INTEGRITY ASSURANCE");
console.log("===================================================================\n");

const steps = [
  {
    name: "Frontend Code Quality & Lint (ESLint)",
    command: "npm run lint",
    cwd: ROOT_DIR,
  },
  {
    name: "Frontend Production Bundle Compilation (Vite)",
    command: "npm run build",
    cwd: ROOT_DIR,
  },
  {
    name: "Backend Security, RBAC & Commerce Integrity Tests (Vitest)",
    command: "npm test",
    cwd: path.join(ROOT_DIR, "functions"),
  },
  {
    name: "Zero-Unknown-Image & Legacy CDN Forensics",
    command: "node tools/image_truth_audit.mjs",
    cwd: ROOT_DIR,
  },
  {
    name: "Data Truth & Zero-Mock Static Analysis",
    command: "node tools/data_truth_audit.mjs",
    cwd: ROOT_DIR,
  },
  {
    name: "Static Asset & Security Rules Integrity Audit",
    command: "node tools/audit_and_repair.mjs --dry-run",
    cwd: ROOT_DIR,
  },
  {
    name: "Firebase Image & Storage Provenance Audit",
    command: "node tools/firebase-image-audit.mjs --dry-run",
    cwd: ROOT_DIR,
  },
  {
    name: "Subcollection Counter Reconciliation Audit",
    command: "node tools/repair-counters.mjs --dry-run",
    cwd: ROOT_DIR,
  },
  {
    name: "Production Importer Dry-Run Validation",
    command: "node tools/import_real_products.mjs --dry-run",
    cwd: ROOT_DIR,
  },
];

let allPassed = true;
const results = [];

for (let i = 0; i < steps.length; i++) {
  const step = steps[i];
  console.log(`[Step ${i + 1}/${steps.length}] Running: ${step.name}...`);
  const startTime = Date.now();
  try {
    const output = execSync(step.command, {
      cwd: step.cwd,
      stdio: "pipe",
      encoding: "utf8",
    });
    const duration = Date.now() - startTime;
    console.log(`   ✓ PASS (${duration}ms)\n`);
    results.push({ name: step.name, status: "PASS", duration, output });
  } catch (err) {
    const duration = Date.now() - startTime;
    console.error(`   ❌ FAILED (${duration}ms):`);
    console.error(err.stderr || err.stdout || err.message);
    console.log();
    results.push({ name: step.name, status: "FAIL", duration, error: err.message });
    allPassed = false;
  }
}

console.log("===================================================================");
console.log(" 📊 Verification Summary");
console.log("===================================================================");
results.forEach((r, idx) => {
  console.log(`  ${idx + 1}. [${r.status}] ${r.name} (${r.duration}ms)`);
});
console.log("===================================================================\n");

if (allPassed) {
  console.log("🎉 ALL PRODUCTION OPERATIONAL VERIFICATION CHECKS PASSED!");
  process.exit(0);
} else {
  console.error("❌ PRODUCTION VERIFICATION FAILED. Review errors above.");
  process.exit(1);
}
