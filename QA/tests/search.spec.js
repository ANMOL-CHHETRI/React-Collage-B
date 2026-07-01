import { test, expect } from '@playwright/test';

test('Search product', async ({ page }) => {
  await page.goto('/');

  const searchInput = page.getByPlaceholder('Search traditional Dhaka, Ilam tea, organic honey...');
  await searchInput.fill('dhaka');
  await page.keyboard.press('Enter');

  await expect(page.getByRole('heading', { name: /featured nepalese goods/i })).toBeVisible();
});