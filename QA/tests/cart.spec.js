import { test, expect } from '@playwright/test';

test('Add product to cart', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /add to cart/i }).first().click();
  await page.goto('/cart');

  await expect(page.getByRole('heading', { name: /shopping cart/i })).toBeVisible();
});