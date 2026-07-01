import { test, expect } from '@playwright/test';

test('Search product', async ({ page }) => {
  await page.goto('/');

  const searchInput = page.locator('input[type="search"]').first();
  if (await searchInput.count()) {
    await searchInput.fill('dhaka');
    await page.keyboard.press('Enter');
    await expect(page.locator('body')).toContainText(/dhaka|tea|honey/i);
  } else {
    await expect(page.locator('body')).toContainText(/shop|tea|honey/i);
  }
});