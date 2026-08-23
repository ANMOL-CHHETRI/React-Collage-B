import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard — Order Details Modal Verification', () => {

  test('Admin can view full customer, shipping, and item details for order ORD-306296', async ({ page }) => {
    // 1. Log in as admin
    await page.goto('/admin-login');
    await page.waitForTimeout(1000);

    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Wait for Admin Dashboard to load
    await page.waitForURL('**/admin/dashboard**', { timeout: 10000 });
    await page.waitForTimeout(1500);

    // 2. Click Orders sidebar item
    const ordersTab = page.locator('button:has-text("Orders"), a:has-text("Orders")').first();
    await ordersTab.click();
    await page.waitForTimeout(1500);

    // 3. Locate the order row for ORD-306296 and click "View details"
    const orderRow = page.locator('tr:has-text("ORD-306296")');
    await expect(orderRow).toBeVisible({ timeout: 10000 });

    const viewDetailsBtn = orderRow.locator('button:has-text("View details")');
    await viewDetailsBtn.click();
    await page.waitForTimeout(1000);

    // 4. Assert Order Details Modal is open
    const modal = page.locator('div[role="dialog"], .animate-fade-in > div');
    await expect(modal).toBeVisible();

    // 5. Verify Shipping Details: Recipient, Phone, Address
    const recipient = modal.locator('span:has-text("Lyra Nova")');
    await expect(recipient).toBeVisible();

    const phone = modal.locator('a[href*="9767606302"], span:has-text("9767606302")');
    await expect(phone).toBeVisible();

    const address = modal.locator('span:has-text("Sunwal")');
    await expect(address).toBeVisible();

    // 6. Verify Ordered Items
    const itemName = modal.locator('p:has-text("Dhaka-saree-Diamond-set")');
    await expect(itemName).toBeVisible();

    const itemImg = modal.locator('img[alt*="Dhaka-saree-Diamond-set"]');
    if (await itemImg.count() > 0) {
      const naturalWidth = await itemImg.evaluate(img => img.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
      const opacity = await itemImg.evaluate(img => window.getComputedStyle(img).opacity);
      expect(opacity).toBe('1');
    }

    // 7. Verify Total Amount
    const totalAmount = modal.locator('span:has-text("8,150"), span:has-text("8150")');
    await expect(totalAmount).toBeVisible();

    // 8. Close Modal
    const closeBtn = modal.locator('button:has-text("Close Details")');
    await closeBtn.click();
    await page.waitForTimeout(500);
    await expect(modal).not.toBeVisible();
  });

});
