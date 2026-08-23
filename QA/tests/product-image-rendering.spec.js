import { test, expect } from '@playwright/test';

const BREAKPOINTS = [
  { width: 320, height: 568, name: 'Mobile XS (320px)' },
  { width: 375, height: 667, name: 'Mobile Small (375px)' },
  { width: 430, height: 932, name: 'Mobile Large (430px)' },
  { width: 600, height: 800, name: 'Phablet (600px)' },
  { width: 700, height: 900, name: 'Small Tablet (700px)' },
  { width: 768, height: 1024, name: 'Tablet (768px)' },
  { width: 806, height: 1024, name: 'Custom Breakpoint (806px)' },
  { width: 1024, height: 768, name: 'Desktop Small (1024px)' },
  { width: 1280, height: 800, name: 'Desktop Medium (1280px)' },
  { width: 1440, height: 900, name: 'Desktop Large (1440px)' },
  { width: 1920, height: 1080, name: 'Ultra-Wide (1920px)' },
];

test.describe('ShopEase Nepal — Product Image Rendering & Responsive Suite', () => {

  test('HomePage: Product cards and featured carousel images render correctly with full opacity', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);

    // 1. Featured Spotlight Image
    const featuredImg = page.locator('section').first().locator('img').first();
    if (await featuredImg.count() > 0) {
      const src = await featuredImg.getAttribute('src');
      expect(src).toBeTruthy();
      const naturalWidth = await featuredImg.evaluate((img) => img.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
      const opacity = await featuredImg.evaluate((img) => window.getComputedStyle(img).opacity);
      expect(opacity).toBe('1');
    }

    // 2. Product Catalog Cards
    const cardImages = page.locator('article img');
    const count = await cardImages.count();
    expect(count).toBeGreaterThanOrEqual(2);

    for (let i = 0; i < count; i++) {
      const img = cardImages.nth(i);
      const src = await img.getAttribute('src');
      expect(src).toBeTruthy();
      const naturalWidth = await img.evaluate((el) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
      const opacity = await img.evaluate((el) => window.getComputedStyle(el).opacity);
      expect(opacity).toBe('1');
      const offsetWidth = await img.evaluate((el) => el.offsetWidth);
      const offsetHeight = await img.evaluate((el) => el.offsetHeight);
      expect(offsetWidth).toBeGreaterThan(50);
      expect(offsetHeight).toBeGreaterThan(50);
    }
  });

  test('ProductDetailPage: Primary image and gallery thumbnails render with full opacity & zoom', async ({ page }) => {
    await page.goto('/product/cTgWl22XauhA7zLnffIF');
    await page.waitForTimeout(1500);

    // Main detail image
    const mainImg = page.locator('.aspect-square img').first();
    await expect(mainImg).toBeVisible();
    const naturalWidth = await mainImg.evaluate((el) => el.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
    const opacity = await mainImg.evaluate((el) => window.getComputedStyle(el).opacity);
    expect(opacity).toBe('1');

    // Thumbnail gallery buttons if present
    const thumbnails = page.locator('button img[alt*="thumbnail"], button img[alt*="Dhaka"]');
    const thumbCount = await thumbnails.count();
    if (thumbCount > 1) {
      for (let i = 0; i < thumbCount; i++) {
        const thumb = thumbnails.nth(i);
        const thumbOpacity = await thumb.evaluate((el) => window.getComputedStyle(el).opacity);
        expect(thumbOpacity).toBe('1');
      }

      // Click second thumbnail
      await thumbnails.nth(1).click();
      await page.waitForTimeout(500);
      const updatedOpacity = await mainImg.evaluate((el) => window.getComputedStyle(el).opacity);
      expect(updatedOpacity).toBe('1');
    }
  });

  test('CartPage: Added product items display thumbnail image with clean opacity', async ({ page }) => {
    await page.goto('/product/cTgWl22XauhA7zLnffIF');
    await page.waitForTimeout(1000);

    const addToCartBtn = page.locator('button:has-text("Add to Cart")').first();
    if (await addToCartBtn.count() > 0) {
      await addToCartBtn.click();
      await page.waitForTimeout(500);
    }

    await page.goto('/cart');
    await page.waitForTimeout(1500);

    const cartImgs = page.locator('.aspect-square img, .w-16 img, .w-20 img');
    const count = await cartImgs.count();
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const img = cartImgs.nth(i);
        const naturalWidth = await img.evaluate((el) => el.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
        const opacity = await img.evaluate((el) => window.getComputedStyle(el).opacity);
        expect(opacity).toBe('1');
      }
    }
  });

  // Responsive Breakpoint Suite
  for (const bp of BREAKPOINTS) {
    test(`Responsive Layout (${bp.name}): Zero horizontal overflow & valid aspect ratios`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto('/');
      await page.waitForTimeout(1000);

      const overflowInfo = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const overflowing = [];
        if (docWidth > winWidth + 2) {
          const all = document.querySelectorAll('*');
          for (const el of all) {
            const r = el.getBoundingClientRect();
            if (r.right > winWidth + 2) {
              overflowing.push({ tag: el.tagName, className: String(el.className).slice(0, 50), right: r.right, width: r.width });
            }
          }
        }
        return { docWidth, winWidth, overflowing: overflowing.slice(0, 5) };
      });

      if (overflowInfo.docWidth > overflowInfo.winWidth + 2) {
        console.log(`Overflow at ${bp.name}:`, overflowInfo);
      }
      expect(overflowInfo.docWidth).toBeLessThanOrEqual(overflowInfo.winWidth + 2);

      // Check card images rendered without breakage
      const cardImages = page.locator('article img');
      const count = await cardImages.count();
      for (let i = 0; i < count; i++) {
        const img = cardImages.nth(i);
        const width = await img.evaluate((el) => el.offsetWidth);
        const height = await img.evaluate((el) => el.offsetHeight);
        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
      }
    });
  }

});
