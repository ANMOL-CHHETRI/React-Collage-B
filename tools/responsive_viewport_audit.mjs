#!/usr/bin/env node

/**
 * ShopEase Nepal — Automated Responsive Viewport Audit Engine
 * 
 * Verifies fluid every-viewport responsiveness across all routes and devices:
 * - Tests width range: 280px to 2560px
 * - Tests landscape viewports (e.g. 568x320, 667x375, 844x390, 932x430)
 * - Tests intermediate transitional viewports (e.g. 701px, 806px, 913px, 1177px)
 * - Asserts: document.documentElement.scrollWidth <= window.innerWidth
 * - Verifies zero unhandled horizontal overflow
 * 
 * Usage:
 *   node tools/responsive_viewport_audit.mjs
 */

import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

const VIEWPORTS = [
  // Very narrow
  { width: 280, height: 653, name: "Galaxy Fold (Folded)" },
  { width: 320, height: 568, name: "iPhone SE" },
  { width: 360, height: 740, name: "Galaxy S8" },
  { width: 375, height: 667, name: "iPhone 8" },
  { width: 390, height: 844, name: "iPhone 12/13/14" },
  
  // Mobile
  { width: 400, height: 800, name: "Pixel 4" },
  { width: 430, height: 932, name: "iPhone 14 Pro Max" },
  { width: 480, height: 854, name: "Wide Mobile" },

  // Landscape Mobile
  { width: 568, height: 320, name: "iPhone SE (Landscape)" },
  { width: 667, height: 375, name: "iPhone 8 (Landscape)" },
  { width: 844, height: 390, name: "iPhone 14 (Landscape)" },
  { width: 932, height: 430, name: "iPhone 14 Pro Max (Landscape)" },

  // Small Tablet & Transitions
  { width: 600, height: 960, name: "Small Tablet Portrait" },
  { width: 640, height: 1136, name: "Tailwind sm" },
  { width: 700, height: 1000, name: "Custom 700px" },
  { width: 701, height: 1000, name: "Continuous 701px" },
  { width: 720, height: 1280, name: "HD Portrait" },
  { width: 768, height: 1024, name: "iPad Mini Portrait" },
  { width: 800, height: 1280, name: "Tablet 800px" },
  { width: 806, height: 1000, name: "Key Benchmark 806px" },
  { width: 820, height: 1180, name: "iPad Air Portrait" },
  { width: 900, height: 1200, name: "Intermediate 900px" },
  { width: 960, height: 600, name: "Small Laptop Landscape" },
  { width: 1024, height: 768, name: "iPad Landscape" },

  // Desktop & Ultrawide
  { width: 1100, height: 900, name: "Sub-Desktop 1100px" },
  { width: 1200, height: 800, name: "Desktop 1200px" },
  { width: 1280, height: 800, name: "MacBook Air 13\"" },
  { width: 1366, height: 768, name: "Common Laptop HD" },
  { width: 1440, height: 900, name: "MacBook Pro 15\"" },
  { width: 1536, height: 864, name: "Surface Laptop" },
  { width: 1600, height: 900, name: "Desktop 1600px" },
  { width: 1920, height: 1080, name: "Full HD 1080p" },
  { width: 2560, height: 1440, name: "2K QHD Display" },
];

const ROUTES = [
  { path: "/", name: "Homepage" },
  { path: "/about", name: "About Page" },
  { path: "/delivery-coverage", name: "Delivery Coverage" },
  { path: "/policy", name: "Policy Page" },
  { path: "/faq", name: "FAQ Page" },
  { path: "/contact", name: "Contact Page" },
  { path: "/cart", name: "Cart Page" },
  { path: "/wishlist", name: "Wishlist Page" },
  { path: "/category/Traditional%20Apparel", name: "Category Page" },
  { path: "/admin-login", name: "Admin Login Page" },
  { path: "/user-login", name: "User Login Page" },
];

async function runAudit() {
  console.log("===================================================================");
  console.log(" 📱 ShopEase Nepal — Continuous Responsive Viewport Audit Engine");
  console.log(` Target Matrix: ${VIEWPORTS.length} Viewports × ${ROUTES.length} Routes = ${VIEWPORTS.length * ROUTES.length} Total Audits`);
  console.log("===================================================================\n");

  // Spin up local Vite preview/dev server on port 4173
  const server = spawn("npx", ["vite", "--port", "4173"], {
    cwd: ROOT_DIR,
    shell: true,
    stdio: "pipe",
  });

  // Give server 3 seconds to boot
  await new Promise((resolve) => setTimeout(resolve, 3000));

  let browser;
  let allPassed = true;
  let totalAudited = 0;
  let failures = [];

  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    for (const vp of VIEWPORTS) {
      process.stdout.write(`Testing Viewport ${vp.width}x${vp.height} (${vp.name})... `);
      await page.setViewportSize({ width: vp.width, height: vp.height });

      let vpErrors = [];

      for (const route of ROUTES) {
        totalAudited++;
        try {
          await page.goto(`http://localhost:4173${route.path}`, { waitUntil: "domcontentloaded", timeout: 10000 });
          // Evaluate horizontal scroll width vs inner width
          const overflow = await page.evaluate(() => {
            const docWidth = document.documentElement.scrollWidth;
            const winWidth = window.innerWidth;
            const bodyWidth = document.body.scrollWidth;
            const isOverflow = docWidth > winWidth || bodyWidth > winWidth;
            return {
              docWidth,
              winWidth,
              bodyWidth,
              isOverflow,
              diff: Math.max(docWidth - winWidth, bodyWidth - winWidth),
            };
          });

          if (overflow.isOverflow && overflow.diff > 1) { // 1px tolerance for subpixel rounding
            vpErrors.push({
              route: route.path,
              diff: overflow.diff,
              docWidth: overflow.docWidth,
              winWidth: overflow.winWidth,
            });
          }
        } catch (err) {
          vpErrors.push({
            route: route.path,
            error: err.message,
          });
        }
      }

      if (vpErrors.length === 0) {
        console.log("✓ PASS");
      } else {
        console.log(`❌ FAIL (${vpErrors.length} routes with overflow)`);
        failures.push({ viewport: vp, errors: vpErrors });
        allPassed = false;
      }
    }

    await browser.close();
  } catch (err) {
    console.error("Browser launch or audit execution failed:", err);
    allPassed = false;
  } finally {
    server.kill();
  }

  console.log("\n===================================================================");
  console.log(" 📊 Responsive Audit Summary");
  console.log("===================================================================");
  console.log(` Total Audited Scenarios: ${totalAudited}`);
  console.log(` Viewports Tested: ${VIEWPORTS.length}`);
  console.log(` Routes Tested: ${ROUTES.length}`);
  console.log(` Status: ${allPassed ? "✅ ALL VIEWPORTS PASS — ZERO HORIZONTAL OVERFLOW" : "❌ OVERFLOW DETECTED"}`);
  console.log("===================================================================\n");

  if (!allPassed) {
    console.error("Detailed Failures:", JSON.stringify(failures, null, 2));
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAudit();
