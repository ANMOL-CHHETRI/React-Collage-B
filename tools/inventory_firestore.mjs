import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

// 1. Read .env file
const envPath = path.join(ROOT_DIR, ".env");
const envVars = {};
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const k = trimmed.slice(0, idx).trim();
        const v = trimmed.slice(idx + 1).trim();
        envVars[k] = v;
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

console.log("Connecting to Firestore with Project ID:", firebaseConfig.projectId);

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

const collectionsToInspect = [
  "products",
  "orders",
  "users",
  "categories",
  "testimonials",
  "coupons",
  "messages",
  "sellerApplications",
  "reportedAvatars",
  "auditLogs",
  "collages",
  "projects",
];

async function runInventory() {
  const inventory = {
    timestamp: new Date().toISOString(),
    projectId: firebaseConfig.projectId,
    counts: {},
    collections: {},
  };

  for (const colName of collectionsToInspect) {
    try {
      const snap = await getDocs(collection(db, colName));
      inventory.counts[colName] = snap.size;
      inventory.collections[colName] = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      console.log(`- Collection [${colName}]: ${snap.size} documents found.`);
    } catch (err) {
      console.warn(`! Failed to fetch collection [${colName}]:`, err.message);
      inventory.counts[colName] = "ERROR: " + err.message;
    }
  }

  // Backup output
  const backupDir = path.join(ROOT_DIR, "docs", "backups");
  fs.mkdirSync(backupDir, { recursive: true });
  const backupFile = path.join(backupDir, `firestore_backup_${Date.now()}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(inventory, null, 2), "utf8");
  console.log(`\n✅ Full database backup saved to: ${backupFile}`);

  // Summary output
  console.log("\n--- INVENTORY SUMMARY ---");
  console.table(inventory.counts);
}

runInventory()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
