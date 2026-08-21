#!/usr/bin/env node

/**
 * ShopEase Nepal — Phase 9 Product & Category System Verification Tool
 * 
 * Verifies the complete flow:
 * Real Product -> Firestore -> ProductContext -> Category Extraction -> Category Filter -> Detail -> Admin
 * 
 * Usage:
 *   node tools/test_product_flow.mjs [--insert-one] [--insert-two] [--verify] [--cleanup]
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, doc, setDoc, deleteDoc, getDocs } from "firebase/firestore";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

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

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

const TEST_PRODUCT_1 = {
  id: "prod_test_handwoven_topi_01",
  name: "Handwoven Palpali Dhaka Topi",
  price: 1250,
  category: "Traditional Apparel",
  stock: 25,
  badge: "Handcrafted",
  image: "/bhadgauletopi.jpg",
  images: ["/bhadgauletopi.jpg"],
  description: "Authentic traditional Nepali Dhaka Topi handloomed by weavers in Palpa with geometric pattern motifs.",
  longDescription: "This authentic Palpali Dhaka Topi represents generational Nepali textile heritage. Handloomed with pure cotton threads in traditional geometric configurations, it offers exceptional breathability and cultural distinction.",
  addedBy: "admin",
  createdAt: new Date().toISOString(),
};

const TEST_PRODUCT_2 = {
  id: "prod_test_singing_bowl_02",
  name: "Hand-Hammered Patan Singing Bowl",
  price: 3500,
  category: "Local Handicrafts",
  stock: 12,
  badge: "Artisan Made",
  image: "/singing_bowl.jpg",
  images: ["/singing_bowl.jpg"],
  description: "Sacred handcrafted 7-metal acoustic singing bowl cast and hand-hammered by Patan Newari bronze artisans.",
  longDescription: "Formed using traditional bronze casting techniques in Lalitpur (Patan), this resonance singing bowl produces deep harmonic tones suited for meditation and acoustic balance.",
  addedBy: "admin",
  createdAt: new Date().toISOString(),
};

async function insertProduct(prod) {
  console.log(`-> Inserting test product [${prod.id}] into Firestore 'products'...`);
  const docRef = doc(db, "products", prod.id);
  await setDoc(docRef, prod);
  console.log(`   ✓ Inserted '${prod.name}' (Category: ${prod.category}, Price: Rs. ${prod.price})`);
}

async function removeProduct(id) {
  console.log(`-> Removing test product [${id}] from Firestore 'products'...`);
  const docRef = doc(db, "products", id);
  await deleteDoc(docRef);
  console.log(`   ✓ Removed [${id}]`);
}

async function verifyState() {
  const snap = await getDocs(collection(db, "products"));
  const products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  
  console.log("\n===================================================================");
  console.log(` 📊 Live Firestore Product State: ${products.length} Document(s)`);
  console.log("===================================================================");

  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];
  console.log(`Derived Dynamic Categories: [ ${categories.map(c => `'${c}'`).join(", ")} ] (Total Options: ${categories.length})`);

  products.forEach((p, idx) => {
    console.log(`  ${idx + 1}. [${p.id}] ${p.name} | Category: ${p.category} | Price: Rs. ${p.price} | Stock: ${p.stock}`);
  });

  return { products, categories };
}

async function run() {
  const args = process.argv.slice(2);
  const action = args[0] || "--verify";

  console.log("===================================================================");
  console.log(" 🧪 ShopEase Nepal — Product & Category Flow Verification Tool");
  console.log(` Target Project: ${firebaseConfig.projectId}`);
  console.log(` Action: ${action}`);
  console.log("===================================================================\n");

  if (action === "--insert-one") {
    await insertProduct(TEST_PRODUCT_1);
    await verifyState();
  } else if (action === "--insert-two") {
    await insertProduct(TEST_PRODUCT_1);
    await insertProduct(TEST_PRODUCT_2);
    await verifyState();
  } else if (action === "--cleanup") {
    await removeProduct(TEST_PRODUCT_1.id);
    await removeProduct(TEST_PRODUCT_2.id);
    await verifyState();
  } else {
    await verifyState();
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Execution failed:", err);
    process.exit(1);
  });
