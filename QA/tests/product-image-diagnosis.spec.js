import { test, expect } from '@playwright/test';

test('Diagnose live product image rendering on Home and Product Detail', async ({ page }) => {
  const consoleLogs = [];
  const networkErrors = [];
  const imageRequests = [];

  page.on('console', (msg) => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', (err) => consoleLogs.push(`[PAGE ERROR] ${err.message}`));
  page.on('requestfailed', (req) => networkErrors.push(`FAILED: ${req.method()} ${req.url()} - ${req.failure()?.errorText}`));
  page.on('response', (res) => {
    if (res.url().includes('res.cloudinary.com') || res.url().includes('firebasestorage') || res.url().includes('.png') || res.url().includes('.jpg')) {
      imageRequests.push({ url: res.url(), status: res.status(), contentType: res.headers()['content-type'] });
    }
  });

  await page.goto('/');
  await page.waitForTimeout(2000);

  // Check product cards
  const productCards = await page.locator('article').all();
  console.log(`Found ${productCards.length} product card articles on HomePage.`);

  const cardImageDiagnostics = [];
  for (const card of productCards) {
    const title = await card.locator('h3').textContent();
    const imgEl = card.locator('img');
    const src = await imgEl.getAttribute('src');
    const naturalWidth = await imgEl.evaluate((img) => img.naturalWidth);
    const naturalHeight = await imgEl.evaluate((img) => img.naturalHeight);
    const offsetWidth = await imgEl.evaluate((img) => img.offsetWidth);
    const offsetHeight = await imgEl.evaluate((img) => img.offsetHeight);
    const opacity = await imgEl.evaluate((img) => window.getComputedStyle(img).opacity);
    cardImageDiagnostics.push({ title: title?.trim(), src, naturalWidth, naturalHeight, offsetWidth, offsetHeight, opacity });
  }

  console.log('=== CARD IMAGE DIAGNOSTICS ===');
  console.log(JSON.stringify(cardImageDiagnostics, null, 2));

  // Navigate to first product detail page
  await page.goto('/product/cTgWl22XauhA7zLnffIF');
  await page.waitForTimeout(2000);

  const detailImages = await page.locator('img').all();
  const detailDiagnostics = [];
  for (const img of detailImages) {
    const src = await img.getAttribute('src');
    const alt = await img.getAttribute('alt');
    const naturalWidth = await img.evaluate((i) => i.naturalWidth);
    const naturalHeight = await img.evaluate((i) => i.naturalHeight);
    const offsetWidth = await img.evaluate((i) => i.offsetWidth);
    const offsetHeight = await img.evaluate((i) => i.offsetHeight);
    const opacity = await img.evaluate((i) => window.getComputedStyle(i).opacity);
    detailDiagnostics.push({ alt, src, naturalWidth, naturalHeight, offsetWidth, offsetHeight, opacity });
  }

  console.log('=== DETAIL IMAGE DIAGNOSTICS ===');
  console.log(JSON.stringify(detailDiagnostics, null, 2));

  console.log('=== IMAGE NETWORK REQUESTS ===');
  console.log(JSON.stringify(imageRequests, null, 2));

  console.log('=== NETWORK ERRORS ===');
  console.log(JSON.stringify(networkErrors, null, 2));

  console.log('=== CONSOLE LOGS ===');
  console.log(JSON.stringify(consoleLogs, null, 2));
});
