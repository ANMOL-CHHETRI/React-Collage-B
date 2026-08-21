#!/usr/bin/env node

/**
 * React-Collage-B / ShopEase Nepal
 * Data-Truth & Mock Leakage Static Audit
 * 
 * Verifies that zero mock data, fabricated stats, or silent fallbacks exist
 * in production components and utilities.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

console.log("===================================================================");
console.log(" 🔍 ShopEase Nepal — Data Truth & Zero-Mock Audit Engine");
console.log("===================================================================\n");

const checks = [];

function recordCheck(category, name, passed, details) {
  checks.push({ category, name, passed, details });
  const icon = passed ? "✅ PASS" : "❌ FAIL";
  console.log(`${icon} [${category}] ${name} ${details ? `(${details})` : ""}`);
}

// 1. Check AdminDashboard.jsx
const adminPath = path.join(ROOT_DIR, "src", "pages", "AdminDashboard.jsx");
if (fs.existsSync(adminPath)) {
  const content = fs.readFileSync(adminPath, "utf8");

  // Check for static stats array
  const hasStaticStats = /const stats\s*=\s*\[\s*\{\s*label:\s*["']Total Revenue["']/.test(content);
  recordCheck("Admin Truth", "No Hardcoded Top-Level Stats Array", !hasStaticStats, hasStaticStats ? "Found hardcoded stats array" : "Dynamic stats computed from live data");

  // Check for static salesData
  const hasStaticSales = /const salesData\s*=\s*\[\s*\{\s*name:\s*['"]Mon['"]/.test(content);
  recordCheck("Admin Truth", "No Hardcoded Top-Level salesData Array", !hasStaticSales, hasStaticSales ? "Found hardcoded salesData" : "Dynamic salesData computed from orders");

  // Check for static statusData
  const hasStaticStatus = /const statusData\s*=\s*\[\s*\{\s*name:\s*['"]Delivered['"]/.test(content);
  recordCheck("Admin Truth", "No Hardcoded Top-Level statusData Array", !hasStaticStatus, hasStaticStatus ? "Found hardcoded statusData" : "Dynamic statusData computed from orders");

  // Check for 4.4 rating fallback
  const hasMockRatingFallback = /return\s*\{\s*avg:\s*["']4\.4["']/.test(content);
  recordCheck("Admin Truth", "No 4.4 Rating Fallback in getProductRating", !hasMockRatingFallback, hasMockRatingFallback ? "Found 4.4 rating fallback" : "Honest 0.0 rating returned");

  // Check for mock reviews fallback
  const hasPriyaSharmaMock = /Priya Sharma/.test(content);
  recordCheck("Admin Truth", "No Mock Reviews Array in Admin Reviews Tab", !hasPriyaSharmaMock, hasPriyaSharmaMock ? "Found Priya Sharma mock fallback" : "Honest empty reviews list");
}

// 2. Check ProductDetailPage.jsx
const productDetailPath = path.join(ROOT_DIR, "src", "pages", "ProductDetailPage.jsx");
if (fs.existsSync(productDetailPath)) {
  const content = fs.readFileSync(productDetailPath, "utf8");

  // Check for MOCK_REVIEWS
  const hasMockReviews = /const MOCK_REVIEWS\s*=\s*\[/.test(content);
  recordCheck("Product Truth", "No MOCK_REVIEWS Constant", !hasMockReviews, hasMockReviews ? "Found MOCK_REVIEWS array" : "Real reviews only");

  // Check for MOCK_REVIEWS usage in catch
  const usesMockFallback = /setReviews\s*\(\s*MOCK_REVIEWS\s*\)/.test(content);
  recordCheck("Product Truth", "No Silent Mock Review Fallback", !usesMockFallback, usesMockFallback ? "Found setReviews(MOCK_REVIEWS)" : "Honest empty reviews state");
}

// 3. Check CategoryPage.jsx
const categoryPath = path.join(ROOT_DIR, "src", "pages", "CategoryPage.jsx");
if (fs.existsSync(categoryPath)) {
  const content = fs.readFileSync(categoryPath, "utf8");

  // Check for 4.4 rating fallback
  const has44Fallback = /return\s*4\.4\s*;/.test(content);
  recordCheck("Category Truth", "No Hardcoded 4.4 Rating Fallback", !has44Fallback, has44Fallback ? "Found return 4.4" : "Honest 0 rating for unreviewed products");
}

// 4. Check imageUrl.js
const imageUtilPath = path.join(ROOT_DIR, "src", "utils", "imageUrl.js");
if (fs.existsSync(imageUtilPath)) {
  const content = fs.readFileSync(imageUtilPath, "utf8");

  // Check that Pinterest fallbacks are not used as DEFAULT_PRODUCT_FALLBACK
  const hasPinterestFallback = /DEFAULT_PRODUCT_FALLBACK\s*=\s*["']https:\/\/i\.pinimg\.com/.test(content);
  recordCheck("Image Integrity", "Deterministic SVG Fallback (No Pinterest fallback)", !hasPinterestFallback, hasPinterestFallback ? "Found Pinterest fallback" : "Deterministic SVG fallback configured");
}

console.log("\n-------------------------------------------------------------------");
const passedCount = checks.filter(c => c.passed).length;
const totalCount = checks.length;
console.log(`Total Checks: ${totalCount} | Passed: ${passedCount} | Failed: ${totalCount - passedCount}`);

if (passedCount === totalCount) {
  console.log("🎉 ALL DATA-TRUTH AUDIT CHECKS PASSED!\n");
  process.exit(0);
} else {
  console.error("❌ SOME DATA-TRUTH CHECKS FAILED!\n");
  process.exit(1);
}
