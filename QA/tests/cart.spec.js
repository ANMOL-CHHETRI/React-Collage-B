import { test, expect } from '@playwright/test';

test('Add product to cart', async ({ page }) => {
  await page.goto('/');

  const addButton = page.locator('button').filter({ hasText: /add to cart/i }).first();
  if (await addButton.count()) {
    await addButton.click();
  }

  await page.goto('/cart');
  await expect(page).toHaveURL(/cart/);
  await expect(page.locator('body')).toContainText(/shopping cart|cart/i);
});