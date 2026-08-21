#!/usr/bin/env node

/**
 * React-Collage-B / ShopEase Nepal
 * Firestore Point-In-Time Backup Restore Tool
 * 
 * Usage:
 *   node tools/restore_firestore_backup.mjs --file <path-to-json-backup> [--dry-run] [--apply]
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, doc, writeBatch } from "firebase/firestore";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const isApply = args.includes("--apply");
const isDryRun = !isApply;
const fileArgIndex = args.indexOf("--file");
const backupFilePath = fileArgIndex !== -1 ? args[fileArgIndex + 1] : null;

if (!backupFilePath || !fs.existsSync(backupFilePath)) {
  console.error("❌ Error: Valid backup file path required via --file <path>");
  console.log("Usage: node tools/restore_firestore_backup.mjs --file docs/backups/firestore_backup_xxx.json [--apply]");
  process.exit(1);
}

// Read .env
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
  projectId: envVars.VITE_FIREBASE_PROJECT_ID,
  storageBucket: envVars.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: envVars.VITE_FIREBASE_APP_ID,
  measurementId: envVars.VITE_FIREBASE_MEASUREMENT_ID,
};

console.log("===================================================================");
console.log(" 🔄 ShopEase Nepal — Firestore Backup Restore Tool");
console.log(` Mode: ${isDryRun ? "DRY-RUN (Simulating restore)" : "LIVE RESTORE (Writing to Firestore)"}`);
console.log(` Target Project: ${firebaseConfig.projectId}`);
console.log(` Source Backup: ${backupFilePath}`);
console.log("===================================================================\n");

const backupContent = JSON.parse(fs.readFileSync(backupFilePath, "utf8"));
const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

async function runRestore() {
  const collections = backupContent.collections || {};
  let totalRestored = 0;

  for (const [colName, docs] of Object.entries(collections)) {
    if (!Array.isArray(docs) || docs.length === 0) {
      console.log(`- Collection [${colName}]: 0 documents to restore.`);
      continue;
    }

    console.log(`- Collection [${colName}]: ${docs.length} documents identified.`);
    if (isApply) {
      const batch = writeBatch(db);
      for (const item of docs) {
        const { id, ...data } = item;
        const docRef = id ? doc(db, colName, id) : doc(collection(db, colName));
        batch.set(docRef, data, { merge: true });
        totalRestored++;
      }
      await batch.commit();
      console.log(`  ✓ Restored ${docs.length} documents to [${colName}].`);
    } else {
      totalRestored += docs.length;
    }
  }

  console.log(`\n✅ Restore ${isDryRun ? "simulation" : "execution"} completed: ${totalRestored} documents processed.`);
}

runRestore()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Restore failed:", err);
    process.exit(1);
  });
